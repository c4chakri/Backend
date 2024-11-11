const express = require('express');
const { ethers } = require('ethers');
const app = express();
const port = 6996;
const tokenRoutes = require('./routes/tokenRoutes');

app.use(express.json());

app.use('/api', tokenRoutes);


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
