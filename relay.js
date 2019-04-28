const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log('Request Time: ', Date.now());
    next();
});


app.get('/', (req, res) => {
    res.send('An alligator approaches!');
});



app.listen(3000, () => console.log('Gator app listening on port 3000!'));
