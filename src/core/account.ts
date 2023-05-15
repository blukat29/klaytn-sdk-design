import { FieldType, TypedFields, TypedFieldsFactory } from "./field";

export abstract class TypedAccountKey extends TypedFields {

  ////////////////////////////////////////////////////////////
  // Child classes MUST override below properties and methods

  // RLP encoding to be used in AccountUpdate transactions.
  abstract toRLP(): string;

  // End override
  ////////////////////////////////////////////////////////////
}

const requiredFields = ['type'];
export const TypedAccountKeyFactory = new TypedFieldsFactory<TypedAccountKey>(
  requiredFields,
);


// Accepted types: TypedAccountKey, string, plain object, serialized bytes
export const FieldTypeAccountKey = new class implements FieldType {
  canonicalize(value: TypedAccountKey | string | any): string {
    if (value instanceof TypedAccountKey) {
      return value.toRLP();
    } else if (typeof(value) == 'string') {
      return value;
    } else {
      return TypedAccountKeyFactory.fromObject(value).toRLP();
    }
  }
  emptyValue(): string { return ""; }
}