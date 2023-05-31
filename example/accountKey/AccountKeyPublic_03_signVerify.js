const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");
const fs = require('fs');

//
// AccountKeyPublic Step 03 - sign verification
// https://docs.klaytn.foundation/content/klaytn/design/accounts#accountkeypublic
// 

// the same address of sender in AccountKeyPublic_01_accountUpdate.js 
const sender = '0x1173d5dc7b5e1e07d857d74e962b6ed7d4234a92';

// newly updated private key of sender
const updated_priv = fs.readFileSync('./example/privateKey', 'utf8');


const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net');

async function doSignMessage( message ) {
  const wallet = new KlaytnWallet( sender, updated_priv, provider );

  const signature = await wallet.signMessage(message);
  console.log( signature );

  return {
    message: message,
    address: sender,
    signature: signature,
  };
}

async function doVerifyMessage ( obj ) {
  console.log( obj );
  const actualAddr = await verifyMessage( provider, obj.sender, obj.message, obj.signature);
  console.log( 'Actual address:', actualAddr );
  if (obj.address !== actualAddr) {
    return false;
  }
  return true;
}

async function main() {
  const message = "Hello World"; 
  const obj = await doSignMessage( message ); 
  const result = await doVerifyMessage( obj ); 
  console.log( "verification result:", result);
}

main();
