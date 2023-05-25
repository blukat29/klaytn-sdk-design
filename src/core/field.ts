import _ from "lodash";
import { HexStr, RLP } from "./util";
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

// Accepted types: hex string of an address
// Canonical type: hex string of checksumed address
export const FieldTypeAddress = new class implements FieldType {
  canonicalize(value: any): string { 
    if (value === "0x") {
      return "0x0000000000000000000000000000000000000000"
    }
    return getAddress(value); 
  }
  emptyValue(): string { return "0x"; }
}

// Accepted types: hex string, byte array
// Canonical type: hex string
export const FieldTypeBytes = new class implements FieldType {
  canonicalize(value: any): string { return HexStr.from(value); }
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

// e.g.
// [
//   "03",
//   [
//     [
//       "01",
//       "02c734b50ddb229be5e929fc4aa8080ae8240a802d23d3290e5e6156ce029b110e"
//     ],
//     [
//       "01",
//       "0212d45f1cc56fbd6cd8fc877ab63b5092ac77db907a8a42c41dad3e98d7c64dfb"
//     ],
//     [
//       "01",
//       "02ea9a9f85065a00d7b9ffd3a8532a574035984587fd08107d8f4cbad6b786b0cd"
//     ],
//     [
//       "01",
//       "038551bc489d62fa2e6f767ba87fe93a62b679fca8ff3114eb5805e6487b51e8f6"
//     ]
//   ]
// ]
export const FieldTypeMultiKeys = new class implements FieldType {
  canonicalize(value: [ number, any[] ]): any[] {
    
    let ret = [], keys = [];

    ret.push( HexStr.fromNumber(value[0]) );
    console.log( HexStr.fromNumber(value[0]) );

    for ( let i=0; i<value[1].length ; i++){
      let key = []; 
      key.push( HexStr.fromNumber( value[1][i][0] ));
      key.push( value[1][i][1] );
      console.log( i, ': ', HexStr.fromNumber( value[1][i][0]), ',', value[1][i][1]);
      
      keys.push( key );
      console.log( keys );
    }

    return ret;
  }
  emptyValue(): string {  return "0x"; };
}

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
    if (value === "0x") {
      value = 0; 
    }
    const bn = BigNumber.from(value);

    if (bn.gte(this.maxBN)) {
      throw new Error(`Number exceeds ${this.maxBits} bits`);
    }

    if (bn.isZero()) {
      return "0x";
    }
    return bn.toHexString();
  }
  emptyValue(): string { return "0x"; }
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

export const FieldTypeBool = new class implements FieldType {
  canonicalize(value: any): string {
    if (value === "0x01" || value === "0x") {
      return value; 
    }
    return value? "0x01" : "0x" ;
  }
  emptyValue(): string { return "0x" };
}
export abstract class FieldSet {

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
  public readonly type: number = 0;
  public readonly typeName: string = "";
  public readonly fieldTypes: FieldTypes = {};

  // Fields in their canonical forms.
  protected fields: Fields = {};

  constructor() {
    this.type = this._static.type;
    this.typeName = this._static.typeName;
    this.fieldTypes = this._static.fieldTypes;
  }

  // A workaround to read child class's static members.
  private get _static(): typeof FieldSet {
    return this.constructor as typeof FieldSet;
  }

  // Fields accessors

  public setFields(obj: Fields): void {
    this.fields = {};
    _.forOwn(this.fieldTypes, (fieldType, name) => {
      if (obj[name] === undefined) {
        this.fields[name] = null;
      } else {
        this.fields[name] = fieldType.canonicalize(obj[name]);
      }
    });
  }

  public setFieldsFromArray(names: string[], array: any[]): void {
    this.fields = {};
    for (var i = 0; i < array.length; i++) {
      const name = names[i];
      const fieldType = this.fieldTypes[name];
      if (!fieldType) {
        throw new Error(`Unknown field '${name}' for '${this.typeName}' (type ${this.type})`);
      }
      this.fields[name] = fieldType.canonicalize(array[i])
    }
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
export interface ConcreteFieldSet<T extends FieldSet> {
  type: number;
  fieldTypes: FieldTypes;
  new (): T;
}

export class FieldSetFactory<T extends FieldSet> {
  private registry: { [type: number]: ConcreteFieldSet<T> } = {};
  private requiredFields: string[];

  constructor(requiredFields?: string[]) {
    this.requiredFields = requiredFields || [];
  }

  public add(cls: ConcreteFieldSet<T>) {
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

  public has(type?: any): boolean {
    if (!!type && HexStr.isHex(type)) 
      return !!type && !!this.registry[HexStr.toNumber(type)];
  
    return !!type && !!this.registry[type];
  }

  public lookup(type?: any): ConcreteFieldSet<T> {
    if (!type || !this.has(type))
      throw new Error(`Unsupported type '${type}'`);
    
    if ( HexStr.isHex(type))
      return this.registry[HexStr.toNumber(type)];
    
    return this.registry[type];
  }

  public fromObject(fields: Fields): T {
    const ctor = this.lookup(fields?.type);
    const instance = new ctor();
    instance.setFields(fields);
    return instance;
  }
}