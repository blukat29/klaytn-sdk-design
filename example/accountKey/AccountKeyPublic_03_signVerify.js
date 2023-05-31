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


async function signMessage( message ) {
  const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net');
  const wallet = new KlaytnWallet( sender, updated_priv, provider );

  const signature = await wallet.signMessage(message);
  console.log( signature );

  // const signer = provider.getSigner();
  // const signature = await signer.signMessage(message);
  // const address = await signer.getAddress();
  
  return {
    message: message,
    address: sender,
    signature: signature,
  };
}

async function verifyMessage ( obj ) {
  console.log( obj );
  const actualAddr = await ethers.utils.verifyMessage(obj.message, obj.signature);
  if (obj.address !== actualAddr) {
    return false;
  }
  return true;
}

async function main() {
  const message = "Hello World"; 
  const obj = await signMessage( message ); 
  const result = await verifyMessage( obj ); 
  console.log( "verification result:", result);
}

main();
