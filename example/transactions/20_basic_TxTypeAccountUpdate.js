const ethers = require("ethers");
const { KlaytnWallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");

// create new account for testing 
// https://baobab.wallet.klaytn.foundation/ 
const privateKey1 = '0xb9e5d87f61cad44cb76f312e75a1456b3188606a528b4deb8f45374bb0b466a1' // private key of sender 
const account1 = '0x6789d636da0b190ddabb398d742d61632aea1518' // sender address 

//
// TxTypeAccountUpdate
// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypeaccountupdate
// 
//   type: Must be 0x20,
//   from: address of sender to be updated
//   key: Refer Klaytn account key
//        https://docs.klaytn.foundation/content/klaytn/design/accounts#account-key 
// 
async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://public-en-baobab.klaytn.net')
  const wallet = new KlaytnWallet(privateKey1, provider);

  let tx = {
        type: 0x20,
        from: account1,
        key: {
            type: 0x02, 
            // private key 0xf8cc7c3813ad23817466b1802ee805ee417001fcce9376ab8728c92dd8ea0a6b
            // pubkeyX 0xdbac81e8486d68eac4e6ef9db617f7fbd79a04a3b323c982a09cdfc61f0ae0e8
            // pubkeyY 0x906d7170ba349c86879fb8006134cbf57bda9db9214a90b607b6b4ab57fc026e
            key: "0x02dbac81e8486d68eac4e6ef9db617f7fbd79a04a3b323c982a09cdfc61f0ae0e8",
        }
    };
  
  if (1) {
    // One-shot (recommended)
    const sentTx = await wallet.sendTransaction(tx);
    console.log('sentTx', sentTx);

    const rc = await sentTx.wait();
    console.log('receipt', rc);
  } else {
    // Step-by-step
    popTx = await wallet.populateTransaction(tx);
    console.log('tx', popTx);

    const rawTx = await wallet.signTransaction(popTx);
    console.log('rawTx', rawTx);

    const txhash = await provider.send("klay_sendRawTransaction", [rawTx]);
    console.log('txhash', txhash);

    const rc = await provider.waitForTransaction(txhash);
    console.log('receipt', rc);
  }
}

main();
