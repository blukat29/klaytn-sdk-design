export { KlaytnTx, TypedTxFactory } from "./tx";
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
} from "./klaytn_tx_feeDelegation";

TypedTxFactory.add(TypedTxFeeDelegatedValueTransfer);
TypedTxFactory.add(TypedTxFeeDelegatedValueTransferMemo);
TypedTxFactory.add(TypedTxFeeDelegatedSmartContractDeploy);
TypedTxFactory.add(TypedTxFeeDelegatedSmartContractExecution);
TypedTxFactory.add(TypedTxFeeDelegatedAccountUpdate);
TypedTxFactory.add(TypedTxFeeDelegatedCancel);
TypedTxFactory.add(TypedTxFeeDelegatedChainDataAnchoring);

// Partial Fee Delegation TX
import {
  TypedTxFeeDelegatedValueTransferWithRatio,
  TypedTxFeeDelegatedValueTransferMemoWithRatio,
  TypedTxFeeDelegatedSmartContractDeployWithRatio,
  TypedTxFeeDelegatedSmartContractExecutionWithRatio,
  TypedTxFeeDelegatedAccountUpdateWithRatio,
  TypedTxFeeDelegatedCancelWithRatio, 
  TypedTxFeeDelegatedChainDataAnchoringWithRatio,
} from "./klaytn_tx_partialFeeDelegation";

TypedTxFactory.add(TypedTxFeeDelegatedValueTransferWithRatio);
TypedTxFactory.add(TypedTxFeeDelegatedValueTransferMemoWithRatio);
TypedTxFactory.add(TypedTxFeeDelegatedSmartContractDeployWithRatio);
TypedTxFactory.add(TypedTxFeeDelegatedSmartContractExecutionWithRatio);
TypedTxFactory.add(TypedTxFeeDelegatedAccountUpdateWithRatio);
TypedTxFactory.add(TypedTxFeeDelegatedCancelWithRatio);
TypedTxFactory.add(TypedTxFeeDelegatedChainDataAnchoringWithRatio);

import {
  TypedAccountKeyLegacy,
  TypedAccountKeyPublic,
} from "./klaytn_account";

import { TypedAccountKeyFactory } from "./account";
TypedAccountKeyFactory.add(TypedAccountKeyLegacy);
TypedAccountKeyFactory.add(TypedAccountKeyPublic);
