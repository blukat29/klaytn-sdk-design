import { ethers } from "ethers";
import { KlaytnWallet } from "../src/ethers"; // require("@klaytn/sdk/ethers");

const url = "https://public-en-baobab.klaytn.net";
const priv = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const pub = "0x038318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed75";

const provider = new ethers.providers.JsonRpcProvider(url);
const wallet = new KlaytnWallet(priv, provider);

async function testTxtype() {
  // most fields can be auto-filled by populateTransaction.
  let tx: any = {
    type: 8,
    // nonce:5700,
    // gasPrice: 25e9,
    // gasLimit: 30000,
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    value: 1e12,
    // from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    // chainId: 1001,
  };

  await sendTx(tx);
}

async function testAccountUpdate() {
  let account: any = {
    type: 0x01,
  };

  let tx: any = {
    type: 0x20,
    // nonce:5700,
    // gasPrice: 25e9,
    // gasLimit: 30000,
    // from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    key: account,
    // chainId: 1001,
  };

  await sendTx(tx);
}

async function sendTx(tx: any) {
  if (1) {
    // One-shot (recommended)
    const sentTx = await wallet.sendTransaction(tx);
    console.log('txhash', sentTx.hash);

    const rc = await sentTx.wait();
    console.log('receipt', rc);
  } else {
    // Step-by-step (for debugging)
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

//testTxtype();
testAccountUpdate();
