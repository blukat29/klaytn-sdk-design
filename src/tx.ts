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

// import { KlaytnTx } from "@klaytn/sdk-commons";
abstract class AbstractTx {
  type: number;
  tx: any;

  constructor(type: number, tx: any) {
    this.type = type;
    this.tx = tx;
    this.validate();
  }

  abstract validate(): void;
  abstract sigRLP(): string;
  abstract txHashRLP(): string;
}

// @ethersproject/transactions/src.ts/index.ts
function formatNumber(value: BigNumberish, name?: string): Uint8Array {
  const result = stripZeros(BigNumber.from(value).toHexString());
  if (result.length > 32) {
    throw new Error(`too long field transaction.${name}: ${value}`);
  }
  return result;
}

export class TxTypeValueTransfer extends AbstractTx {
  constructor(tx: any) {
    super(0x08, tx);
  }

  validate(): void {
    if (!this.tx.from) {
      throw new Error("missing from");
    }
  }

  sigRLP(): string {
    // https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypevaluetransfer
    let inner = RLP.encode([
      formatNumber(this.type, "type"),
      formatNumber(this.tx.nonce, "nonce"),
      formatNumber(this.tx.gasPrice, "gasPrice"),
      formatNumber(this.tx.gasLimit, "gas"),
      this.tx.to,
      formatNumber(this.tx.value, "value"),
      this.tx.from,
    ]);
    let outer = RLP.encode([
      inner,
      formatNumber(this.tx.chainId, "chainId"),
      formatNumber(0, "r"),
      formatNumber(0, "s"),
    ]);
    return outer;
  }

  txHashRLP(): string {
    let sigArr = _.map(this.tx.signatures, ([v, r, s]) => RLP.encode([
      formatNumber(v),
      r,
      s,
    ]));
    let sigs = RLP.encode(sigArr);

    let outer = RLP.encode([
      formatNumber(this.tx.nonce, "nonce"),
      formatNumber(this.tx.gasPrice, "gasPrice"),
      formatNumber(this.tx.gasLimit, "gas"),
      this.tx.to,
      formatNumber(this.tx.value, "value"),
      this.tx.from,
      sigs,
    ]);
    return outer; // TODO prepend type
  }
}

export const KlaytnTxType = {
  ValueTransfer:             0x08,
  FeeDelegatedValueTransfer: 0x09,
}

export class KlaytnTx {
  static isKlaytnTxType(type?: number): boolean {
    if (!type) {
      return false;
    } else {
      return _.includes(_.values(KlaytnTxType), type);
    }
  }

  // TODO: wrapTx
}
// end "@klaytn/sdk-commons";
