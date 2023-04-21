import { Wallet } from "@ethersproject/wallet";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { TypedTxFactory } from "../core";
import { Deferrable, keccak256, resolveProperties } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import _ from "lodash";

// @ethersproject/abstract-signer/src.ts/index.ts:allowedTransactionKeys
const ethersAllowedTransactionKeys: Array<string> = [
  "accessList", "ccipReadEnabled", "chainId", "customData", "data", "from", "gasLimit", "gasPrice", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "to", "type", "value",
];

// ethers.js may strip or reject some Klaytn-specific transaction fields.
// To prserve transaction fields around super method calls, use
// saveCustomFields and restoreCustomFields.
function saveCustomFields(tx: Deferrable<TransactionRequest>): any {
  // Save fields that are not allowed in ethers.js
  const savedFields: any = {};
  for (const key in tx) {
    if (ethersAllowedTransactionKeys.indexOf(key) === -1) {
      savedFields[key] = _.get(tx, key);
      _.unset(tx, key);
    }
  }

  // Save txtype that is not supported in ethers.js.
  // and disguise as legacy (type 0) transaction.
  //
  // Why disguise as legacy type?
  // Signer.populateTransaction() will not fill gasPrice
  // unless tx type is explicitly Legacy (type=0) or EIP-2930 (type=1).
  // Klaytn tx types, however, always uses gasPrice.
  if (_.isNumber(tx.type) && TypedTxFactory.has(tx.type)) {
    savedFields['type'] = tx.type;
    tx.type = 0;
  }

  return savedFields;
}

function restoreCustomFields(tx: Deferrable<TransactionRequest>, savedFields: any) {
  for (const key in savedFields) {
    _.set(tx, key, savedFields[key]);
  }
}

export class KlaytnWallet extends Wallet {
  checkTransaction(transaction: Deferrable<TransactionRequest>): Deferrable<TransactionRequest> {

    const savedFields = saveCustomFields(transaction);
    transaction = super.checkTransaction(transaction);
    restoreCustomFields(transaction, savedFields);

    return transaction;
  }

  async populateTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionRequest> {
    let tx: TransactionRequest = await resolveProperties(transaction);

    if (!TypedTxFactory.has(tx.type)) {
      return super.populateTransaction(tx);
    }

    const savedFields = saveCustomFields(tx);
    tx = await super.populateTransaction(tx);
    restoreCustomFields(tx, savedFields);

    return tx;
  }

  async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
    let tx: TransactionRequest = await resolveProperties(transaction);

    if (!TypedTxFactory.has(tx.type)) {
      return super.signTransaction(tx);
    }

    tx = await this.populateTransaction(tx);

    const ttx = TypedTxFactory.fromObject(tx);
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

    if (!TypedTxFactory.has(tx.type)) {
      return await this.provider.sendTransaction(signedTx);
    }

    if (this.provider instanceof JsonRpcProvider) {
      // eth_sendRawTransaction cannot process Klaytn typed transactions.
      const txhash = await this.provider.send("klay_sendRawTransaction", [signedTx]);
      return await this.provider.getTransaction(txhash);
    } else {
      throw new Error(`Klaytn typed transaction can only be broadcasted to a Klaytn JSON-RPC server`);
    }
  }
}
