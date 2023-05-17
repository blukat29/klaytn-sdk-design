const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");
const { objectFromRLP } = require("../../dist/src/core/tx");

const fs = require('fs');
const feePayer_priv = fs.readFileSync('./example/feePayerPrivateKey', 'utf8') // private key of feeDelegator
const feePayer = '0x24e8efd18d65bcb6b3ba15a4698c0b0d69d13ff7'

// create new account for testing 
// https://baobab.wallet.klaytn.foundation/ 
const sender_priv = '0x8de51408a03ccddf22a22a66d711dd008eec5e80c9cabe7d018b4743b918bf5e' 
const sender = '0xd7332aaedb6d04f450ec2ec48cd1a9db418a1f63' 

const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')

//
// TxTypeFeeDelegatedAccountUpdate
// https://docs.klaytn.foundation/content/klaytn/design/transactions/fee-delegation#txtypefeedelegatedaccountupdate
// 
//   type: Must be 0x21,
//   nonce: In signTransactionAsFeePayer, must not be omitted, because feePayer's nonce is filled when populating
//   gasLimit: Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
// 

async function doSender() {
  const sender_wallet = new KlaytnWallet(sender_priv, provider);
  
  let tx = {
      type: 0x21,
      gasLimit: 1000000000, 
      from: sender,
      key: {
          type: 0x02, 
          // private key 0xf8cc7c3813ad23817466b1802ee805ee417001fcce9376ab8728c92dd8ea0a6b
          // pubkeyX 0xdbac81e8486d68eac4e6ef9db617f7fbd79a04a3b323c982a09cdfc61f0ae0e8
          // pubkeyY 0x906d7170ba349c86879fb8006134cbf57bda9db9214a90b607b6b4ab57fc026e
          key: "0x02dbac81e8486d68eac4e6ef9db617f7fbd79a04a3b323c982a09cdfc61f0ae0e8",
      }
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
