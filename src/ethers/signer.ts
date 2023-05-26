import { Wallet } from "@ethersproject/wallet";
import { Provider, TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { KlaytnTxFactory } from "../core";
import { Deferrable, keccak256, resolveProperties } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";
import _ from "lodash";
import { encodeTxForRPC } from "../core/klaytn_tx";
import { HexStr } from "../core/util";

// @ethersproject/abstract-signer/src.ts/index.ts:allowedTransactionKeys
const ethersAllowedTransactionKeys: Array<string> = [
  "accessList", "ccipReadEnabled", "chainId", "customData", "data", "from", "gasLimit", "gasPrice", "maxFeePerGas", "maxPriorityFeePerGas", "nonce", "to", "type", "value",
];

// ethers.js may strip or reject some Klaytn-specific transaction fields.
// To prserve transaction fields around super method calls, use
// saveCustomFields and restoreCustomFields.
function saveCustomFields(tx: Deferrable<TransactionRequest>): any {
  // Save fields that are not allowed in ethers.js
  const savedFields: any = {};
  for (const key in tx) {
    if (ethersAllowedTransactionKeys.indexOf(key) === -1) {
      savedFields[key] = _.get(tx, key);
      _.unset(tx, key);
    }
  }

  // Save txtype that is not supported in ethers.js.
  // and disguise as legacy (type 0) transaction.
  //
  // Why disguise as legacy type?
  // Signer.populateTransaction() will not fill gasPrice
  // unless tx type is explicitly Legacy (type=0) or EIP-2930 (type=1).
  // Klaytn tx types, however, always uses gasPrice.
  if (_.isNumber(tx.type) && KlaytnTxFactory.has(tx.type)) {
    savedFields['type'] = tx.type;
    tx.type = 0;
  }

  // 'from' may not be corresponded to the public key of the private key in Klaytn account
  // So 'from' field also has to be saved
  savedFields['from'] = tx.from;
  _.unset(tx, 'from');
  
  return savedFields;
}

function restoreCustomFields(tx: Deferrable<TransactionRequest>, savedFields: any) {
  for (const key in savedFields) {
    _.set(tx, key, savedFields[key]);
  }
}

// Wallet API dynamic hooking
// Wallet.populateTransaction = function() {
// };

export class KlaytnWallet extends Wallet {

  private klaytn_address: string | undefined;

  constructor(address: any, privateKey?: any, provider?: Provider) {
    let str_addr = String(address); 

    if ( HexStr.isHex(address) && str_addr.length == 42 && str_addr.startsWith("0x")) {
      super( privateKey, provider); 
      this.klaytn_address = address; 
    } else if ( HexStr.isHex(address) && str_addr.length == 40 && !str_addr.startsWith("0x")) {
      super( privateKey, provider); 
      this.klaytn_address = "0x" + address; 
    } else {
      provider = privateKey; 
      privateKey = address;
      super( privateKey, provider); 
    }
  }

  // getAddress(): Promise<string> {
  //   return Promise.resolve( String(this.klaytn_address) );
  // }

  checkTransaction(transaction: Deferrable<TransactionRequest>): Deferrable<TransactionRequest> {
    const savedFields = saveCustomFields(transaction);
    transaction = super.checkTransaction(transaction);
    restoreCustomFields(transaction, savedFields);

    return transaction;
  }

  async populateTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionRequest> {
    let tx: TransactionRequest = await resolveProperties(transaction);

    if (!KlaytnTxFactory.has(tx.type)) {
      return super.populateTransaction(tx);
    }

    // Klaytn AccountKey is not matched with pubKey of the privateKey 
    if ( !(tx.nonce) && !!(this.klaytn_address)) {
      if (this.provider instanceof JsonRpcProvider ) { 
        const result = await this.provider.getTransactionCount( this.klaytn_address);
        tx.nonce = result;
      } else {
        throw new Error(`Klaytn transaction can only be populated from a Klaytn JSON-RPC server`);
      }
    }

    if ( !(tx.gasPrice) ) {
      if (this.provider instanceof JsonRpcProvider ) {
        const result = await this.provider.send("klay_gasPrice", []);
        tx.gasPrice = result;
      } else {
        throw new Error(`Klaytn transaction can only be populated from a Klaytn JSON-RPC server`);
      }
    }

    if ( !(tx.gasLimit) && !!(tx.to) ) {
      if (this.provider instanceof JsonRpcProvider ) {

        const estimateGasAllowedKeys: string[] = [
          "from", "to", "gasLimit", "gasPrice", "value", "input" ];
        let ttx = encodeTxForRPC( estimateGasAllowedKeys, tx );

        const result = await this.provider.send("klay_estimateGas", [ttx]);
        // For the problem that estimateGas does not exactly match, 
        // the code for adding some Gas must be processed in the wallet or Dapp.
        // e.g. 
        //   In ethers, no special logic to modify Gas
        //   In Metamask, multiply 1.5 to Gas for ensuring that the estimated gas is sufficient
        //   https://github.com/MetaMask/metamask-extension/blob/9d38e537fca4a61643743f6bf3409f20189eb8bb/ui/ducks/send/helpers.js#L115
        tx.gasLimit = result*1.5;  
        console.log('gasLimit', result)
      } else {
        throw new Error(`Klaytn transaction can only be populated from a Klaytn JSON-RPC server`);
      }
    }

    const savedFields = saveCustomFields(tx);
    tx = await super.populateTransaction(tx);
    restoreCustomFields(tx, savedFields);

    return tx;
  }

  // TODO: refactor like below
  // async rpc_estimateGas(tx: TransactionRequest): Promise<number> {
  //   let allowExtra = {

  //   }
  //   let rpcTx = JsonRpcProvider.hexlifyTransaction(tx, allowExtra);

  //   if (this.provider instanceof JsonRpcProvider ) {
      
  //   }
  //   return 0;
  // }

  async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
    let tx: TransactionRequest = await resolveProperties(transaction);

    if (!KlaytnTxFactory.has(tx.type)) {
      return super.signTransaction(tx);
    }

    const ttx = KlaytnTxFactory.fromObject(tx);
    const sigHash = keccak256(ttx.sigRLP());
    const sig = this._signingKey().signDigest(sigHash);

    if (tx.chainId) { // EIP-155
      sig.v = sig.recoveryParam + tx.chainId * 2 + 35;
    }
    ttx.addSenderSig(sig);

    if ( ttx.hasFeePayer() ) {
      return ttx.senderTxHashRLP()
    }
    return ttx.txHashRLP();
  }

  async signTransactionAsFeePayer(transaction: Deferrable<TransactionRequest> ): Promise<string> {
    let tx: TransactionRequest = await resolveProperties(transaction);

    const ttx = KlaytnTxFactory.fromObject(tx);
    if ( !ttx.hasFeePayer() ) {
      throw new Error(`This transaction can not be signed as FeePayer`);
    }

    const sigFeePayerHash = keccak256(ttx.sigFeePayerRLP());
    const sig = this._signingKey().signDigest(sigFeePayerHash);

    if (tx.chainId) { // EIP-155
      sig.v = sig.recoveryParam + tx.chainId * 2 + 35;
    }
    ttx.addFeePayerSig(sig);

    return ttx.txHashRLP();
  }

  async sendTransaction(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse> {
    this._checkProvider("sendTransaction");
    const tx = await this.populateTransaction(transaction);
    const signedTx = await this.signTransaction(tx);

    if (!KlaytnTxFactory.has(tx.type)) {
      return await this.provider.sendTransaction(signedTx);
    }

    if (this.provider instanceof JsonRpcProvider) {
      // eth_sendRawTransaction cannot process Klaytn typed transactions.
      const txhash = await this.provider.send("klay_sendRawTransaction", [signedTx]);
      return await this.provider.getTransaction(txhash);
    } else {
      throw new Error(`Klaytn typed transaction can only be broadcasted to a Klaytn JSON-RPC server`);
    }
  }

  async sendTransactionAsFeePayer(transaction: Deferrable<TransactionRequest>): Promise<TransactionResponse> {
    this._checkProvider("sendTransactionAsFeePayer");
    const tx = await this.populateTransaction(transaction);
    const signedTx = await this.signTransactionAsFeePayer(tx);

    if (!KlaytnTxFactory.has(tx.type)) {
      return await this.provider.sendTransaction(signedTx);
    }

    if (this.provider instanceof JsonRpcProvider) {
      // eth_sendRawTransaction cannot process Klaytn typed transactions.
      const txhash = await this.provider.send("klay_sendRawTransaction", [signedTx]);
      return await this.provider.getTransaction(txhash);
    } else {
      throw new Error(`Klaytn typed transaction can only be broadcasted to a Klaytn JSON-RPC server`);
    }
  }
}
