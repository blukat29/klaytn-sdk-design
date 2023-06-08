const { ethers } = require("ethers");
const { Wallet } = require("../../dist/src/ethers"); // require("@klaytn/sdk-ethers");
const fs = require('fs')

const provider = new ethers.providers.JsonRpcProvider('https://api.baobab.klaytn.net:8651')

const account1 = '0x3208ca99480f82bfe240ca6bc06110cd12bb6366' // sender address 
const account2 = '0xc40b6909eb7085590e1c26cb3becc25368e249e9' // reciever address 

const privateKey1 = fs.readFileSync('./example/privateKey', 'utf8') // Private key of sender 
const wallet = new Wallet(privateKey1, provider)
const ewallet = new ethers.Wallet(privateKey1, provider)

const main = async () => {
    const senderBalanceBefore = await provider.getBalance(account1)
    const recieverBalanceBefore = await provider.getBalance(account2)

    console.log(`\nSender balance before: ${ethers.utils.formatEther(senderBalanceBefore)}`)
    console.log(`reciever balance before: ${ethers.utils.formatEther(recieverBalanceBefore)}\n`)

    const tx = await wallet.sendTransaction({
        to: account2,
        value: 1000
    })

    await tx.wait()
    console.log(tx)

    const senderBalanceAfter = await provider.getBalance(account1)
    const recieverBalanceAfter = await provider.getBalance(account2)

    console.log(`\nSender balance after: ${ethers.utils.formatEther(senderBalanceAfter)}`)
    console.log(`reciever balance after: ${ethers.utils.formatEther(recieverBalanceAfter)}\n`)
}

main()