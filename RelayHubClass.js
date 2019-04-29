const ethers = require("ethers");

class RelayHubClass {
  constructor(provider, contractArtifact, privKey, pubKey) {
    this.provider = provider;
    this.contractArtifact = contractArtifact;
    this._privKey = privKey;
    this._pubKey = pubKey;
    this.zeroAddress = "0x0000000000000000000000000000000000000000";
    this.localhost = "http://localhost:3000";
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
      relayReady: false
    };
  }
  async init() {
    const networkId = await this.provider.getNetwork();
    const accounts = await this.provider.listAccounts();
    const wallet = new ethers.Wallet(this._privKey, this.provider);
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
      console.log(`Relay Staked: ${relay}, and stake: ${value} Ether.`);
      this.state = { ...this.state, relayStaked };
      this._registerRelay_tx(fee);
    });
    instanceWithSigner.on(
      "RelayAdded",
      (sender, owner, fee, stake, unstakeDelay, url) => {
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

    this._stakeRelay_tx(stakeWei);
  }

  get isRelayReady() {
    return this.state.relayReady;
  }

  //+
  async _get_nonce_tx(address_from) {
      const {instance} = this.state;

      //I don't need to sign so I am only taking the instance
      try {
          const result = await instance.get_nonce(address_RelayRecipient);
          return result;
      } catch (error) {
          console.log(error)
      }
  }

//+
  async _depositFor_tx(address_target, value_in_wei) {
      const {instanceWithSigner} = this.state;
      const { utils } = ethers;
      try {
          const tx = await instanceWithSigner.depositFor(address_target, {value: value_in_wei });
          await tx.wait();

          console.log(tx);
          instanceWithSigner.on("Deposited", (address_target, value) => {
            value = utils.formatEther(value, { commify: true });
              console.log(`Deposit of ${value} Ether for ${address_target} has been emitted`);
          })

      } catch (error) {
          console.log(error)
          
      }
  }

  //+
  async _deposit_tx(value_in_wei) {
      const {instanceWithSigner} = this.state;
      const { utils } = ethers;
      try {
          const tx = await instanceWithSigner.deposit({value: value_in_wei});
          await tx.wait();
          console.log(tx);
          value_in_wei = utils.formatEther(value_in_wei, {commify: true});
          console.log(`Deposit of ${value_in_wei} has been made.`);
      } catch (error) {
          
      }
  }

//+
  async _withdraw_tx(amount_in_wei) {
      const {instanceWithSigner, accounts}= this.state;
      const {utils} = ethers;
      const provider = this.provider;

      
      let balanceBefore = await provider.getBalance(accounts[0]);
      balanceBefore = utils.formatEther(balanceBefore, { commify: true });

      //Check my local balance of my address
      try {
          const tx = await instanceWithSigner.withdraw(amount_in_wei)
          await tx.wait();
          instanceWithSigner.on("Withdrawn", (address, value) => {
            value = utils.formatEther(value, { commify: true });
            console.log(`Withdrawl of ${value} Ether has been emitted`);
          } )
        //check to see if the balance has increased.

        let balanceAfter = await provider.getBalance(accounts[0]);
        balanceAfter = utils.formatEther(balanceAfter, { commify: true });

        console.log(`The Balance before withdrawl of accounts[0] was ${balanceBefore} Eth and now the balance is: ${balanceAfter} Eth.`);
        console.log(`If the balance has not increased there is a problem.`)
      } catch (error) {
          
      }
  }

  //+
  async _balanceOf_tx(address_target) {
      const {instance} = this.state;
      try {
          const tx = await instance.balanceOf(address_target);
          console.log(`The balance of ${address_target} is ${tx}`)
          return tx;
      } catch (error) {
          console.log(error)
      }
  }

  //+
  async _stakeOf_tx(address_relay) {
      const {instance} = this.state;
      try {
          const tx = await instance.stakeOf(address_relay);
          console.log(`The State of ${address_relay} is ${tx}`)
          return tx;
      } catch (error) {
          console.log(error);
      }
  }

  async _ownerOf(address_relay) {
      const {instance} = this.state;
     try {
         const tx = await instance.ownerOf(address_relay);
         console.log(`Owner of relay ${address_relay} is ${tx}`);
         return tx;
     } catch (error) {
         console.log(error)
     }
  }

  //+
  async _stakeRelay_tx(stakeInWei) {
    //first Stake
    const { instanceWithSigner } = this.state;
    try {
      const tx = await instanceWithSigner.stake(this._pubKey, 5, {
        value: stakeInWei
      });
      await tx.wait();
    } catch (error) {
      console.error;
    }
  }

  async _canUnstake_tx(address_relay) {}

  async _unstakeAllowed_tx(address_relay) {}

  //+
  async _registerRelay_tx(fee) {
    const { instanceWithSigner } = this.state;
    try {
      console.log("register");
      const tx = await instanceWithSigner.register_relay(
        fee,
        this.localhost,
        this.zeroAddress
      );
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  }

  async _removeStaleRelay_tx(address_relay) {}

  async _removeRelayByOwner_tx(address_relay) {}

  async _canRelay_tx(
    address_relay,
    address_from,
    address_RelayRecipient,
    bytes_transaction,
    transaction_fee,
    gas_price,
    gas_limit,
    nonce,
    bytes_sig
  ) {}

  async _relay_tx(
    address_from,
    address_to,
    bytes_encoded_function,
    transaction_fee,
    gas_price,
    gas_limit,
    nonce,
    bytes_sig
  ) {}

  async _penalizeRepeatedNonce_tx(bytes_unsigned_tx1, bytes_sig1 ,bytes_unsigned_tx2, bytes_sig2){}


}
exports.RelayHubClass = RelayHubClass;
