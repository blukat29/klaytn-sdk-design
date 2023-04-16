import _ from "lodash";
import { HexStr } from "./util";
import { SignatureLike, SignatureTuple, getSignatureTuple } from "./sig";
import { BigNumber } from "@ethersproject/bignumber";
import { getAddress } from "@ethersproject/address";

export class FieldError extends Error {
  constructor(ty: FieldType, name: string, value: any) {
    const message = `Cannot assign value '${value}' to field '${name}' of type '${ty.constructor.name}'`;
    super(message);
    this.name = 'FieldError';
  }
}

export interface FieldType {
  // convert into the canonical form.
  canonicalize(value: any): any;
  // default empty value in canonical form.
  emptyValue(): any;
}

export interface FieldTypes {
  [name: string]: FieldType;
}

export interface Fields {
  [name: string]: any;
}

// Accepted types: hex string, byte array
// Canonical type: hex string
export const FieldTypeBytes = new class implements FieldType {
  canonicalize(value: any): string { return HexStr.from(value); }
  emptyValue(): string { return "0x"; }
}

// Accepted types: hex string of an address
// Canonical type: hex string of checksumed address
export const FieldTypeAddress = new class implements FieldType {
  canonicalize(value: any): string { return getAddress(value); }
  emptyValue(): string { return "0x"; }
}

export class FieldTypeBytesFixedLen implements FieldType {
  length: number;
  constructor(length: number) {
    this.length = length;
  }
  canonicalize(value: any): string {
    if (!HexStr.isHex(value, this.length)) {
      throw new Error(`Value is not ${this.length} bytes`);
    }
    return HexStr.from(value);
  }
  emptyValue(): string { return "0x00"; }
}

// Accepted types: hex-encoded string
// Canonical type: hex-encoded string
export const FieldTypeCompressedPubKey = new FieldTypeBytesFixedLen(33);

export class FieldTypeNumberBits implements FieldType {
  maxBits: number;
  maxBN: BigNumber;
  constructor(maxBits?: number) {
    if (!maxBits) {
      maxBits = 256;
    }
    this.maxBits = maxBits;
    this.maxBN = BigNumber.from(2).pow(maxBits);
  }
  canonicalize(value: any): string {
    const bn = BigNumber.from(value);
    if (bn.gte(this.maxBN)) {
      throw new Error(`Number exceeds ${this.maxBits} bits`);
    }
    return bn.toHexString();
  }
  emptyValue(): string { return "0x00"; }
}

// Accepted types: JS number, JS bigint, BigNumber class, hex-encoded string
// Canonical type: hex string
export const FieldTypeUint8 = new FieldTypeNumberBits(8);
export const FieldTypeUint32 = new FieldTypeNumberBits(32);
export const FieldTypeUint64 = new FieldTypeNumberBits(64);
export const FieldTypeUint256 = new FieldTypeNumberBits(256);

// Accepted types: [v,r,s] tuple, {v,r,s} object, serialized bytes
// Canonical type: [v,r,s] tuple
export const FieldTypeSignatureTuples = new class implements FieldType {
  canonicalize(value: SignatureLike[]): SignatureTuple[] {
    return _.map(value, getSignatureTuple);
  }
  emptyValue(): SignatureTuple[] { return [] };
}

export abstract class TypedFields {

  ////////////////////////////////////////////////////////////
  // Child classes MUST override below properties and methods

  // An 1-byte type enum
  public static type: number;

  // Human readable name of the type. Appears in error messages.
  public static typeName: string;

  // Fields declaration
  public static fieldTypes: FieldTypes;

  // End override
  ////////////////////////////////////////////////////////////

  // shortcuts for this._static.*.
  protected type: number = 0;
  protected typeName: string = "";
  protected fieldTypes: FieldTypes = {};

  // Fields in their canonical forms.
  protected fields: Fields = {};

  constructor() {
    this.type = this._static.type;
    this.typeName = this._static.typeName;
    this.fieldTypes = this._static.fieldTypes;
  }

  // A workaround to read child class's static members.
  private get _static(): typeof TypedFields {
    return this.constructor as typeof TypedFields;
  }

  // Fields accessors

  public setFields(obj: Fields): void {
    this.fields = {};
    _.forOwn(this.fieldTypes, (fieldType, name) => {
      if (obj[name]) {
        this.fields[name] = fieldType.canonicalize(obj[name]);
      } else {
        this.fields[name] = null;
      }
    });
  }

  public getField(name: string): any {
    const value = this.fields[name];
    if (value == null) {
      throw new Error(`Missing field '${name}' for '${this.typeName}' (type ${this.type})`);
    }
    return value;
  }

  public getFields(names: string[]): any[] {
    return _.map(names, (name) => this.getField(name));
  }

  public toObject(): Fields {
    return this.fields;
  }
}

// Instantiable child class of TypedFields
export interface ConcreteTypedFields<T extends TypedFields> {
  type: number;
  fieldTypes: FieldTypes;
  new (): T;
}

export class TypedFieldsFactory<T extends TypedFields> {
  private registry: { [type: number]: ConcreteTypedFields<T> } = {};
  private requiredFields: string[];

  constructor(requiredFields?: string[]) {
    this.requiredFields = requiredFields || [];
  }

  public add(cls: ConcreteTypedFields<T>) {
    const type = cls.type;
    const fieldTypes = cls.fieldTypes;

    if (!type) {
      throw new Error(`Cannot register TypedFields: Missing type`);
    }
    if (this.registry[type]) {
      throw new Error(`Cannot register TypedFields: type ${type} already registered`);
    }

    if (!fieldTypes) {
      throw new Error(`Cannot register TypedFields: Missing fieldTypes`);
    }
    for (const name of this.requiredFields) {
      if (!fieldTypes[name]) {
        throw new Error(`Cannot register TypedFields: Missing required field '${name}'`);
      }
    }

    this.registry[type] = cls;
  }

  public has(type?: number): boolean {
    return !!type && !!this.registry[type];
  }

  public lookup(type?: number): ConcreteTypedFields<T> {
    if (!type || !this.has(type)) {
      throw new Error(`Unsupported type '${type}'`);
    }
    return this.registry[type];
  }

  public fromObject(fields: Fields): T {
    const ctor = this.lookup(fields?.type);
    const instance = new ctor();
    instance.setFields(fields);
    return instance;
  }
}
