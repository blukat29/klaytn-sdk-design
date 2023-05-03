const ethers = require("ethers");
const { KlaytnWallet } = require("../dist/ethers"); // require("@klaytn/sdk-ethers");

const url = "http://localhost:8571";
const priv = "0x8f00b81846d73995bb1f38f725843487700020a103b86f4493f98002bfcd175f"; // address 0xd92032b27f0475c34ee74cf6b4e04882abff5b18

//
// To test TxTypeCancel,
// there must be a tx that will not included in a block and exists in the pending queue.
// So we recommend 
// 
// 1) Before you execute this script, set up local 1CN-1EN.
// 2) Shut down CN to stop mining. 
// 3) Execute this script. 
//
//    You can look at the detial status with EN console. 
//    3-1) Connect EN's console (e.g. > ken attach data/klay.ipc)
//    3-2) Query txVT's hash with klay.getTransaction() and klay.getTransactionReciept(), 
//         Check the result of both queries are null
//    3-3) Query txCancel's hash with klay.getTransaction() and klay.getTransactionReciept(), 
//         Check the result of klay.getTransaction() with blocknumber 0
//         Check the result of klay.getTransactionReciept() is null
//
// 4) Start CN again. 
//
//    You can look at the detial status with EN console. 
//    4-1) Connect EN's console (e.g. > ken attach data/klay.ipc)
//    4-2) Query txVT's hash with klay.getTransaction() and klay.getTransactionReciept(), 
//         Check the result of both queries are not null
//         Check the result of klay.getTransaction() with non-zero blocknumber 
// 

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new KlaytnWallet(priv, provider);

  // TxTypeValueTransfer
  let txVT =  {
      type: 8,
      gasPrice: 25e9,     // TODO: eth_estimateGas debug
      gasLimit: 30000,
      to: "0x3208ca99480f82bfe240ca6bc06110cd12bb6366",
      value: 1e12,
      from: "0xd92032b27f0475c34ee74cf6b4e04882abff5b18",
    };

  // txVT will be in the pending queue
  const sentTx = await wallet.sendTransaction(txVT);
  console.log('txhash', sentTx.hash);

  // TxTypeCancel
  let txCancel = {
      type: 0x38,
      nonce: sentTx.nonce,
      gasPrice: 25e9,      
      gasLimit: 30000,     
      from: "0xd92032b27f0475c34ee74cf6b4e04882abff5b18", 
    };

  popTx = await wallet.populateTransaction(txCancel);
  console.log('tx', popTx);

  const rawTx = await wallet.signTransaction(popTx);
  console.log(rawTx);
  
  const txhash = await provider.send("klay_sendRawTransaction", [rawTx]);
  console.log('txhash', txhash);

  const rc = await provider.waitForTransaction(txhash);
  console.log('receipt', rc);
}

main();