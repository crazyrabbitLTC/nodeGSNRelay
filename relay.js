const express = require("express");
const app = express();
const ethers = require("ethers");
const ganache = require("ganache-cli");
const provider = new ethers.providers.Web3Provider(ganache.provider());

//1: Deploy Contracts:
//start Ganache
//Relay Hub
//userContract
//--currently handled with truffle

//2: Fund and initialize hub and contract
//Fund Relay for userContract
//init userContract for relay




const loadNetwork = async () => {
    const { networks, abi } = require("./build/contracts/RelayHub.json");
    const networkId = await provider.getNetwork();
    console.log(networkId);
    // console.log(typeof(networkId.chainId));
    // const chain = networkId.chainId
    // console.log(chain.toString());
    // console.dir(networks[chain].address);
    let contract = new ethers.Contract('0x5031d1e0C7162d2F763936982895c8f178e2e6bD', abi, provider);

    console.log("contract made");
}





//3: Submit transactions for User
//Receive Transaction
//Check if can relay
//

app.use((req, res, next) => {
  console.log("Request Time: ", Date.now());
  next();
});

app.get("/", (req, res) => {
  res.send("An alligator approaches!");
});

app.get("/accounts", (req, res) => {
  provider.listAccounts().then(result => res.send(result));
});

app.get("/abi", (req, res) => {
  res.send(abi);
});

app.get("/networks", (req, res) => {
  res.send(networks);
});

app.listen(3000, () => {
    console.log("loading network");
loadNetwork();
    console.log("Gator app listening on port 3000!")
});
