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
console.log(ktx.sigRLP());
