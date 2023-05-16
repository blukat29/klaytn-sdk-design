// export { KlaytnTx, KlaytnTxFactory as TypedTxFactory } from "./tx";
// export { AccountKey as TypedAccountKey, AccountKeyFactory as TypedAccountKeyFactory } from "./account";

export { KlaytnTx, KlaytnTxFactory } from "./tx";
export { AccountKey, AccountKeyFactory } from "./account";

import { KlaytnTxFactory } from "./tx";

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

KlaytnTxFactory.add(TxTypeValueTransfer);
KlaytnTxFactory.add(TxTypeValueTransferMemo);
KlaytnTxFactory.add(TxTypeSmartContractDeploy);
KlaytnTxFactory.add(TxTypeSmartContractExecution);
KlaytnTxFactory.add(TxTypeAccountUpdate);
KlaytnTxFactory.add(TxTypeCancel);
KlaytnTxFactory.add(TxTypeChainDataAnchoring);

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

KlaytnTxFactory.add(TxTypeFeeDelegatedValueTransfer);
KlaytnTxFactory.add(TxTypeFeeDelegatedValueTransferMemo);
KlaytnTxFactory.add(TxTypeFeeDelegatedSmartContractDeploy);
KlaytnTxFactory.add(TxTypeFeeDelegatedSmartContractExecution);
KlaytnTxFactory.add(TxTypeFeeDelegatedAccountUpdate);
KlaytnTxFactory.add(TxTypeFeeDelegatedCancel);
KlaytnTxFactory.add(TxTypeFeeDelegatedChainDataAnchoring);

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

KlaytnTxFactory.add(TxTypeFeeDelegatedValueTransferWithRatio);
KlaytnTxFactory.add(TxTypeFeeDelegatedValueTransferMemoWithRatio);
KlaytnTxFactory.add(TxTypeFeeDelegatedSmartContractDeployWithRatio);
KlaytnTxFactory.add(TxTypeFeeDelegatedSmartContractExecutionWithRatio);
KlaytnTxFactory.add(TxTypeFeeDelegatedAccountUpdateWithRatio);
KlaytnTxFactory.add(TxTypeFeeDelegatedCancelWithRatio);
KlaytnTxFactory.add(TxTypeFeeDelegatedChainDataAnchoringWithRatio);

import {
  TypedAccountKeyLegacy,
  TypedAccountKeyPublic,
} from "./klaytn_account";

import { AccountKeyFactory } from "./account";
AccountKeyFactory.add(TypedAccountKeyLegacy);
AccountKeyFactory.add(TypedAccountKeyPublic);
