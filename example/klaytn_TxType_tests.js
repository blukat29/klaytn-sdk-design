const ethers = require("ethers");
const { KlaytnWallet } = require("../dist/ethers"); // require("@klaytn/sdk-ethers");

const url = "https://public-en-baobab.klaytn.net";
const priv = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new KlaytnWallet(priv, provider);

  // most fields can be auto-filled by populateTransaction.
  let txs = [ 
    // TxTypeValueTransferMemo
    {
      type: 0x10,
      // nonce:5700,
      // gasPrice: 25e9,
      gasLimit: 1000000,   // Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
      to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      value: 1e12,
      // from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      input: "0x1234567890",
      // chainId: 1001,
    },
    // TxTypeSmartContractDeploy
    {
      type: 0x28,
      // nonce:5700,
      // gasPrice: 25e9,
      gasLimit: 1000000,   // Must be fixed value, because it calls deprecated old eth_estimateGas API of Klaytn node
      to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      value: 1e12,
      // from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      input: "0x608060405234801561001057600080fd5b506101de806100206000396000f3006080604052600436106100615763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416631a39d8ef81146100805780636353586b146100a757806370a08231146100ca578063fd6b7ef8146100f8575b3360009081526001602052604081208054349081019091558154019055005b34801561008c57600080fd5b5061009561010d565b60408051918252519081900360200190f35b6100c873ffffffffffffffffffffffffffffffffffffffff60043516610113565b005b3480156100d657600080fd5b5061009573ffffffffffffffffffffffffffffffffffffffff60043516610147565b34801561010457600080fd5b506100c8610159565b60005481565b73ffffffffffffffffffffffffffffffffffffffff1660009081526001602052604081208054349081019091558154019055565b60016020526000908152604090205481565b336000908152600160205260408120805490829055908111156101af57604051339082156108fc029083906000818181858888f193505050501561019c576101af565b3360009081526001602052604090208190555b505600a165627a7a72305820627ca46bb09478a015762806cc00c431230501118c7c26c30ac58c4e09e51c4f0029",
      // chainId: 1001,
      humanReadable: 0x00,
      codeFormat: 0x00
    },
  ]; 
  let testOX = [ false, true ]; 

  for ( let i = 0; i < txs.length ; i++) {
    if (testOX[i] == false )
      continue; 

    if (1) {
      // One-shot (recommended)
      const sentTx = await wallet.sendTransaction(txs[i]);
      console.log('txhash', sentTx.hash);
  
      const rc = await sentTx.wait();
      console.log('receipt', rc);
    } else {
      // Step-by-step
      popTx = await wallet.populateTransaction(txs[i]);
      console.log('tx', popTx);
  
      const rawTx = await wallet.signTransaction(popTx);
      console.log('rawTx', rawTx);
  
      const txhash = await provider.send("klay_sendRawTransaction", [rawTx]);
      console.log('txhash', txhash);
  
      const rc = await provider.waitForTransaction(txhash);
      console.log('receipt', rc);
    }
  }
}

main();
