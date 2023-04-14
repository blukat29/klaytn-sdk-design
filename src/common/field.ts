import _ from "lodash";
import { BytesLike, arrayify, hexlify, splitSignature } from "@ethersproject/bytes";
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
  // serialize a canonical value into an RLP-friendly value.
  serialize(value: any): string | any[];
  // unserialize a RLP-friendly value into canonical value.
  unserialize(str: string | any[]): any;
  // default empty value in canonical form.
  emptyValue(): any;
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

// List of signature tuples used in Klaytn transactions,
// [ [v1,r1,s1], [v2,r2,s2] ];
export type SignatureTuple = [number, string, string];

// [v, r, s] tuple or { v, r, s } object
interface SignatureObject {
  r: string;
  s: string;
  v?: number;
  recoveryParam?: number;
}
type Signature =
  SignatureTuple |
  SignatureObject |
  BytesLike;

// If the sig is an array, the first element 'v' must be one of:
// - pre-EIP-155 v: {27, 28}
// - EIP-155 v: {27, 28} + chainId*8 + 2
//
// If the sig is in object form, it must have one of:
// - sig.recoveryParam: {0, 1}
// - sig.v
//   - pre-EIP-155 v: {27, 28}
//   - EIP-155 v: {27, 28} + chainId*8 + 2
//
// If the sig is bytes, it must be 64 or 65 bytes.
export function getSignatureTuple(sig: Signature): SignatureTuple {
  // For array, pass through splitSignature() for sanity check
  if (_.isArray(sig) && sig.length == 3) {
    sig = { v: sig[0], r: sig[1], s: sig[2] };
  }
  const split = splitSignature(sig);
  return [split.v, split.r, split.s];
}

// Accepted types:
// Canonical type: hex string of checksumed address
export class FieldTypeSignatureTuples implements FieldType {
  canonicalize(value: Signature[]): SignatureTuple[] {
    return _.map(value, getSignatureTuple);
  }
  serialize(value: SignatureTuple[]): any[] {
    return _.map(value, (tuple) => {
      const strV = BigNumber.from(tuple[0]).toHexString();
      return [strV, tuple[1], tuple[2]];
    });
  }
  unserialize(str: string): string {
    return str;
  }
  emptyValue(): SignatureTuple[] { return [] };
}
