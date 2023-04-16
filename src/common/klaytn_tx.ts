import { RLP, HexStr } from "./util";
import {
  FieldTypeAddress,
  FieldTypeSignatureTuples,
  FieldTypeUint8,
  FieldTypeUint64,
  FieldTypeUint256 } from "./field"
import { TypedTx } from "./tx";

// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypevaluetransfer
export class TypedTxValueTransfer extends TypedTx {
  static type = 8;
  static typeName = "TxTypeValueTransfer";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'to':           FieldTypeAddress,
    'value':        FieldTypeUint256,
    'from':         FieldTypeAddress,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from]), chainid, 0, 0])
    const inner = this.getFields([
      'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from']);
    return RLP.encode([
      RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  txRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, txSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'txSignatures']);
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }
}
