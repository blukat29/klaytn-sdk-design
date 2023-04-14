import {ethers} from "ethers";
import {keccak256} from "ethers/lib/utils";
import { TypedTx } from "./common";

let ktx = TypedTx.fromObject({
  type: 8,
  nonce: 1,
  gasPrice: 25e9,
  gas: 30000,
  to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  value: 1e12,
  from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  chainId: 1001,
});

console.log(ktx);

const sigRLP = ktx.sigRLP();
console.log({ sigRLP });

const sigHash = keccak256(sigRLP);
console.log({ sigHash });

const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
const sig = wallet._signingKey().signDigest(sigHash);

ktx.addSignature(sig);

