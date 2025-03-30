
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  imageUrl?: string;
  voteCount: number;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  candidates: Candidate[];
  status: 'upcoming' | 'active' | 'completed';
  createdBy: string;
}

export interface Vote {
  id: string;
  electionId: string;
  candidateId: string;
  voterId: string;
  timestamp: string;
  transactionHash: string;
  blockNumber: number;
}

export interface Transaction {
  hash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface BlockchainContextType {
  elections: Election[];
  transactions: Transaction[];
  votes: Vote[];
  createElection: (election: Omit<Election, 'id' | 'status'>) => Promise<Election>;
  castVote: (electionId: string, candidateId: string, voterId: string) => Promise<Vote>;
  getElection: (id: string) => Election | undefined;
  getUserVote: (electionId: string, voterId: string) => Vote | undefined;
  loading: boolean;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedElections = localStorage.getItem('electraElections');
    const storedTransactions = localStorage.getItem('electraTransactions');
    const storedVotes = localStorage.getItem('electraVotes');

    if (storedElections) setElections(JSON.parse(storedElections));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedVotes) setVotes(JSON.parse(storedVotes));
    
    // Add sample elections if none exist
    if (!storedElections) {
      const sampleElections: Election[] = [
        {
          id: '1',
          title: 'Presidential Election 2024',
          description: 'National presidential election for the term 2024-2028',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          candidates: [
            { id: '1', name: 'Alice Johnson', party: 'Progressive Party', voteCount: 0 },
            { id: '2', name: 'Bob Smith', party: 'Conservative Union', voteCount: 0 },
            { id: '3', name: 'Carol Williams', party: 'Liberty Alliance', voteCount: 0 }
          ],
          status: 'active',
          createdBy: '1'
        }
      ];
      setElections(sampleElections);
      localStorage.setItem('electraElections', JSON.stringify(sampleElections));
    }
  }, []);

  // Save data to localStorage on change
  useEffect(() => {
    localStorage.setItem('electraElections', JSON.stringify(elections));
  }, [elections]);

  useEffect(() => {
    localStorage.setItem('electraTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('electraVotes', JSON.stringify(votes));
  }, [votes]);

  // Generate a fake transaction hash
  const generateHash = () => {
    return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  // Generate random block number
  const generateBlockNumber = () => {
    return Math.floor(16000000 + Math.random() * 1000000);
  };

  // Create a new election
  const createElection = async (electionData: Omit<Election, 'id' | 'status'>): Promise<Election> => {
    setLoading(true);
    try {
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newElection: Election = {
        ...electionData,
        id: Date.now().toString(),
        status: 'upcoming',
        candidates: electionData.candidates.map(c => ({ ...c, voteCount: 0 }))
      };
      
      const startDate = new Date(electionData.startDate);
      const now = new Date();
      
      if (startDate <= now) {
        newElection.status = 'active';
      }

      // Create a transaction for the election creation
      const transactionHash = generateHash();
      const blockNumber = generateBlockNumber();
      
      const newTransaction: Transaction = {
        hash: transactionHash,
        blockNumber,
        timestamp: new Date().toISOString(),
        from: 'ElectraGuard_System',
        to: 'ElectionSmartContract',
        description: `Election "${newElection.title}" created`,
        status: 'confirmed'
      };
      
      setElections(prev => [...prev, newElection]);
      setTransactions(prev => [...prev, newTransaction]);
      
      toast.success('Election created successfully!');
      return newElection;
    } catch (error) {
      console.error('Election creation error:', error);
      toast.error('Failed to create election');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cast a vote in an election
  const castVote = async (electionId: string, candidateId: string, voterId: string): Promise<Vote> => {
    setLoading(true);
    try {
      // Check if voter has already voted in this election
      const existingVote = votes.find(v => v.electionId === electionId && v.voterId === voterId);
      if (existingVote) {
        throw new Error('You have already voted in this election');
      }
      
      // Simulate blockchain delay and mining
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transactionHash = generateHash();
      const blockNumber = generateBlockNumber();
      
      // Create the vote record
      const newVote: Vote = {
        id: Date.now().toString(),
        electionId,
        candidateId,
        voterId,
        timestamp: new Date().toISOString(),
        transactionHash,
        blockNumber
      };
      
      // Create a transaction for the vote
      const newTransaction: Transaction = {
        hash: transactionHash,
        blockNumber,
        timestamp: new Date().toISOString(),
        from: `Voter_${voterId}`,
        to: 'VotingSmartContract',
        description: `Vote cast in election ${electionId}`,
        status: 'confirmed'
      };
      
      // Update the candidate vote count
      setElections(prev => 
        prev.map(election => 
          election.id === electionId 
            ? {
                ...election,
                candidates: election.candidates.map(candidate => 
                  candidate.id === candidateId 
                    ? { ...candidate, voteCount: candidate.voteCount + 1 }
                    : candidate
                )
              }
            : election
        )
      );
      
      setVotes(prev => [...prev, newVote]);
      setTransactions(prev => [...prev, newTransaction]);
      
      toast.success('Vote successfully recorded on the blockchain!');
      return newVote;
    } catch (error: any) {
      console.error('Voting error:', error);
      toast.error(error.message || 'Failed to cast vote');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get a specific election by ID
  const getElection = (id: string): Election | undefined => {
    return elections.find(election => election.id === id);
  };

  // Get a user's vote in a specific election
  const getUserVote = (electionId: string, voterId: string): Vote | undefined => {
    return votes.find(vote => vote.electionId === electionId && vote.voterId === voterId);
  };

  return (
    <BlockchainContext.Provider value={{
      elections,
      transactions,
      votes,
      createElection,
      castVote,
      getElection,
      getUserVote,
      loading
    }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};
