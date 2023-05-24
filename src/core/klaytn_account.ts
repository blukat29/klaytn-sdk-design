import { AccountKey } from "./account";
import { FieldTypeUint8, FieldTypeCompressedPubKey, FieldTypeMultiKeys } from "./field";
import { HexStr, RLP } from "./util";


// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeynil
export class AccountKeyNil extends AccountKey {
  static typeName = "AccountKeyNil";
  static fieldTypes = {
  }

  toRLP(): string {
    return "0x80";
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeylegacy
export class AccountKeyLegacy extends AccountKey {
  static type = 0x01;
  static typeName = "AccountKeyLegacy";
  static fieldTypes = {
    'type': FieldTypeUint8,
  }

  toRLP(): string {
    return "0x01c0";
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeypublic
export class AccountKeyPublic extends AccountKey {
  static type = 0x02;
  static typeName = "AccountKeyPublic";
  static fieldTypes = {
    'type': FieldTypeUint8,
    'key':  FieldTypeCompressedPubKey,
  };

  // 0x02 + encode(CompressedPubKey)
  toRLP(): string {
    const inner = this.getField("key");
    return HexStr.concat("0x02", RLP.encode(inner));
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeyfail
export class AccountKeyFail extends AccountKey {
  static type = 0x03;
  static typeName = "AccountKeyFail";
  static fieldTypes = {
    'type': FieldTypeUint8,
  }

  toRLP(): string {
    return "0x03c0";
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeyweightedmultisig
export class AccountKeyWeightedMultiSig extends AccountKey {
  static type = 0x04;
  static typeName = "AccountKeyWeightedMultiSig"; 
  static fieldTypes = {
    'type': FieldTypeUint8,
    'threshold': FieldTypeUint8,
    'weightedPublicKeys': FieldTypeMultiKeys,
  };

  // 0x04 + encode([threshold, [[weight, CompressedPubKey1], [weight2, CompressedPubKey2]]])
  toRLP(): string {
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
    const inner = this.getField("weightedPublicKeys");
    console.log( inner );
    console.log( 'to RLP', RLP.encode(inner) );
    return HexStr.concat("0x04", RLP.encode(inner));
  }
}


// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeyrolebased
export class AccountKeyRoleBased extends AccountKey {
  static type = 0x05;
  static typeName = "AccountKeyRoleBased";
  static fieldTypes = {
    'type': FieldTypeUint8,
    'keys':  FieldTypeCompressedPubKey,
  };

  // 0x05 + encode([key1, key2, key3])
  toRLP(): string {
    const inner = this.getField("keys");
    return HexStr.concat("0x05", RLP.encode(inner));
  }
}