const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});

app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

app.listen(3000, () => console.log('Gator app listening on port 3000!'));
