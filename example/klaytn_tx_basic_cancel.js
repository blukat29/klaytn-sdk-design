const ethers = require("ethers");
const { KlaytnWallet } = require("../dist/ethers"); // require("@klaytn/sdk-ethers");

const url = "https://public-en-baobab.klaytn.net";
const priv = "0x45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8"; // address 0xa94f5374Fce5edBC8E2a8697C15331677e6EbF0B

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new KlaytnWallet(priv, provider);

  // TxTypeCancel
  let tx = {
      type: 0x38,
      from: '0xa94f5374Fce5edBC8E2a8697C15331677e6EbF0B',
      gas: 0xf4240,
      gasPrice: 0x19,
      // chainId: 0x1,
      // signatures: [
      //     [
      //         '0x0fea',
      //         '0xd9994ef507951a59380309f656ee8ed685becdc89b1d1a0eb1d2f72683ae14d3',
      //         '0x7ad5d37a89781f294fab72b254ea9266e4d039ae163db4a4c4752f1fabff023b',
      //     ],
      // ],
      nonce: 1234,
    }; 

  if (0) {
    // One-shot (recommended)
    const sentTx = await wallet.sendTransaction(tx);
    console.log('txhash', sentTx.hash);

    const rc = await sentTx.wait();
    console.log('receipt', rc);
  } else {
    // Step-by-step
    popTx = await wallet.populateTransaction(tx);
    console.log('tx', popTx);

    popTx.chainID = 0x1;

    const rawTx = await wallet.signTransaction(popTx);
    console.log(rawTx);
    console.log("0x38f8648204d219830f424094a94f5374fce5edbc8e2a8697c15331677e6ebf0bf845f84325a0fb2c3d53d2f6b7bb1deb5a09f80366a5a45429cc1e3956687b075a9dcad20434a05c6187822ee23b1001e9613d29a5d6002f990498d2902904f7f259ab3358216e")
    // console.log([
    //           '0x0fea',
    //           '0xd9994ef507951a59380309f656ee8ed685becdc89b1d1a0eb1d2f72683ae14d3',
    //           '0x7ad5d37a89781f294fab72b254ea9266e4d039ae163db4a4c4752f1fabff023b',
    //       ])

    // const txhash = await provider.send("klay_sendRawTransaction", [rawTx]);
    // console.log('txhash', txhash);

    // const rc = await provider.waitForTransaction(txhash);
    // console.log('receipt', rc);
  }
}

main();
