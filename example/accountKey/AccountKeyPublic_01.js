const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

// create new account for testing 
// https://baobab.wallet.klaytn.foundation/ 
const sender_priv = '0xc271760404f5c1c8b95512a4e8b40a85e0ca4159f965db531f43d1196392c7a8' 
const sender = '0xc602cddb58970475badead0cf791f7df4ed208d4' 
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

  // let tx = {
  //       type: 0x20,   // TxTypeAccountUpdate
  //       from: sender,
  //       key: {
  //           type: 0x02, 
  //           key: new ethers.utils.SigningKey( new_priv ).compressedPublicKey,
  //       }
  //   };
  
  // let sentTx = await wallet.sendTransaction(tx);
  // console.log('sentTx', sentTx);

  // let rc = await sentTx.wait();
  // console.log('receipt', rc);

  const new_wallet = new KlaytnWallet(new_priv, provider);

  let new_tx = {
    type: 8,
    to: reciever,
    value: 100000000000,
    from: sender,
  }; 

  sentTx = await new_wallet.sendTransaction(new_tx);
  console.log('sentTx', sentTx);

  rc = await sentTx.wait();
  console.log('receipt', rc);
}

main();
