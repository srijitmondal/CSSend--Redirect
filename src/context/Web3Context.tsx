
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';

// Contract ABI - you'll need to replace this with your actual contract ABI
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "candidatesCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "candidates",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "uint256", "name": "voteCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "hasVoted",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_candidateId", "type": "uint256"}],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
    "name": "getCandidate",
    "outputs": [
      {"internalType": "string", "name": "", "type": "string"},
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Replace with your deployed contract address from Ganache
const CONTRACT_ADDRESS = "0xYourDeployedContractAddressHere";

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  castVote: (candidateId: number) => Promise<string | null>;
  checkIfVoted: (address: string) => Promise<boolean>;
  getCandidateData: (candidateId: number) => Promise<{name: string, voteCount: number} | null>;
  getCandidatesCount: () => Promise<number>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  };

  // Initialize Web3 connection
  const initializeWeb3 = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      setContract(contractInstance);

      // Check if already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      toast.error('Failed to initialize Web3 connection');
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        toast.success('Wallet connected successfully!');
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      if (error.code === 4001) {
        toast.error('Please connect to MetaMask.');
      } else {
        toast.error('Failed to connect wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    toast.success('Wallet disconnected');
  };

  // Cast vote function
  const castVote = async (candidateId: number): Promise<string | null> => {
    if (!contract || !account) {
      toast.error('Please connect your wallet first');
      return null;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      // Check if user has already voted
      const hasVoted = await contract.hasVoted(account);
      if (hasVoted) {
        toast.error('You have already voted!');
        return null;
      }

      // Send transaction
      const tx = await contractWithSigner.vote(candidateId);
      toast.success('Transaction submitted! Waiting for confirmation...');
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      toast.success('Vote cast successfully!');
      
      return receipt.hash;
    } catch (error: any) {
      console.error('Failed to cast vote:', error);
      if (error.code === 4001) {
        toast.error('Transaction was rejected by user');
      } else if (error.message.includes('Already voted')) {
        toast.error('You have already voted!');
      } else {
        toast.error('Failed to cast vote: ' + (error.reason || error.message));
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has voted
  const checkIfVoted = async (address: string): Promise<boolean> => {
    if (!contract) return false;
    
    try {
      return await contract.hasVoted(address);
    } catch (error) {
      console.error('Failed to check voting status:', error);
      return false;
    }
  };

  // Get candidate data
  const getCandidateData = async (candidateId: number): Promise<{name: string, voteCount: number} | null> => {
    if (!contract) return null;
    
    try {
      const [name, voteCount] = await contract.getCandidate(candidateId);
      return { name, voteCount: Number(voteCount) };
    } catch (error) {
      console.error('Failed to get candidate data:', error);
      return null;
    }
  };

  // Get total candidates count
  const getCandidatesCount = async (): Promise<number> => {
    if (!contract) return 0;
    
    try {
      const count = await contract.candidatesCount();
      return Number(count);
    } catch (error) {
      console.error('Failed to get candidates count:', error);
      return 0;
    }
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeWeb3();
  }, [initializeWeb3]);

  return (
    <Web3Context.Provider value={{
      account,
      isConnected,
      isLoading,
      contract,
      connectWallet,
      disconnectWallet,
      castVote,
      checkIfVoted,
      getCandidateData,
      getCandidatesCount
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
