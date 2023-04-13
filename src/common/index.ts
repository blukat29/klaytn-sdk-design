import { TypedTx, registerTxType } from "./tx";

import {
  TypedTxValueTransfer
} from "./klaytn_tx";
registerTxType(TypedTxValueTransfer);

export {
  TypedTx,
};
