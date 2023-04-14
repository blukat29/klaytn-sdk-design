import {ethers} from "ethers";
import {keccak256} from "ethers/lib/utils";
import { TypedTx } from "./common";

const priv = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function main() {

  const provider = new ethers.providers.JsonRpcProvider("https://public-en-baobab.klaytn.net");
  const wallet = new ethers.Wallet(priv, provider);

  let tx: any = {
    type: 8,
    nonce: 5741,
    gasPrice: 25e9,
    gasLimit: 30000,
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    value: 1e12,
    from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    chainId: 1001,
  };

  //tx = await wallet.populateTransaction(tx)
  //console.log(tx);

  let ktx = TypedTx.fromObject(tx);
  console.log(ktx);

  const sigRLP = ktx.sigRLP();
  console.log({ sigRLP });

  const sigHash = keccak256(sigRLP);
  console.log({ sigHash });

  const sig = wallet._signingKey().signDigest(sigHash);

  sig.v = sig.recoveryParam + 1001*2 + 35
  console.log(sig.v);

  ktx.addTxSignature(sig);
  console.log(ktx.toObject());

  const rawTx = ktx.txRLP();
  console.log({ rawTx });

  const res = await provider.send('klay_sendRawTransaction', [rawTx]);
  console.log(res);
  const rc = await res.wait();
  console.log(rc);
}

main();
