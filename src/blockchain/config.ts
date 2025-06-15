
// Blockchain configuration for local Ganache network
export const BLOCKCHAIN_CONFIG = {
  // Replace with your actual deployed contract address from Ganache
  contractAddress: "0xYourDeployedContractAddressHere",
  
  // Ganache default network configuration
  network: {
    chainId: "0x539", // 1337 in hex (Ganache default)
    chainName: "Ganache Local",
    rpcUrls: ["http://127.0.0.1:7545"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18
    }
  }
};

// Instructions for setup
export const SETUP_INSTRUCTIONS = `
To connect to your local Ganache blockchain:

1. Make sure Ganache is running on http://127.0.0.1:7545
2. Deploy your Voting.sol contract to Ganache
3. Update the contractAddress in src/blockchain/config.ts with your deployed contract address
4. Add the Ganache network to MetaMask:
   - Network Name: Ganache Local
   - RPC URL: http://127.0.0.1:7545
   - Chain ID: 1337
   - Currency Symbol: ETH
5. Import a Ganache account into MetaMask using the private key from Ganache
`;
