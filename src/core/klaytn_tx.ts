import { FieldTypeAccountKey } from "./account";
import { RLP, HexStr } from "./util";
import {
  FieldTypeAddress,
  FieldTypeSignatureTuples,
  FieldTypeBool,
  FieldTypeUint8,
  FieldTypeUint64,
  FieldTypeUint256, 
  FieldTypeBytes} from "./field";
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

// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypevaluetransfermemo
export class TypedTxValueTransferMemo extends TypedTx {
  static type = 0x10;
  static typeName = "TxTypeValueTransfer";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'to':           FieldTypeAddress,
    'value':        FieldTypeUint256,
    'from':         FieldTypeAddress,
    'input':        FieldTypeBytes,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from, input]), chainid, 0, 0])
    const inner = this.getFields([
      'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input']);
    return RLP.encode([
      RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  txRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, input, txSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'txSignatures']);
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypesmartcontractdeploy
export class TypedTxSmartContractDeploy extends TypedTx {
  static type = 0x28;
  static typeName = "TxTypeSmartContractDeploy";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'to':           FieldTypeAddress,
    'value':        FieldTypeUint256,
    'from':         FieldTypeAddress,
    'input':        FieldTypeBytes,
    'humanReadable': FieldTypeBool,
    'codeFormat':   FieldTypeUint8,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, to, value, from, input, humanReadable, codeFormat]), chainid, 0, 0])
    const inner = this.getFields([
      'type', 'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'humanReadable', 'codeFormat']);
    return RLP.encode([
      RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  txRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, to, value, from, input, humanReadable, codeFormat, txSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'to', 'value', 'from', 'input', 'humanReadable', 'codeFormat', 'txSignatures']);
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }
}

// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypesmartcontractexecution


// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypeaccountupdate
export class TypedTxAccountUpdate extends TypedTx {
  static type = 0x20;
  static typeName = "TxTypeAccountUpdate";
  static fieldTypes = {
    'type':         FieldTypeUint8,
    'nonce':        FieldTypeUint64,
    'gasPrice':     FieldTypeUint256,
    'gasLimit':     FieldTypeUint64,
    'from':         FieldTypeAddress,
    'key':          FieldTypeAccountKey,
    'chainId':      FieldTypeUint64,
    'txSignatures': FieldTypeSignatureTuples,
  };

  sigRLP(): string {
    // SigRLP = encode([encode([type, nonce, gasPrice, gas, from, rlpEncodedKey]), chainid, 0, 0])
    const inner = this.getFields([
      'type', 'nonce', 'gasPrice', 'gasLimit', 'from', 'key']);
    return RLP.encode([
      RLP.encode(inner), this.getField('chainId'), "0x", "0x"]);
  }

  txRLP(): string {
    // TxHashRLP = type + encode([nonce, gasPrice, gas, from, rlpEncodedKey, txSignatures])
    const inner = this.getFields([
      'nonce', 'gasPrice', 'gasLimit', 'from', 'key', 'txSignatures']);
    return HexStr.concat(
      this.getField('type'), RLP.encode(inner));
  }
}
