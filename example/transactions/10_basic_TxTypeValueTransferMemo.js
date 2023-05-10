const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

const fs = require('fs')
const privateKey1 = fs.readFileSync('./example/privateKey', 'utf8') // private key of sender 

const account1 = '0x3208ca99480f82bfe240ca6bc06110cd12bb6366' // sender address 
const account2 = '0xc40b6909eb7085590e1c26cb3becc25368e249e9' // reciever address 

//
// TxTypeValueTransferMemo
// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypevaluetransfermemo
// 
//   type: Must be 0x10,
//   gasLimit: Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
// 
async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')
  const wallet = new KlaytnWallet(privateKey1, provider);

  tx = {
      type: 0x10,         
      // gasPrice: 25e9,
      // gasLimit: 30000,
      to: account2,
      value: 1e12,
      from: account1,
      input: "0x1234567890",
    }; 
  
  const sentTx = await wallet.sendTransaction(tx);
  console.log('sentTx', sentTx);

  const rc = await sentTx.wait();
  console.log('receipt', rc);
}

main();
