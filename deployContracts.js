const fs = require("fs-extra");
const path = require("path");
const ethers = require('ethers');

const buildPath = path.resolve(__dirname, "build");
const contractJsonContent = fs.readFileSync(path.resolve(__dirname, "build/contracts/RelayHub.json"), 'utf8');
const jsonObject = JSON.parse(contractJsonContent);


const abi = jsonObject.abi;
//let abi = jsonOutput['contracts'][contract][path.parse(contract).name]['abi'];
//console.log(abi);
const bytecode = jsonObject.bytecode;
// const hexBytcode = '0x'+bytecode;
//console.log(bytecode);

const provider = new ethers.providers.JsonRpcProvider();

// Load the wallet to deploy the contract with
let privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
let wallet = new ethers.Wallet(privateKey, provider);


// const signer = provider.getSigner(0);
// const factory = new ethers.ContractFactory(abi, bytecode, signer)


// Deployment is asynchronous, so we use an async IIFE
(async function() {

    // Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Notice we pass in "Hello World" as the parameter to the constructor
    let contract = await factory.deploy();

    // The address the Contract WILL have once mined
    // See: https://ropsten.etherscan.io/address/0x2bd9aaa2953f988153c8629926d22a6a5f69b14e
    console.log(contract.address);
    // "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E"

    // The transaction that was sent to the network to deploy the Contract
    // See: https://ropsten.etherscan.io/tx/0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51
    console.log(contract.deployTransaction.hash);
    // "0x159b76843662a15bd67e482dcfbee55e8e44efad26c5a614245e12a00d4b1a51"

    // The contract is NOT deployed yet; we must wait until it is mined
    await contract.deployed()

    // Done! The contract is deployed.
})();

//const factory = new ethers.ContractFactory.fromSolidity(jsonObject.RelayHub,signer);


//console.log(factory);
//provider.listAccounts().then(result => console.log(result));