const ProfileFactoryABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address payable",
          "name": "profileAddress",
          "type": "address"
        }
      ],
      "name": "ProfileCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "profiles",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "deployNewProfile",
      "outputs": [
        {
          "internalType": "address",
          "name": "profileAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "getProfile",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "profileAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "oldName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "newName",
          "type": "string"
        }
      ],
      "name": "changeProfileName",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  
  
exports.ProfileFactoryABI = ProfileFactoryABI;