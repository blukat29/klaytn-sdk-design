import _ from "lodash";
import { TypedFields, TypedFieldsFactory } from "./field"
import { SignatureLike, getSignatureTuple } from "./sig";
import { HexStr } from "./util";

export abstract class TypedTx extends TypedFields {

  ////////////////////////////////////////////////////////////
  // Child classes MUST override below properties and methods

  // RLP encoding for sender to sign.
  abstract sigRLP(): string;
  // RLP encoding for broadcasting. Includes all signatures.
  abstract txHashRLP(): string;
  // Set its own fields from an RLP encoded string.
  // abstract setFieldsFromSenderTxHashRLP(rlp: string): void;
  // abstract setFieldsFromTxHashRLP(rlp: string): void;

  ////////////////////////////////////////////////////////////
  // Child classes MAY override below methods

  // RLP encoding for fee payer to sign.
  sigFeePayerRLP(): string {
    throw new Error(`fee payer not supported in txtype ${this.type}`);
  }
  // RLP encoding with sender signature.
  senderTxHashRLP(): string {
    return this.sigRLP();
  }

  // Add a signature
  addSenderSig(sig: SignatureLike) {
    if (!this.fieldTypes.txSignatures) {
      throw new Error(`No 'txSignatures' field in txtype '${this.type}'`);
    }
    const tuple = getSignatureTuple(sig);
    this.fields.txSignatures ||= [];
    this.fields.txSignatures.push(tuple);
  }

  // Add a signature as a feePayer
  addFeePayerSig(sig: SignatureLike) {
    if (!this.fieldTypes.feePayerSignatures) {
      throw new Error(`No 'feePayerSignatures' field in txtype '${this.type}'`);
    }
    const tuple = getSignatureTuple(sig);
    this.fields.feePayerSignatures ||= [];
    this.fields.feePayerSignatures.push(tuple);
  }

  // TODO: Add a feepayer signature. works like addSignature.

  // End override
  ////////////////////////////////////////////////////////////
}

class _TypedTxFactory extends TypedFieldsFactory<TypedTx> {
  public fromRLP(value: string): TypedTx {
    if (!HexStr.isHex(value)) {
      throw new Error(`Not an RLP encoded string`);
    }

    const rlp = HexStr.from(value);
    if (rlp.length < 4) {
      throw new Error(`RLP encoded string too short`);
    }

    const type = HexStr.toNumber(rlp.substr(0,4));
    const ctor = this.lookup(type);
    const instance = new ctor();
    instance.setFieldsFromRLP(rlp);
    return instance;
  }
}

const requiredFields = ['type', 'chainId', 'txSignatures'];
export const TypedTxFactory = new _TypedTxFactory(
  requiredFields,
);
