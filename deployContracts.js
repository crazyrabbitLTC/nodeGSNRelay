const fs = require("fs-extra");
const path = require("path");
const ethers = require('ethers');

const buildPath = path.resolve(__dirname, "build");
const contractJsonContent = fs.readFileSync(path.resolve(__dirname, "build/RelayHub.json"), 'utf8');
const jsonObject = JSON.parse(contractJsonContent);


const abi = jsonObject.abi;
//let abi = jsonOutput['contracts'][contract][path.parse(contract).name]['abi'];
//console.log(abi);
const bytecode = jsonObject.evm.bytecode.object;
const hexBytcode = '0x'+bytecode;

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner(0);
//const factory = new ethers.ContractFactory(abi, hexBytcode, signer)
const factory = new ethers.ContractFactory.fromSolidity(jsonObject,signer);


//console.log(factory);
//provider.listAccounts().then(result => console.log(result));