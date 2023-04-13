import { TransactionRequest } from "@ethersproject/abstract-provider";

type KlaytnSignatures = Array<[number, string, string]>

export interface KlaytnTransactionRequest extends TransactionRequest {
  signatures?: KlaytnSignatures;
}
