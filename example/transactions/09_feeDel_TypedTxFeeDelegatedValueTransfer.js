const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

const fs = require('fs')
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
//   gasLimit: Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
// 
async function senderSign( tx ) {
  const sender_wallet = new KlaytnWallet(sender_priv, provider);
  
  const popTx = await sender_wallet.populateTransaction(tx);
  console.log('popTx', popTx);

  const senderTx = await sender_wallet.signTransactionAsSender(popTx);
  console.log('senderTx', senderTx);

  return senderTx; 
}

async function feePayerSign( senderTx ) {
  const feePayer_wallet = new KlaytnWallet(feePayer_priv, provider);

  const feePayerTx = await feePayer_wallet.signTransactionAsFeePayer(senderTx);
  console.log('feePayerTx', feePayerTx);

  return feePayerTx; 
}

async function main() {

  let tx = {
    type: 9,         
    gasPrice: 25e9,
    gasLimit: 30000, 
    to: reciever,
    value: 1e12,
    from: sender,
    feePayer: feePayer,
  }; 

  const senderTx = await senderSign(tx); 
  const feePayerTx = await feePayerSign(senderTx); 

  const txhash = await provider.send("klay_sendRawTransaction", [feePayerTx]);
  console.log('txhash', txhash);

  const rc = await provider.waitForTransaction(txhash);
  console.log('receipt', rc);
}

main();
