const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

// create new account for testing 
// https://baobab.wallet.klaytn.foundation/ 
const sender_priv = '0x1dad451aeb1198930d8ca2d3d6c6d8892f364dd0a321cbacc6dcdcd3c5250333' 
const sender = '0x218e49acd85a1eb3e840eac0c9668e188c452e0c' 

// newly updating multi privateKeys for sender
const fs = require('fs');
const new_priv = fs.readFileSync('./example/privateKey', 'utf8') 
const new_priv2 = fs.readFileSync('./example/privateKey2', 'utf8') 
const new_priv3 = fs.readFileSync('./example/privateKey3', 'utf8')


const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')

// 
// AccountKeyWeightedMultiSig
// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeyweightedmultisig
//
async function doSender() {
  const sender_wallet = new KlaytnWallet(sender_priv, provider);
  
  let tx = {
    type: 9,    
    to: reciever,
    value: 1e12,
    from: sender,
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

  const sentTx = await feePayer_wallet.sendTransactionAsFeePayer(tx);
  console.log('sentTx', sentTx);

  const rc = await sentTx.wait();
  console.log('receipt', rc);
}

async function main() {

  const senderTxHashRLP = await doSender();

  doFeePayer( senderTxHashRLP ); 
}

main();
