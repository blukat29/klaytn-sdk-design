export { TypedTx, TypedTxFactory } from "./tx";
export { TypedAccountKey, TypedAccountKeyFactory } from "./account";


import { TypedTxFactory } from "./tx";

// Basic TX 
import {
  TypedTxValueTransfer,
  TypedTxValueTransferMemo,
  TypedTxSmartContractDeploy,
  TypedTxSmartContractExecution,
  TypedTxAccountUpdate,
  TypedTxCancel, 
  TypedTxChainDataAnchoring,
} from "./klaytn_tx_basic";

TypedTxFactory.add(TypedTxValueTransfer);
TypedTxFactory.add(TypedTxValueTransferMemo);
TypedTxFactory.add(TypedTxSmartContractDeploy);
TypedTxFactory.add(TypedTxSmartContractExecution);
TypedTxFactory.add(TypedTxAccountUpdate);
TypedTxFactory.add(TypedTxCancel);
TypedTxFactory.add(TypedTxChainDataAnchoring);

// Fee Delegation TX
import {
  TypedTxFeeDelegatedValueTransfer,
  TypedTxFeeDelegatedValueTransferMemo,
  TypedTxFeeDelegatedSmartContractDeploy,
  TypedTxFeeDelegatedSmartContractExecution,
  TypedTxFeeDelegatedAccountUpdate,
  TypedTxFeeDelegatedCancel, 
  TypedTxFeeDelegatedChainDataAnchoring,
} from "./klaytn_tx_fee_delegation";

TypedTxFactory.add(TypedTxFeeDelegatedValueTransfer);
TypedTxFactory.add(TypedTxFeeDelegatedValueTransferMemo);
TypedTxFactory.add(TypedTxFeeDelegatedSmartContractDeploy);
TypedTxFactory.add(TypedTxFeeDelegatedSmartContractExecution);
TypedTxFactory.add(TypedTxFeeDelegatedAccountUpdate);
TypedTxFactory.add(TypedTxFeeDelegatedCancel);
TypedTxFactory.add(TypedTxFeeDelegatedChainDataAnchoring);

import {
  TypedAccountKeyLegacy,
  TypedAccountKeyPublic,
} from "./klaytn_account";

import { TypedAccountKeyFactory } from "./account";
TypedAccountKeyFactory.add(TypedAccountKeyLegacy);
TypedAccountKeyFactory.add(TypedAccountKeyPublic);
