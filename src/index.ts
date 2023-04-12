import ethers from "ethers";
import _ from "lodash";
import { Deferrable } from "ethers/lib/utils";
import { VoidSigner, Wallet, Transaction, UnsignedTransaction } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Bytes, BytesLike } from "ethers/lib/utils";
import { keccak256, stripZeros } from "ethers/lib/utils";
import * as RLP from "@ethersproject/rlp";
import { BigNumber, BigNumberish } from "ethers";

import { KlaytnTransactionRequest } from "./type-extensions";
import { KlaytnTxType, KlaytnTx, TxTypeValueTransfer } from "./tx";
export { KlaytnTxType };


export abstract class KlaytnTxSigner extends Signer {

  constructor() {
    super();
  }

  async getAddress(): Promise<string> {
    return "";
  }

  async signMessage(message: Bytes | string): Promise<string> {
    return "";
  }

  async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
    return "";
  }

  connect(provider: Provider): Signer {
    return this;
  }
}

export class KlaytnWallet extends Wallet {
  async populateTransaction(tx: TransactionRequest): Promise<TransactionRequest> {
    tx = await super.populateTransaction(tx);
    if (KlaytnTx.isKlaytnTxType(tx?.type)) {
      if (tx.gasPrice == null) {
        tx.gasPrice = await this.getGasPrice();
      }
    }
    return tx;
  }

  async signTransaction(tx: KlaytnTransactionRequest): Promise<string> {
    if (!KlaytnTx.isKlaytnTxType(tx?.type)) {
      return super.signTransaction(tx);
    }

    let ktx = new TxTypeValueTransfer(tx);
    let sigHashRLP = ktx.sigRLP();
    let signature = this._signingKey().signDigest(keccak256(sigHashRLP));
    console.log(sigHashRLP);
    console.log(signature);

    let chainId = tx.chainId || await this.getChainId();
    ktx.tx.signatures = [
      [signature.v + 2*chainId + 8, signature.r, signature.s],
    ];

    let txHashRLP = ktx.txHashRLP();
    console.log('txHashRLP', txHashRLP);
    return txHashRLP;
  }
}
