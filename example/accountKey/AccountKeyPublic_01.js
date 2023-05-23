const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

// create new account for testing 
// https://baobab.wallet.klaytn.foundation/ 
const sender_priv = '0x9068ffc8ce6e3e79d69fb98ecf7a5fd078592fbe3e4dec1128f3aea5f72c1a78' 
const sender = '0x0667dcd3dc0ad91120efb7d6fea506fda117cddd' 
const reciever = '0xc40b6909eb7085590e1c26cb3becc25368e249e9' 

const fs = require('fs');
const new_priv = fs.readFileSync('./example/privateKey', 'utf8') // new private key for the update 

//
// AccountKeyPublic
// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeypublic
// 
async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')
  // const wallet = new KlaytnWallet(sender_priv, provider);

  // let new_key = new ethers.utils.SigningKey( new_priv ).compressedPublicKey; 
  // console.log('new_key', new_key);

  // let tx = {
  //       type: 0x20,   // TxTypeAccountUpdate
  //       from: sender,
  //       key: {
  //           type: 0x02, 
  //           key: new_key,
  //       }
  //   };
  
  // let sentTx = await wallet.sendTransaction(tx);
  // console.log('sentTx', sentTx);

  // let rc = await sentTx.wait();
  // console.log('receipt', rc);

  // nonce is set by the new_priv's address 
  const new_wallet = new KlaytnWallet(sender, new_priv, provider);

  let new_tx = {
    type: 8,
    to: reciever,
    value: 100000000000,
    from: sender,
  }; 

  let sentTx2 = await new_wallet.sendTransaction(new_tx);
  console.log('sentTx2', sentTx2);

  let rc2 = await sentTx2.wait();
  console.log('receipt2', rc2);
}

main();
