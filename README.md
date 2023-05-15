# klaytn-sdk-design

Design exploration for the new Klaytn SDK

## Run example

```
npm run build
npx ts-node example/klaytn_tx_ethers.ts
node example/klaytn_tx_ethers.js
```

## TODO
- ~~RLP decoding for adding fee payer's Signature~~
- Populating gasPrice, gasLimit through Klaytn RPC (WIP)
- fee delegation & partial fee delegation examples 
- recover function core & example
- Wallet API dynamic hooking 
- Klaytn account key core 
- Klaytn account key examples 
- ethers: Send Klaytn typed tx via browser wallet (i.e. Wallet.sendTransaction works when this.provider is no JsonRpcProvider)
- ethers: KlaytnWallet accepts address
- ethers: KlaytnWallet from v4 keystore
- ethers: Override ethers.Wallet by KlaytnWallet

## Subpackages

```
@klaytn/sdk          # umbrella package to import the essential features only
@klaytn/sdk/core     # klaytn tx types, keystore handling, account structure, etc utils.
@klaytn/sdk/ethers   # extensions to ethers.Wallet and ethers.Provider
@klaytn/sdk/web3     # extensions to web3.Account and web3.Provider
@klaytn/sdk/rpc      # klaytn json-rpc wrappers
```

## Core classes

```mermaid
classDiagram
  FieldType ..|> FieldTypeAddress
  FieldType ..|> FieldTypeBytes
  FieldType ..|> FieldTypeSignatureTuples
  FieldType ..|> FieldTypeAccountKey
  FieldType ..|> etc
  class FieldType {
    <<interface>> 
    canonicalize(any): any
    emptyValue(): any
  }
  class FieldTypeAddress {
    canonicalize(any): string
    emptyValue(): string
  }
  class FieldTypeBytes {
    canonicalize(any): string
    emptyValue(): string
  }
  class FieldTypeSignatureTuples {
    canonicalize( SignatureLike[]): SignatureTuple[]
    emptyValue(): SignatureTuple[]
  }
  class FieldTypeAccountKey {
    canonicalize(TypedAccountKey | string | any): string
    emptyValue(): string
  }
```

```mermaid  
classDiagram
  FieldSet <|-- KlaytnTx
  KlaytnTx <|-- TxTypeValueTransfer
  KlaytnTx <|-- TxTypeFeeDelegatedValueTransfer
  KlaytnTx <|-- etc
  FieldSet <|-- AccountKey
  AccountKey <|-- AccountKeyLegacy
  AccountKey <|-- AccountKeyPublic
  AccountKey <|-- AccountKeyWeightedMultiSig
  AccountKey <|-- etc
  class FieldSet {
    type: number
    typeName: string
    fieldTypes: string -> FieldType
    setFields(any)
    setFieldsFromArray( string[], any[] )
    getField( string ): any
    getFields( string[] ): any[]
    toObject(): any
  }
  class KlaytnTx {
    sigRLP(): string
    sigFeePayerRLP(): string
    senderTxHashRLP(): string
    txHashRLP(): string
    addSenderSig(sig)
    addFeePayerSig(sig)
    setFieldsFromRLP(string): void
  }
  class AccountKey {
    toRLP(): string
  }
```

```mermaid  
classDiagram
  FieldSetFactory <|.. KlaytnTxFactory
  FieldSetFactory <|.. AccountKeyFactory
  class FieldSetFactory {
    private registry: [number] -> FieldSet
    private requiredFields: string[]
    add(typeof T)
    has(type?): boolean
    lookup(type?): typeof T
    fromObject(any): T
  }
  class KlaytnTxFactory {
    fromRLP(string): KlaytnTx
  }
  class AccountKeyFactory {
    canonicalize(AccountKey | string | any): string 
    emptyValue(): string
  }
```

## ethers extension classes

```mermaid
classDiagram
  ethers_Wallet <|-- KlaytnWallet
  ethers_Signer <|-- ethers_Wallet
  class ethers_Signer {
    provider
    abstract getAddress()
    abstract signMessage()
    abstract signTransaction()
    sendTransaction()
  }
  class ethers_Wallet {
    address
    privateKey
    getAddress()
    signMessage()
    signTransaction()
    checkTransaction()
    populateTransaction()
    sendTransaction()
  }
  class KlaytnWallet {
    signTransaction()
    checkTransaction()
    populateTransaction()
    sendTransaction()
  }

  ethers_Provider <|-- ethers_BaseProvider
  ethers_BaseProvider <|-- ethers_JsonRpcProvider
  ethers_JsonRpcProvider <|-- KlaytnJsonRpcProvider
  class ethers_Provider {
    abstract sendTransaction()
    abstract call()
    abstract estimateGas()
  }
  class ethers_BaseProvider {
    sendTransaction()
    waitForTransaction()
  }
  class ethers_JsonRpcProvider {
    perform()
    send()
    prepareRequest() // "eth_sendRawTransaction"
  }
  class KlaytnJsonRpcProvider {
    sendTransaction()
    prepareRequest() // "klay_sendRawTransaction"
  }
```
