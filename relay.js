const express = require("express");
const app = express();
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider();
const contractArtifact = require("./build/contracts/RelayHub.json");

const privateKey =
  "0x38e8085d0dfcd53f06b763042dde15a9f07b6b1d5fb2e7f384253050b83743a2";
const publicKey = "0xda9d0e8b3c543a5f83025f1af527bd85703e4cca";
//1: Deploy Contracts:
//start Ganache
//Relay Hub
//userContract
//--currently handled with truffle

//turn into class later
// const loadNetwork = async () => {
//   let contract;
//   const { networks, abi } = require("./build/contracts/RelayHub.json");
//   const networkId = await provider.getNetwork();
//   const accounts = await provider.listAccounts();
//   let balance = await provider.getBalance(accounts[0]);
//   balance = balance.toString();
//   const chain = networkId.chainId;
//   //   console.log(`Ethereum Chain ID: ${chain.toString()}`);
//   //   console.log(`Balance Account[0]: ${balance}`);
//   return (contract = new ethers.Contract(
//     networks[chain].address,
//     abi,
//     provider
//   ));
// };

const loadNetwork = async () => {
  const thing = new RelayHubClass(provider, contractArtifact);
  thing.init();
};

class RelayHubClass {
  constructor(provider, contractArtifact, privKey) {
    this.provider = provider;
    this.contractArtifact = contractArtifact;
    //this.init();

    this.state = {
      instance: null,
      abi: null,
      networks: null,
      networkId: null,
      accounts: null,
      chain: null,
      wallet: null,
      instanceWithSigner: null
    };
  }

  async init() {
    const networkId = await this.provider.getNetwork();
    const accounts = await this.provider.listAccounts();
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const { networks, abi } = this.contractArtifact;
    const chain = networkId.chainId;
    const instance = new ethers.Contract(
      networks[chain].address,
      abi,
      this.provider
    );
    const instanceWithSigner = new ethers.Contract(
      networks[chain].address,
      abi,
      wallet
    );

    this.state = {
      ...this.state,
      networkId,
      accounts,
      networks,
      abi,
      chain,
      instance,
      instanceWithSigner,
      wallet
    };
    console.log("Init Worked");
  }

  async registerRelay(stake, deposit) {
    const { instanceWithSigner, accounts } = this.state;
    const { utils } = ethers;
    const relayAddress = accounts[0];

    let depositWei = utils.parseEther(deposit);
    let stakeWei = utils.parseEther(stake);
    let fee = utils.parseEther("1");

    instanceWithSigner.on("Staked", (relay, value, event) => {
      console.log("On Staked");
      console.log(relay);
      console.log(utils.toString(value));

      //console.log(event);
    });

    instanceWithSigner.on(
      "RelayAdded",
      (sender, owner, fee, stake, unstakeDelay, url) => {
        console.log("On Registered");
        fee = utils.formatEther(fee, { commify: true });
        stake = utils.formatEther(stake, { commify: true });
        unstakeDelay = utils.formatEther(unstakeDelay);
        console.log(
          `Relay Added: Sender: ${sender} Owner: ${owner} Fee: ${fee} Stake: ${stake} Delay: ${unstakeDelay} URL: ${url} `
        );
      }
    );
    //first Stake
    try {
      const tx = await instanceWithSigner.stake(publicKey, 10, {
        value: stakeWei
      });
      await tx.wait();
    } catch (error) {
      console.error;
    }

    try {
      console.log("register");
      const tx = await instanceWithSigner.register_relay(
        fee,
        "http://localhost:3000",
        "0x0000000000000000000000000000000000000000"
      );

      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  }
}

//2: Fund and initialize hub and contract
//Fund Relay for userContract
//init userContract for relay

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
  const RelayHub = new RelayHubClass(provider, contractArtifact);
  await RelayHub.init();
  RelayHub.registerRelay("1", "1");
  console.log("app listening on port 3000!");
});
