import { TypedTx, TypedTxFactory } from "./tx";

import {
  TypedTxValueTransfer
} from "./klaytn_tx";

TypedTxFactory.add(TypedTxValueTransfer);

export { TypedTx, TypedTxFactory };
