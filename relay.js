const express = require('express');
const app = express();
const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider();



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



app.listen(3000, () => console.log('Gator app listening on port 3000!'));
