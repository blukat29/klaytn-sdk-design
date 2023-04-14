import { encode, decode } from "@ethersproject/rlp";
import { FieldTypeAddress, FieldTypeSignatureTuples, FieldTypeUint256, FieldTypeUint64, FieldTypeUint8 } from "./field"
import { TypedTx } from "./tx";

// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypevaluetransfer
export class TypedTxValueTransfer extends TypedTx {
  static type = 8;
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gas':          FieldTypeUint64,
    'to':           FieldTypeAddress,
    'value':        FieldTypeUint256,
    'from':         FieldTypeAddress,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    const inner = encode(this.serializeFields([
      'type', 'nonce', 'gasPrice', 'gas', 'to', 'value', 'from']));
    const outer = encode([
      inner, ...this.serializeFields(['chainId']), "0x", "0x"]);
    return outer;
  }

  txRLP(): string {
    return "";
  }
}
