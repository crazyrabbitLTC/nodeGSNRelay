const ethers = require("ethers");

class RelayHubClass {
    constructor(provider, contractArtifact, privKey, pubKey) {
        this.provider = provider;
        this.contractArtifact = contractArtifact;
        this._privKey = privKey;
        this._pubKey = pubKey;
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
        const wallet = new ethers.Wallet(this._privKey, this.provider);
        const { networks, abi } = this.contractArtifact;
        const chain = networkId.chainId;
        const instance = new ethers.Contract(networks[chain].address, abi, this.provider);
        const instanceWithSigner = new ethers.Contract(networks[chain].address, abi, wallet);
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
            registerRelay();
        });
        instanceWithSigner.on("RelayAdded", (sender, owner, fee, stake, unstakeDelay, url) => {
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
            console.log(`Relay Added: Sender: ${sender} Owner: ${owner} Fee: ${fee} Stake: ${stake} Delay: ${unstakeDelay} URL: ${url} `);
            this.state = { ...this.state, relayAdded, relayReady: true };
        });
        const registerRelay = async () => {
            try {
                console.log("register");
                const tx = await instanceWithSigner.register_relay(fee, "http://localhost:3000", "0x0000000000000000000000000000000000000000");
                await tx.wait();
            }
            catch (error) {
                console.log(error);
            }
        };
        const stakeRelay = async () => {
            //first Stake
            try {
                const tx = await instanceWithSigner.stake(this._pubKey, 5, {
                    value: stakeWei
                });
                await tx.wait();
            }
            catch (error) {
                console.error;
            }
        };
        stakeRelay();
    }
    get isRelayReady() {
        return this.state.relayReady;
    }
}
exports.RelayHubClass = RelayHubClass;
