let web3;
let contract;
const contractAddress = "0x350ffA258D5BF5E2E1CcBefd6AbBa7E5FB950ed9";
const abi = [
  {
    "inputs": [],
    "name": "modelCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "models",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "ratingSum",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "ratingCount",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "pendingWithdrawals",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "purchases",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "listModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      }
    ],
    "name": "purchaseModel",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "rating",
        "type": "uint8"
      }
    ],
    "name": "rateModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      }
    ],
    "name": "getModelDetails",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "averageRating",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

window.onload = async () => {
  web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const accounts = await web3.eth.getAccounts();
  contract = new web3.eth.Contract(abi, contractAddress);
  loadModels();
};

document.getElementById('listModelForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('modelName').value;
  const description = document.getElementById('modelDescription').value;
  const priceInEther = document.getElementById('modelPrice').value;
  const price = web3.utils.toWei(priceInEther, 'ether');
  const accounts = await web3.eth.getAccounts();

  await contract.methods.listModel(name, description, price).send({ from: accounts[0] });
  alert("Model listed successfully!");
  loadModels();
});

async function loadModels() {
  const modelCount = await contract.methods.modelCount().call();
  let modelList = document.getElementById('modelList');
  modelList.innerHTML = '';

  for (let i = 1; i <= modelCount; i++) {
    const model = await contract.methods.models(i).call();
    modelList.innerHTML += `
      <div>
        <h3>Model ID: ${model.id}</h3>
        <p><strong>Name:</strong> ${model.name}</p>
        <p><strong>Description:</strong> ${model.description}</p>
        <p><strong>Price:</strong> ${web3.utils.fromWei(model.price, 'ether')} ETH</p>
        <button onclick="purchaseModel(${model.id})">Purchase</button>
        <button onclick="viewModelDetails(${model.id})">View Details</button>
      </div>
    `;
  }
}

async function purchaseModel(modelId) {
  const model = await contract.methods.models(modelId).call();
  const accounts = await web3.eth.getAccounts();

  await contract.methods.purchaseModel(modelId).send({
    from: accounts[0],
    value: model.price
  });
  alert(`Model ${modelId} purchased successfully!`);
}

async function viewModelDetails(modelId) {
  const model = await contract.methods.getModelDetails(modelId).call();
  alert(`Model Details:\n
    ID: ${model.id}\n
    Name: ${model.name}\n
    Description: ${model.description}\n
    Price: ${web3.utils.fromWei(model.price, 'ether')} ETH\n
    Creator: ${model.creator}\n
    Average Rating: ${model.averageRating}`);
}

document.getElementById('rateModelForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const modelId = document.getElementById('modelId').value;
  const rating = document.getElementById('rating').value;
  const accounts = await web3.eth.getAccounts();

  await contract.methods.rateModel(modelId, rating).send({ from: accounts[0] });
  alert(`Model ${modelId} rated successfully!`);
});

async function withdrawFunds() {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.withdrawFunds().send({ from: accounts[0] });
  alert("Funds withdrawn successfully!");
}