export { TypedTx, TypedTxFactory } from "./tx";
export { TypedAccountKey, TypedAccountKeyFactory } from "./account";

import {
  TypedTxValueTransfer,
  TypedTxValueTransferMemo,
  TypedTxAccountUpdate,
} from "./klaytn_tx";

import { TypedTxFactory } from "./tx";
TypedTxFactory.add(TypedTxValueTransfer);
TypedTxFactory.add(TypedTxValueTransferMemo);
TypedTxFactory.add(TypedTxAccountUpdate);

import {
  TypedAccountKeyLegacy,
  TypedAccountKeyPublic,
} from "./klaytn_account";

import { TypedAccountKeyFactory } from "./account";
TypedAccountKeyFactory.add(TypedAccountKeyLegacy);
TypedAccountKeyFactory.add(TypedAccountKeyPublic);
