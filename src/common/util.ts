import _ from "lodash";
import * as rlp from "@ethersproject/rlp";
import * as bytes from "@ethersproject/bytes";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";

export const RLP = {
  encode: rlp.encode,
  decode: rlp.decode,
};

export const HexStr = {
  toNumber(value: string): number {
    return BigNumber.from(value).toNumber();
  },
  fromNumber(value: BigNumberish): string {
    return BigNumber.from(value).toHexString();
  },
  from(value: any): string {
    return bytes.hexlify(value);
  },
  concat(...items: string[]): string {
    return bytes.hexlify(bytes.concat(items));
  },
};

// List of signature tuples used in Klaytn transactions.
// All elements must be string for convenient RLP encoding.
// [ [v1,r1,s1], [v2,r2,s2] ];
export type SignatureTuple = [string, string, string];

// Commonly used signature object.
export interface SignatureObject {
  r: string;
  s: string;
  v?: number;
  recoveryParam?: number;
}

// All kinds of ECDSA signatures returned from various libraries.
export type SignatureLike =
  SignatureTuple |
  SignatureObject |
  string;

export const Signature = {
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
  //
  // Returns a [v,r,s] tuple composed of only strings. For example, [
  //   "0x1b",
  //   "0x66809fb130a6ea4ae4e823baa92573a5f1bfb4e88e64048aecfb18a2b4012b99",
  //   "0x75c2c3e5f7b0a182c767137c488649cd5104a5e747371fd922d618e328e5c508",
  // ]
  toTuple(sig: SignatureLike): SignatureTuple {
  // For array, pass through splitSignature() for sanity check
  if (_.isArray(sig) && sig.length == 3) {
    const numV = HexStr.toNumber(sig[0]);
    sig = { v: numV, r: sig[1], s: sig[2] };
  }
  const split = bytes.splitSignature(sig);
  const strV = HexStr.fromNumber(split.v);
  return [strV, split.r, split.s];
  }
};
