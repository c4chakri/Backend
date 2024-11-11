const express = require('express');
const { ethers } = require('ethers');

const router = express.Router();
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/2UeNuKxwLaSqN9bc73LukRrVMtS');
const daoContract = ``
const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)"
];
router.get('/token-details', async (req, res) => {
    const tokenAddress = req.query.address;

    if (!tokenAddress) {
        return res.status(400).json({ error: "Token address is required" });
    }

    try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        const [name, symbol, decimals, totalSupply] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.decimals(),
            contract.totalSupply()
        ]);

        const formattedTotalSupply = ethers.formatUnits(totalSupply, decimals);

        res.json({
            address: tokenAddress,
            name,
            symbol,
            decimals: decimals.toString(), // Convert to string
            totalSupply: formattedTotalSupply.toString()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch token details" });
    }
});

router.post('/verify-contract', async (req, res) => {
    const { 
        sourceCode, 
        constructorArguments, 
        contractAddress, 
        contractName, 
        compilerVersion 
    } = req.body;

    if (!sourceCode || !contractAddress || !contractName || !compilerVersion) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare API request parameters
    const params = {
        module: 'contract',
        action: 'verifysourcecode',
        apikey: 'XIU4BS3YVKXF6JEQ7ENQ6G8DJQMK6YQNSF',
        codeformat: 'solidity-standard-json-input',  // Use JSON format
        sourceCode: sourceCode, 
        constructorArguements: constructorArguments || '',
        contractaddress: contractAddress,
        contractname: contractName,
        compilerversion: compilerVersion
    };

    try {
        // Make the request to Etherscan
        const response = await axios.post('https://api.etherscan.io/api', null, { params });

        // Return the API response to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error verifying contract:', error);
        res.status(500).json({ error: 'Failed to verify contract' });
    }
});
module.exports = router;