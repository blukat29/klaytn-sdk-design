# klaytn-sdk-design

Design exploration for the new Klaytn SDK

## Subpackages

```
@klaytn/sdk-common   # klaytn tx types, keystore handling, account structure, etc utils.
@klaytn/sdk-ethers   # extensions to ethers.Wallet and ethers.Provider
@klaytn/sdk-web3     # extensions to web3.Account and web3.Provider
@klaytn/sdk-rpc      # klaytn json-rpc wrappers
```

## Usage

```js
const ethers = require("ethers");
require("@klaytn/sdk-ethers");
```
