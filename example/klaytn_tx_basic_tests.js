const ethers = require("ethers");
const { KlaytnWallet } = require("../dist/ethers"); // require("@klaytn/sdk-ethers");

// const url = "https://public-en-baobab.klaytn.net";
const url = "https://api.baobab.klaytn.net:8651";
// const priv = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// const priv = "0xb3cf575dea0081563fe5482de2fe4425e025502b1f4ae7e02b2540ac0a5beda1";

// AccountUpdate 
// const priv = "0x349a0ea7201619771d6702f1a32f94ff89386dc35ef1a110e8937ea3938a17e1"; // address 0x27cfe94807f4bf2ed2f13b5f1e8c8911ac55316f
const priv = "0xf8cc7c3813ad23817466b1802ee805ee417001fcce9376ab8728c92dd8ea0a6b"; 

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new KlaytnWallet(priv, provider);

  // most fields can be auto-filled by populateTransaction.
  let txs = [ 
    // TxTypeValueTransfer
    {
      type: 8,
      // nonce:5700,
      // gasPrice: 25e9,
      // gasLimit: 30000,
      to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      value: 1e12,
      // from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      // chainId: 1001,
    },

    // TxTypeValueTransferMemo
    // https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypevaluetransfermemo
    {
      type: 0x10,
      // nonce:5700,
      // gasPrice: 25e9,
      gasLimit: 1000000,   // Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
      to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      value: 1e12,
      // from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      input: "0x1234567890",
      // chainId: 1001,
    },

    //
    // TxTypeSmartContractDeploy
    //
    // type: Must be 0x28,
    // nonce: if not exist, this field will be filled.
    // gasPrice: if not exist, this field will be filled.
    // gasLimit: Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
    // to:    "0x0000000000000000000000000000000000000000",
    // value: Must be 0, if not payable
    // from: "0x3208ca99480f82bfe240ca6bc06110cd12bb6366",
    // input: SmartContract binary, 
    // chainId: 1001,
    // humanReadable: false,
    // codeFormat: Must be 0x00
    {
      type: 0x28,
      gasLimit: 1000000000, 
      to:    "0x0000000000000000000000000000000000000000",
      value: 0,  
      from: "0x3208ca99480f82bfe240ca6bc06110cd12bb6366",
      input: "0x608060405234801561001057600080fd5b5060f78061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80633fb5c1cb1460415780638381f58a146053578063d09de08a14606d575b600080fd5b6051604c3660046083565b600055565b005b605b60005481565b60405190815260200160405180910390f35b6051600080549080607c83609b565b9190505550565b600060208284031215609457600080fd5b5035919050565b60006001820160ba57634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220e0f4e7861cb6d7acf0f61d34896310975b57b5bc109681dbbfb2e548ef7546b364736f6c63430008120033",
      // chainId: 1001,
      humanReadable: false,
      codeFormat: 0x00
    },

    // TxTypeSmartContractExecution
    {
      type: 0x30,
      // nonce:5700,
      // gasPrice: 25e9,
      gasLimit: 1000000000,   // Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
      to:    "0xDAAa90156Ff49F388994406631c52732E364bB38",
      value: 0,  // Must be 0 if it is not payable
      from: "0x3208ca99480f82bfe240ca6bc06110cd12bb6366",
      input: "0x3fb5c1cb0000000000000000000000000000000000000000000000000000000000000001",
      // chainId: 1001,
    },

    // TxTypeAccountUpdate1
    {
      type: 0x20,
      // nonce:5700,
      // gasPrice: 25e9,
      // gasLimit: 30000,
      // from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      // key: {
      //   type: 0x01, // AccountKeyLegacy
      // },
      key: {
        type: 0x02, // AccountKeyPublic
        key: "0x02dbac81e8486d68eac4e6ef9db617f7fbd79a04a3b323c982a09cdfc61f0ae0e8"
      },
      // chainId: 1001,
    },

    // TxTypeAccountUpdate2
    {
      type: 0x20,
      // nonce:5700,
      // gasPrice: 25e9,
      // gasLimit: 30000,
      from: "0x27cfe94807f4bf2ed2f13b5f1e8c8911ac55316f", // have to be defined
      key: {
        type: 0x02, // AccountKeyPublic
        key: "0x02dbac81e8486d68eac4e6ef9db617f7fbd79a04a3b323c982a09cdfc61f0ae0e8"
      },
      // chainId: 1001,
    },

    // TxTypeCancel
    {
      type: 0x38,
      nonce:2,
      from: "0x27cfe94807f4bf2ed2f13b5f1e8c8911ac55316f", // have to be defined
    },

    // TypedTxChainDataAnchoring ?
  ]; 
  let testOX = [ 
    false, // TxTypeValueTransfer
    false, // TxTypeValueTransferMemo
    false, // TxTypeSmartContractDeploy
    false, // TxTypeSmartContractExecution
    false, // TxTypeAccountUpdate1
    false, // TxTypeAccountUpdate2
    true,  // TxTypeCancel
  ]; 

  for ( let i = 0; i < txs.length ; i++) {
    if (testOX[i] == false )
      continue; 

    if (1) {
      // One-shot (recommended)
      const sentTx = await wallet.sendTransaction(txs[i]);
      console.log('txhash', sentTx.hash);
  
      const rc = await sentTx.wait();
      console.log('receipt', rc);
    } else {
      // Step-by-step
      popTx = await wallet.populateTransaction(txs[i]);
      console.log('tx', popTx);
  
      const rawTx = await wallet.signTransaction(popTx);
      console.log('rawTx', rawTx);
  
      const txhash = await provider.send("klay_sendRawTransaction", [rawTx]);
      console.log('txhash', txhash);
  
      const rc = await provider.waitForTransaction(txhash);
      console.log('receipt', rc);
    }
  }
}

main();
