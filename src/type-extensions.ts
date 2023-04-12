import { TransactionRequest } from "@ethersproject/abstract-provider";

export interface KlaytnTransactionRequest extends TransactionRequest {
  signatures?: any;
}
