import { ethers } from "ethers";
import { KlaytnTxType, KlaytnWallet } from "../dist/index"; // require("@klaytn/sdk-ethers");

// example from:
// https://docs.klaytn.foundation/content/klaytn/design/transactions/basic#txtypevaluetransfer
const pkey1 = "0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8";
const addr1 = "0xa94f5374Fce5edBC8E2a8697C15331677e6EbF0B";
const addr2 = "0x7b65B75d204aBed71587c9E519a89277766EE1d0";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

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
  console.log('signed', signedTx);
}

main();
