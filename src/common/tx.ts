import _ from "lodash";
import { FieldType, FieldTypes, Fields, TypedFields } from "./field"
import { SignatureLike, getSignatureTuple } from "./sig";

export abstract class TypedTx extends TypedFields {

  ////////////////////////////////////////////////////////////
  // Child classes MUST override below properties and methods

  // RLP encoding for sender to sign.
  abstract sigRLP(): string;
  // RLP encoding for broadcasting. Includes all signatures.
  abstract txRLP(): string;

  ////////////////////////////////////////////////////////////
  // Child classes MAY override below methods

  // RLP encoding for fee payer to sign.
  sigFeePayerRLP(): string {
    throw new Error(`fee payer not supported in txtype ${this.type}`);
  }
  // RLP encoding with sender signature.
  sigSenderTxRLP(): string {
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

  static isSupportedType(type?: number): boolean {
    return !!type && !!TxTypes[type];
  }

  // Create a TypedTx instance of the appropriate type
  static fromObject(fields: Fields): TypedTx {
    if (!fields.type) {
      throw new Error(`missing 'type' field`);
    }

    const Class = TxTypes[fields.type];
    if (!Class) {
      throw new Error(`unsupported tx type ${fields.type}`);
    }

    const tx = new Class();
    tx.setFields(fields);
    return tx;
  }

  // Return a plain object
  toObject(): Fields { return this.fields; }
}

// Non-abstract child class of TypedTx
export interface ConcreteTypedTx {
  type: number;
  fieldTypes: FieldTypes;
  new (): TypedTx;
}

export const TxTypes: {
  [type: number]: ConcreteTypedTx;
} = {};

// These fields are used in the abstract TypedTx class.
const mandatoryFields = ['type', 'chainId'];

export function registerTxType(cls: ConcreteTypedTx) {
  const type = cls.type;
  const fieldTypes = cls.fieldTypes;

  if (!type) {
    throw new Error(`Missing TypedTx.type`);
  }
  if (type == 0 || type == 1 || type == 2) {
    throw new Error(`New txtype cannot be ${type}`);
  }
  if (TxTypes[type]) {
    throw new Error(`Already registered txtype ${type}`);
  }

  if (!fieldTypes) {
    throw new Error(`Missing TypedTx.fieldTypes`);
  }
  for (const name of mandatoryFields) {
    if (!fieldTypes[name]) {
      throw new Error(`A TypedTx must at least have '${name}' field`);
    }
  }

  TxTypes[cls.type] = cls;
}
