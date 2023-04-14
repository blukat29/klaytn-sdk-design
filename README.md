# klaytn-sdk-design

Design exploration for the new Klaytn SDK

## TODO

- common: TxTypes with feePayerSig
- common: Merge signed txs
- common: FieldTypeAccountUpdate
- ethers: Send Klaytn typed tx via browser wallet (i.e. Wallet.sendTransaction works when this.provider is no JsonRpcProvider)
- ethers: KlaytnWallet accepts address
- ethers: KlaytnWallet from v4 keystore
- ethers: Override ethers.Wallet by KlaytnWallet

## Subpackages

```
@klaytn/sdk-common   # klaytn tx types, keystore handling, account structure, etc utils.
@klaytn/sdk-ethers   # extensions to ethers.Wallet and ethers.Provider
@klaytn/sdk-web3     # extensions to web3.Account and web3.Provider
@klaytn/sdk-rpc      # klaytn json-rpc wrappers
```
