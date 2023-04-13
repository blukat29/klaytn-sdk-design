import _ from "lodash";
import { FieldType, FieldTypeAddress } from "./field"

interface FieldTypes {
  [name: string]: FieldType;
}

interface Fields {
  [name: string]: any;
}

abstract class TxType {
  abstract type: number;
  abstract fieldTypes: FieldTypes;

  private fields: Fields = {};

  constructor(tx: any) {
  }
}

class TxTypeValueTransfer extends TxType {
  type = 0x08;
  fieldTypes = {
    'to': FieldTypeAddress
  };

  constructor(tx: any) {
    super(tx);
  }


}
