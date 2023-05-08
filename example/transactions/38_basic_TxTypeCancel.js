const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

const fs = require('fs')
const privateKey1 = fs.readFileSync('./example/privateKey', 'utf8') // private key of sender 

const account1 = '0x3208ca99480f82bfe240ca6bc06110cd12bb6366' // sender address 
const account2 = '0xc40b6909eb7085590e1c26cb3becc25368e249e9' // reciever address 

//
// TxTypeCancel
// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypecancel
// 
//   type: Must be 0x38,
//
// 1) send ValueTransfer tx with the original nonce+1  
// 2) send Cancel tx with the original nonce+1 
// 3) send ValueTransfer tx with the original nonce 
// 
// To test TxTypeCancel more detail,
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
  const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')
  const wallet = new KlaytnWallet(privateKey1, provider);
   
  // 1) send ValueTransfer tx with the original nonce+1
  let tx = {
      type: 8,         
      gasLimit: 30000, 
      to: account2,
      value: 1e12,
      from: account1,
    }; 
  
  popTx = await wallet.populateTransaction(tx);
  console.log('tx', popTx);

  popTx.nonce = popTx.nonce + 1; 
  console.log('tx with nonce + 1', popTx);

  const rawTx = await wallet.signTransaction(popTx);
  console.log('rawTx', rawTx);

  const txhash = await provider.send("klay_sendRawTransaction", [rawTx]);
  console.log('txhash', txhash);

  // 2) send Cancel tx with the original nonce+1 
  let txCancel = {
    type: 0x38,
    nonce: popTx.nonce, 
    gasLimit: 30000,     
    from: account1, 
  };
    
  const cancelTx = await wallet.sendTransaction(txCancel);
  console.log('tx Cancel', cancelTx);

  // 3) send ValueTransfer tx with the original nonce
  const sentTx = await wallet.sendTransaction(tx);
  console.log('tx original', sentTx);

  const rc = await sentTx.wait();
  console.log('receipt', rc);
}

main();
