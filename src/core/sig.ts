import _ from "lodash";
import { HexStr } from "./util";
import { splitSignature } from "@ethersproject/bytes";

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
export function getSignatureTuple(sig: SignatureLike): SignatureTuple {
  // For array, pass through splitSignature() for sanity check
  if (_.isArray(sig) && sig.length == 3) {
    const numV = HexStr.toNumber(sig[0]);
    sig = { v: numV, r: sig[1], s: sig[2] };
  }
  const split = splitSignature(sig);

  // R and S must not have leading zeros
  // c.f. https://github.com/ethers-io/ethers.js/blob/v5/packages/transactions/src.ts/index.ts#L298
  return [
    HexStr.fromNumber(split.v),
    HexStr.stripZeros(split.r),
    HexStr.stripZeros(split.s),
  ];
}