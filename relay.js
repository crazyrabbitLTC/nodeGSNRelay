const express = require("express");
const app = express();
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider();

//1: Deploy Contracts:
//start Ganache
//Relay Hub
//userContract
//--currently handled with truffle

//turn into class later
const loadNetwork = async () => {
  let contract;
  const { networks, abi } = require("./build/contracts/RelayHub.json");
  const networkId = await provider.getNetwork();
  const accounts = await provider.listAccounts();
  let balance = await provider.getBalance(accounts[0]);
  balance = balance.toString();
  const chain = networkId.chainId;
  //   console.log(`Ethereum Chain ID: ${chain.toString()}`);
  //   console.log(`Balance Account[0]: ${balance}`);
  return (contract = new ethers.Contract(
    networks[chain].address,
    abi,
    provider
  ));
};


//2: Fund and initialize hub and contract
//Fund Relay for userContract
//init userContract for relay


const fundRelay = async contract => {
  // const contractAddress;
  const accounts = await provider.listAccounts();
  let balance = await contract.balanceOf(accounts[0]);
  console.log(`Balance of ${balance.toString()}`);

};


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

app.get("/networks", async (req, res) => {
  res.send(networks);
});

app.listen(3000, async () => {
  console.log("loading network");
  let contract = await loadNetwork();
  fundRelay(contract);
  console.log("app listening on port 3000!");
});
