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
  isHex(value: any, length?: number): boolean {
    return bytes.isHexString(value, length);
  },
  stripZeros(value: any): any {
    return bytes.stripZeros(value);
  }
};
