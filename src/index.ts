import { TypedTx } from "./common";

let ktx = TypedTx.fromObject({
  type: 8,
  to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  value: 1234,
});

console.log(ktx);
console.log(ktx.sigRLP());

