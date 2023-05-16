const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");
const { objectFromRLP } = require("../../dist/src/core/tx");

const fs = require('fs');
const sender_priv = fs.readFileSync('./example/privateKey', 'utf8') // private key of sender 
const feePayer_priv = fs.readFileSync('./example/feePayerPrivateKey', 'utf8') // private key of feeDelegator

const sender = '0x3208ca99480f82bfe240ca6bc06110cd12bb6366' 
const reciever = '0xc40b6909eb7085590e1c26cb3becc25368e249e9' 
const feePayer = '0x24e8efd18d65bcb6b3ba15a4698c0b0d69d13ff7'

const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')

//
// TxTypeFeeDelegatedCancelWithRatio
// https://docs.klaytn.foundation/content/klaytn/design/transactions/partial-fee-delegation#txtypefeedelegatedcancelwithratio
// 
//   type: Must be 0x3a,
//
// 1) send ValueTransfer tx with the original nonce+1  
// 2) send Cancel tx with the original nonce+1 
// 3) send ValueTransfer tx with the original nonce 
//    then you can see Cancel tx with the original nonce+1 
// 

async function doSender( popTx ) {
  const sender_wallet = new KlaytnWallet(sender_priv, provider);
  
  let tx = {
    type: 0x3a,
    nonce: popTx.nonce, 
    gasLimit: 1000000000,
    from: sender,
    feeRatio: 30, 
  };

  tx = await sender_wallet.populateTransaction(tx);
  console.log(tx);

  const senderTxHashRLP = await sender_wallet.signTransaction(tx);
  console.log('senderTxHashRLP', senderTxHashRLP);

  return senderTxHashRLP; 
}

async function doFeePayer( senderTxHashRLP ) {
  const feePayer_wallet = new KlaytnWallet(feePayer_priv, provider);

  const tx = objectFromRLP( senderTxHashRLP );
  tx.feePayer = feePayer;
  console.log(tx);

  const popTx = await feePayer_wallet.populateTransaction(tx);
  console.log('popTx', popTx);

  const txHashRLP = await feePayer_wallet.signTransactionAsFeePayer( popTx );
  console.log('txHashRLP', txHashRLP);
  
  const txhash = await provider.send("klay_sendRawTransaction", [txHashRLP]);
  console.log('txhash', txhash);
}

async function main() {
  const wallet = new KlaytnWallet(sender_priv, provider);
   
  // 1) send ValueTransfer tx with the original nonce+1
  let tx = {
      type: 8,         
      gasLimit: 1000000000, 
      to: reciever,
      value: 1e12,
      from: sender,
    }; 
  
  popTx = await wallet.populateTransaction(tx);
  console.log('tx', popTx);

  popTx.nonce = popTx.nonce + 1; 
  console.log('tx(nonce + 1)', popTx);

  const rawTx = await wallet.signTransaction(popTx);
  console.log('rawTx(nonce + 1)', rawTx);

  const txhash = await provider.send("klay_sendRawTransaction", [rawTx]);
  console.log('txhash(nonce + 1)', txhash);

  // 2) send Cancel tx with the original nonce+1 
  const senderTxHashRLP = await doSender( popTx );
  await doFeePayer( senderTxHashRLP ); 

  // 3) send ValueTransfer tx with the original nonce
  const sentTx = await wallet.sendTransaction(tx);
  console.log('tx original', sentTx);

  const rc = await sentTx.wait();
  console.log('receipt', rc);
}

main();
