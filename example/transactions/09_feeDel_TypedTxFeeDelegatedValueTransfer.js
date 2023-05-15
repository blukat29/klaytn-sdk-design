const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");
const { TypedTxFeeDelegatedValueTransfer } = require("../../dist/src/core/klaytn_tx_feeDelegation");
const { HexStr } = require("../../dist/src/core/util");

const fs = require('fs');
const { TypedTxFactory, objectFromRLP } = require("../../dist/src/core/tx");
const sender_priv = fs.readFileSync('./example/privateKey', 'utf8') // private key of sender 
const feePayer_priv = fs.readFileSync('./example/feePayerPrivateKey', 'utf8') // private key of feeDelegator

const sender = '0x3208ca99480f82bfe240ca6bc06110cd12bb6366' 
const reciever = '0xc40b6909eb7085590e1c26cb3becc25368e249e9' 
const feePayer = '0x24e8efd18d65bcb6b3ba15a4698c0b0d69d13ff7'

const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')

//
// TypedTxFeeDelegatedValueTransfer
// https://docs.klaytn.foundation/content/klaytn/design/transactions/fee-delegation#txtypefeedelegatedvaluetransfer
// 
//   type: Must be 0x09,
//   nonce: In signTransactionAsFeePayer, must not be omitted, because feePayer's nonce is filled when populating
//   gasLimit: Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
// 

async function doSender() {
  const sender_wallet = new KlaytnWallet(sender_priv, provider);
  
  let tx = {
    type: 9,    
    gasLimit: 1000000000, 
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

  const popTx = await feePayer_wallet.populateTransaction(tx);
  console.log('popTx', popTx);

  const completeTx = await feePayer_wallet.signTransactionAsFeePayer( popTx );
  console.log('completeTx', completeTx);
  
  const txhash = await provider.send("klay_sendRawTransaction", [completeTx]);
  console.log('txhash', txhash);

  const rc = await provider.waitForTransaction(txhash);
  console.log('receipt', rc);
}

async function main() {

  const senderTxHashRLP = await doSender();

  doFeePayer( senderTxHashRLP ); 
}

main();
