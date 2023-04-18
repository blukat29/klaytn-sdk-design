const ethers = require("ethers");
const { KlaytnWallet } = require("../dist/ethers"); // require("@klaytn/sdk-ethers");

const url = "https://public-en-baobab.klaytn.net";
const priv = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new KlaytnWallet(priv, provider);

  // most fields can be auto-filled by populateTransaction.
  let tx = {
    type: 0x10,
    // nonce:5700,
    // gasPrice: 25e9,
    gasLimit: 1000000,   // Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    value: 1e12,
    // from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    input: "0x1234567890"
    // chainId: 1001,
  };

  if (1) {
    // One-shot (recommended)
    const sentTx = await wallet.sendTransaction(tx);
    console.log('txhash', sentTx.hash);

    const rc = await sentTx.wait();
    console.log('receipt', rc);
  } else {
    // Step-by-step
    tx = await wallet.populateTransaction(tx);
    console.log('tx', tx);

    const rawTx = await wallet.signTransaction(tx);
    console.log('rawTx', rawTx);

    const txhash = await provider.send("klay_sendRawTransaction", [rawTx]);
    console.log('txhash', txhash);

    const rc = await provider.waitForTransaction(txhash);
    console.log('receipt', rc);
  }
}

main();
