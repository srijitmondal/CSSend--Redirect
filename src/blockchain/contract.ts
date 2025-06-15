
// src/blockchain/contract.ts
import web3 from "./web3.js";
import contractABI from "./abi/Voting.json";

const contractAddress = "0xYourDeployedContractAddressHere"; // Replace with Ganache deployed address

const contract = new web3.eth.Contract(contractABI, contractAddress);

export default contract;
