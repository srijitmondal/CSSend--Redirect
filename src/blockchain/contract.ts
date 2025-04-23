// src/blockchain/contract.ts
import web3 from "./web3";
import contractABI from "./abi/Voting.json";

const contractAddress = "0xYourDeployedContractAddressHere"; // Replace with Ganache deployed address

const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

export default contract;
