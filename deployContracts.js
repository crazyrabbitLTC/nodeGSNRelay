const fs = require("fs-extra");
const path = require("path");
const ethers = require('ethers');

const buildPath = path.resolve(__dirname, "build");
const relayHubJson = fs.readFileSync(path.resolve(__dirname, "build/RelayHub.json")).toString();
const relayHubObject = JSON.parse(relayHubJson);

const abi = relayHubObject.abi;
const byteCode = relayHubObject.evm.bytecode;

console.log(abi);