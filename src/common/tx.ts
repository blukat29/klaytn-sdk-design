import _ from "lodash";
import { FieldType } from "./field"
import { Signature, SignatureLike } from "./util";

interface FieldTypes {
  [name: string]: FieldType;
}

interface Fields {
  [name: string]: any;
}

export abstract class TypedTx {

  ////////////////////////////////////////////////////////////
  // Child classes MUST override below properties and methods

  // An 1-byte TxType number
  public static type: number;
  // Type declaration of tx fields.
  public static fieldTypes: FieldTypes;

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
    if (!this._static.fieldTypes.txSignatures) {
      throw new Error(`No 'txSignatures' field in txtype '${this.type}'`);
    }
    const tuple = Signature.toTuple(sig);
    this.fields.txSignatures ||= [];
    this.fields.txSignatures.push(tuple);
  }

  // Add a feepayer signature. works like addSignature.

  // End override
  ////////////////////////////////////////////////////////////

  // this.type is shortcut for this._static.type.
  protected type: number;

  // Constructor has no arguments to make child classes simple.
  constructor() {
    this.type = this._static.type;
  }

  // Tx fields in their canonical forms.
  protected fields: Fields = {};

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

  toObject(): Fields { return this.fields; }

  // A workaround to read child class's static members.
  private get _static(): typeof TypedTx {
    return this.constructor as typeof TypedTx;
  }

  // Reset all fields
  protected setFields(tx: Fields): void {
    this.fields = {};
    _.forOwn(this._static.fieldTypes, (fieldType, name) => {
      if (tx[name]) {
        this.fields[name] = fieldType.canonicalize(tx[name]);
      } else {
        this.fields[name] = null;
      }
    });
  }

  protected getField(name: string): any {
    const value = this.fields[name];
    if (value == null) {
      throw new Error(`Missing transaction field '${name}' for txtype ${this.type}`);
    }
    return value;
  }

  protected getFields(names: string[]): any[] {
    return _.map(names, (name) => this.getField(name));
  }
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
