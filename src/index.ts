export { TypedTx } from "./common";
import {TypedTxFactory} from "./common/tx";

let x = TypedTxFactory.fromObject({
  type: 9
});
console.log(x);
