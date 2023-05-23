const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

// create new account for testing 
// https://baobab.wallet.klaytn.foundation/ 
const sender_priv = '0x9068ffc8ce6e3e79d69fb98ecf7a5fd078592fbe3e4dec1128f3aea5f72c1a78' 
const sender = '0x0667dcd3dc0ad91120efb7d6fea506fda117cddd' 

const fs = require('fs');
const new_priv = fs.readFileSync('./example/privateKey', 'utf8') // newly updating private key for sender

//
// AccountKeyPublic
// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeypublic
// 
async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net');
  const wallet = new KlaytnWallet(null, sender_priv, provider);

  let new_key = new ethers.utils.SigningKey( new_priv ).compressedPublicKey; 

  let tx = {
        type: 0x20,   // TxTypeAccountUpdate
        from: sender,
        key: {
            type: 0x02, 
            key: new_key,
        }
    };
  
  let sentTx = await wallet.sendTransaction(tx);
  console.log('sentTx', sentTx);

  let rc = await sentTx.wait();
  console.log('receipt', rc);
}

main();
