const express = require('express');
const app = express();
const ethers = require('ethers');
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

    const RelayHubAbi = artifacts.require("RelayHub").abi;

//3: Submit transactions for User
    //Receive Transaction
    //Check if can relay
    //

app.use((req, res, next) => {
    console.log('Request Time: ', Date.now());
    next();
});


app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});

app.get('/accounts', (req, res) => {
    provider.listAccounts().then(result => res.send(result));
});

app.get('/abi', (req, res) => {
    provider.listAccounts().then(result => res.send(result));
});




app.listen(3000, () => console.log('Gator app listening on port 3000!'));
