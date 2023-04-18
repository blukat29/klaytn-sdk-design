import { TypedAccountKey } from "./account";
import { FieldTypeUint8, FieldTypeCompressedPubKey } from "./field";
import { HexStr, RLP } from "./util";

export class TypedAccountKeyLegacy extends TypedAccountKey {
  static type = 0x01;
  static typeName = "AccountKeyLegacy";
  static fieldTypes = {
    'type': FieldTypeUint8,
  }

  toRLP(): string {
    return "0x01c0";
  }
}

export class TypedAccountKeyPublic extends TypedAccountKey {
  static type = 0x02;
  static typeName = "AccountKeyPublic";
  static fieldTypes = {
    'type': FieldTypeUint8,
    'key':  FieldTypeCompressedPubKey,
  };

  toRLP(): string {
    const inner = this.getField("key");
    return HexStr.concat("0x02", RLP.encode(inner));
  }
}
