import { Wallet } from "@ethersproject/wallet";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { TypedTx } from "../common";
import { Deferrable, keccak256, resolveProperties } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import { poll } from "@ethersproject/web";

export class KlaytnWallet extends Wallet {
  async populateTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionRequest> {
    let tx: TransactionRequest = await resolveProperties(transaction);

    // Signer.populateTransaction() will not fill gasPrice
    // unless tx type is explicitly Legacy (type=0) or EIP-2930 (type=1).
    // Klaytn tx types, however, always uses gasPrice.
    // Pretend it's a legacy transaction, so we can receive gasPrice nontheless.
    const savedType = tx.type;
    tx.type = 0;
    tx = await super.populateTransaction(tx);
    tx.type = savedType;

    return tx;
  }

  async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
    let tx: TransactionRequest = await resolveProperties(transaction);

    if (!TypedTx.isSupportedType(tx.type)) {
      return super.signTransaction(tx);
    }

    tx = await this.populateTransaction(tx);

    const ttx = TypedTx.fromObject(tx);
    const sighash = keccak256(ttx.sigRLP());
    const sig = this._signingKey().signDigest(sighash);

    if (tx.chainId) { // EIP-155
      sig.v = sig.recoveryParam + tx.chainId * 2 + 35;
    }
    ttx.addTxSignature(sig);
    return ttx.txRLP();
  }

  async sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse> {
    this._checkProvider("sendTransaction");
    const tx = await this.populateTransaction(transaction);
    const signedTx = await this.signTransaction(tx);

    if (!TypedTx.isSupportedType(tx.type)) {
      return await this.provider.sendTransaction(signedTx);
    }

    if (this.provider instanceof JsonRpcProvider) {
      // eth_sendRawTransaction cannot process Klaytn typed transactions.
      const txhash = await this.provider.send("klay_sendRawTransaction", [signedTx]);
      return await this.waitTransactionPooled(txhash);
    } else {
      throw new Error(`Klaytn typed transaction can only be broadcasted to a Klaytn JSON-RPC server`);
    }
  }

  async waitTransactionPooled(hash: string): Promise<TransactionResponse> {
    // ethers.js/providers/src.ts/json-rpc-provider.ts:JsonRpcSigner.sendTransaction
    const func = async (): Promise<TransactionResponse | undefined> => {
      const tx = await this.provider.getTransaction(hash);
      if (tx === null) {
        return undefined; // triggers retry
      }
      return tx;
    };
    const option = { oncePoll: this.provider };

    const tx = await poll(func, option);
    if (tx !== undefined) {
      return tx;
    } else {
      throw new Error(`Cannot find transaction '${hash}' in txpool`);
    }
  }
}
