export { KlaytnTx, TypedTxFactory } from "./klaytn_tx";
export { TypedAccountKey, TypedAccountKeyFactory } from "./account";


import { TypedTxFactory } from "./klaytn_tx";

// Basic TX 
import {
  TxTypeValueTransfer,
  TxTypeValueTransferMemo,
  TxTypeSmartContractDeploy,
  TxTypeSmartContractExecution,
  TxTypeAccountUpdate,
  TxTypeCancel, 
  TxTypeChainDataAnchoring,
} from "./klaytn_tx_basic";

TypedTxFactory.add(TxTypeValueTransfer);
TypedTxFactory.add(TxTypeValueTransferMemo);
TypedTxFactory.add(TxTypeSmartContractDeploy);
TypedTxFactory.add(TxTypeSmartContractExecution);
TypedTxFactory.add(TxTypeAccountUpdate);
TypedTxFactory.add(TxTypeCancel);
TypedTxFactory.add(TxTypeChainDataAnchoring);

// Fee Delegation TX
import {
  TxTypeFeeDelegatedValueTransfer,
  TxTypeFeeDelegatedValueTransferMemo,
  TxTypeFeeDelegatedSmartContractDeploy,
  TxTypeFeeDelegatedSmartContractExecution,
  TxTypeFeeDelegatedAccountUpdate,
  TxTypeFeeDelegatedCancel, 
  TxTypeFeeDelegatedChainDataAnchoring,
} from "./klaytn_tx_feeDelegation";

TypedTxFactory.add(TxTypeFeeDelegatedValueTransfer);
TypedTxFactory.add(TxTypeFeeDelegatedValueTransferMemo);
TypedTxFactory.add(TxTypeFeeDelegatedSmartContractDeploy);
TypedTxFactory.add(TxTypeFeeDelegatedSmartContractExecution);
TypedTxFactory.add(TxTypeFeeDelegatedAccountUpdate);
TypedTxFactory.add(TxTypeFeeDelegatedCancel);
TypedTxFactory.add(TxTypeFeeDelegatedChainDataAnchoring);

// Partial Fee Delegation TX
import {
  TxTypeFeeDelegatedValueTransferWithRatio,
  TxTypeFeeDelegatedValueTransferMemoWithRatio,
  TxTypeFeeDelegatedSmartContractDeployWithRatio,
  TxTypeFeeDelegatedSmartContractExecutionWithRatio,
  TxTypeFeeDelegatedAccountUpdateWithRatio,
  TxTypeFeeDelegatedCancelWithRatio, 
  TxTypeFeeDelegatedChainDataAnchoringWithRatio,
} from "./klaytn_tx_partialFeeDelegation";

TypedTxFactory.add(TxTypeFeeDelegatedValueTransferWithRatio);
TypedTxFactory.add(TxTypeFeeDelegatedValueTransferMemoWithRatio);
TypedTxFactory.add(TxTypeFeeDelegatedSmartContractDeployWithRatio);
TypedTxFactory.add(TxTypeFeeDelegatedSmartContractExecutionWithRatio);
TypedTxFactory.add(TxTypeFeeDelegatedAccountUpdateWithRatio);
TypedTxFactory.add(TxTypeFeeDelegatedCancelWithRatio);
TypedTxFactory.add(TxTypeFeeDelegatedChainDataAnchoringWithRatio);

import {
  TypedAccountKeyLegacy,
  TypedAccountKeyPublic,
} from "./klaytn_account";

import { TypedAccountKeyFactory } from "./account";
TypedAccountKeyFactory.add(TypedAccountKeyLegacy);
TypedAccountKeyFactory.add(TypedAccountKeyPublic);
