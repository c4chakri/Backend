const fs = require('fs');

// Read Solidity file as string
const solidityCode = fs.readFileSync('./dao.sol', 'utf8');

console.log(solidityCode);  // The Solidity file content as a string
