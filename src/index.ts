import ethers from "ethers";
import { Deferrable } from "ethers/lib/utils";
import { Transaction, UnsignedTransaction } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/abstract-provider";
import { Signer } from "@ethersproject/abstract-signer";
import { Bytes, BytesLike } from "ethers/lib/utils";

class KlaytnTxSigner extends Signer {

  async getAddress(): Promise<string> {
    return "";
  }

  async signMessage(message: Bytes | string): Promise<string> {
    return "";
  }

  async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
    return "";
  }

  connect(provider: Provider): Signer {
    return this;
  }
}

