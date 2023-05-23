const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

// create new account for testing 
// https://baobab.wallet.klaytn.foundation/ 
const sender = '0x0667dcd3dc0ad91120efb7d6fea506fda117cddd' 

const fs = require('fs');
const updated_priv = fs.readFileSync('./example/privateKey', 'utf8') // newly updated private key of sender

const reciever = '0xc40b6909eb7085590e1c26cb3becc25368e249e9' 

//
// AccountKeyPublic
// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeypublic
// 
async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net');
  const wallet = new KlaytnWallet( sender, updated_priv, provider );

  let new_tx = {
    type: 8,
    to: reciever,
    value: 100000000000,
    from: sender,
  }; 

  let sentTx = await wallet.sendTransaction(new_tx);
  console.log('sentTx', sentTx);

  let rc = await sentTx.wait();
  console.log('receipt', rc);
}

main();
