const express = require("express");
const app = express();
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider();
const contractArtifact = require("./build/contracts/RelayHub.json");

const privateKey =
  "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";
const publicKey = "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";

let RelayHub;

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
      instanceWithSigner: null,
      relayStaked: {},
      relayAdded: {},
      relayReady: false,
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
      const relayStaked = {
        relay,
        value
      };

      value = utils.formatEther(value, { commify: true });
      console.log(
        `Relay Staked: ${relay}, and stake: ${value} Ether.`
      );
      this.state = { ...this.state, relayStaked };

      registerRelay();
    });

    instanceWithSigner.on("RelayAdded",(sender, owner, fee, stake, unstakeDelay, url) => {
        const relayAdded = {
          sender,
          owner,
          fee,
          stake,
          unstakeDelay,
          url
        };
        console.log("Relay Registered");
        fee = utils.formatEther(fee, { commify: true });
        stake = utils.formatEther(stake, { commify: true });
        unstakeDelay = utils.formatEther(unstakeDelay);
        console.log(
          `Relay Added: Sender: ${sender} Owner: ${owner} Fee: ${fee} Stake: ${stake} Delay: ${unstakeDelay} URL: ${url} `
        );

        this.state = { ...this.state, relayAdded, relayReady: true };
      }
    );

    const registerRelay = async () => {
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
    };

    const stakeRelay = async () => {
    //first Stake
    try {
        const tx = await instanceWithSigner.stake(publicKey, 5, {
          value: stakeWei
        });
        await tx.wait();
      } catch (error) {
        console.error;
      }
    }

    stakeRelay();
  }

  get isRelayReady() {
      return this.state.relayReady;
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

app.get("/ready", async (req, res) => {
    res.send(RelayHub.isRelayReady);
})

app.listen(3000, async () => {
RelayHub = new RelayHubClass(provider, contractArtifact);
  await RelayHub.init();
  RelayHub.registerRelay("1", "1");
  console.log("app listening on port 3000!");
});
