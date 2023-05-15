const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

const fs = require('fs')
const sender_priv = fs.readFileSync('./example/privateKey', 'utf8') 

const sender = '0x3208ca99480f82bfe240ca6bc06110cd12bb6366' 
const reciever = '0xc40b6909eb7085590e1c26cb3becc25368e249e9'  

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
async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')
  const wallet = new KlaytnWallet(sender_priv, provider);
   
  // 1) send ValueTransfer tx with the original nonce+1
  let tx = {
      type: 8,         
      gasLimit: 30000, 
      to: reciever,
      value: 1e12,
      from: sender,
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
    from: sender, 
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
