const { RelayHubClass } = require("./RelayHubClass");

const express = require("express");
const app = express();
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider();
const contractArtifact = require("./build/contracts/RelayHub.json");

const privateKey =
  "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";
const publicKey = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";

let RelayHub;

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

app.get("/ready", async (req, res) => {
  res.send(RelayHub.isRelayReady);
});

app.listen(3000, async () => {
  RelayHub = new RelayHubClass(
    provider,
    contractArtifact,
    privateKey,
    publicKey
  );
  await RelayHub.init();
  RelayHub.registerRelay("1", "1");
  console.log("app listening on port 3000!");
});
