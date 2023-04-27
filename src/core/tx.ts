import _ from "lodash";
import { TypedFields, TypedFieldsFactory } from "./field"
import { SignatureLike, getSignatureTuple } from "./sig";

export abstract class TypedTx extends TypedFields {

  ////////////////////////////////////////////////////////////
  // Child classes MUST override below properties and methods

  // RLP encoding for sender to sign.
  abstract sigRLP(): string;
  // RLP encoding for broadcasting. Includes all signatures.
  abstract txHashRLP(): string;

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
  addTxSignature(sig: SignatureLike) {
    if (!this.fieldTypes.txSignatures) {
      throw new Error(`No 'txSignatures' field in txtype '${this.type}'`);
    }
    const tuple = getSignatureTuple(sig);
    this.fields.txSignatures ||= [];
    this.fields.txSignatures.push(tuple);
  }

  // TODO: Add a feepayer signature. works like addSignature.

  // End override
  ////////////////////////////////////////////////////////////
}

const requiredFields = ['type', 'chainId', 'txSignatures'];
export const TypedTxFactory = new TypedFieldsFactory<TypedTx>(
  requiredFields,
);
