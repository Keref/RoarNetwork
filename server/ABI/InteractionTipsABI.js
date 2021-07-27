const InteractionTipsABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "messageContract",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "profileFactory",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "profileAddress",
				"type": "address"
			}
		],
		"name": "TippedProfile",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getTips",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "total",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "tippers",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "tippersAmount",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function",
		"constant": true
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "sendTip",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function",
		"payable": true
	},
	{
		"inputs": [],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

  
 
exports.InteractionTipsABI = InteractionTipsABI;