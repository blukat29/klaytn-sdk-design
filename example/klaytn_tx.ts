import { ethers } from "ethers";
import { KlaytnTxType, KlaytnWallet } from "../src/index"; // require("@klaytn/sdk-ethers");

// example from:
const pkey1 = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const pkey2 = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const addr1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const addr2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8551");
  //const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

  // let signer = new ethers.Wallet(pkey1, provider);
  let signer = new KlaytnWallet(pkey1, provider);

  let txReq = {
    type: KlaytnTxType.ValueTransfer,
    to: addr2,
    value: ethers.utils.parseEther("1"),
  }

  let unsignedTx = await signer.populateTransaction(txReq);
  console.log('unsigned', unsignedTx);

  let signedTx = await signer.signTransaction(unsignedTx);
  signedTx = "0x08" + signedTx.substr(2);
  console.log('signed', signedTx);

  let out = await provider.sendTransaction(signedTx);
  console.log(out);
}

main();
