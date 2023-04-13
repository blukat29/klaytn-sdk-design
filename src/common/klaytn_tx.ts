import { FieldTypeAddress, FieldTypeUint256, FieldTypeUint8 } from "./field"
import { TypedTx } from "./tx";

export class TypedTxValueTransfer extends TypedTx {
  static type = 8;
  static fieldTypes = {
    'type':  FieldTypeUint8,
    'to':    FieldTypeAddress,
    'value': FieldTypeUint256,
  };

  sigRLP(): string {
    return this.encode(['type', 'to', 'value']);
  }
  rawTx(): string {
    return this.encode(['type', 'to', 'value']);
  }

}
