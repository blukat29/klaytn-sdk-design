import _ from "lodash";
import { arrayify, hexlify, splitSignature } from "@ethersproject/bytes";
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
  // serialize a canonical value into a hex-string.
  serialize(value: any): string;
  // unserialize a hex-string into canonical value.
  unserialize(str: string): any;
  // default empty value in canonical form.
  emptyValue(): string;
}

// Accepted types: hex string, byte array
// Canonical type: hex string
export const FieldTypeBytes = new class implements FieldType {
  canonicalize(value: any): string { return hexlify(arrayify(value)); }
  serialize(value: string): string { return value; }
  unserialize(str: string): string { return str; }
  emptyValue(): string { return "0x"; }
}

// Accepted types: hex string of an address
// Canonical type: hex string of checksumed address
export const FieldTypeAddress = new class implements FieldType {
  canonicalize(value: any): string { return getAddress(value); }
  serialize(value: string): string { return value; }
  unserialize(str: string): string { return str; }
  emptyValue(): string { return "0x"; }
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
    const bn = BigNumber.from(value);
    if (bn.gte(this.maxBN)) {
      throw new Error(`Number exceeds ${this.maxBits} bits`);
    }
    return bn.toHexString();
  }
  serialize(value: string): string { return value; }
  unserialize(str: string): string { return str; }
  emptyValue(): string { return "0x00"; }
}

// Accepted types: JS number, JS bigint, BigNumber class, hex-encoded string
// Canonical type: hex string
export const FieldTypeUint8 = new FieldTypeNumberBits(8);
export const FieldTypeUint32 = new FieldTypeNumberBits(32);
export const FieldTypeUint64 = new FieldTypeNumberBits(64);
export const FieldTypeUint256 = new FieldTypeNumberBits(256);
