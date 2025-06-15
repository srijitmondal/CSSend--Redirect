
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useWeb3 } from '@/context/Web3Context';
import { Vote, Check, ExternalLink, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface BlockchainCandidate {
  id: number;
  name: string;
  voteCount: number;
}

const BlockchainVoting = () => {
  const { 
    account, 
    isConnected, 
    isLoading, 
    castVote, 
    checkIfVoted, 
    getCandidateData, 
    getCandidatesCount 
  } = useWeb3();
  
  const [candidates, setCandidates] = useState<BlockchainCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [lastTransactionHash, setLastTransactionHash] = useState<string | null>(null);

  // Load candidates from blockchain
  const loadCandidates = async () => {
    try {
      const count = await getCandidatesCount();
      const candidateList: BlockchainCandidate[] = [];
      
      for (let i = 0; i < count; i++) {
        const candidateData = await getCandidateData(i);
        if (candidateData) {
          candidateList.push({
            id: i,
            name: candidateData.name,
            voteCount: candidateData.voteCount
          });
        }
      }
      
      setCandidates(candidateList);
    } catch (error) {
      console.error('Failed to load candidates:', error);
      toast.error('Failed to load candidates from blockchain');
    }
  };

  // Check voting status
  const checkVotingStatus = async () => {
    if (account) {
      const voted = await checkIfVoted(account);
      setHasVoted(voted);
    }
  };

  // Handle vote submission
  const handleVote = async () => {
    if (selectedCandidate === null) return;
    
    setIsVoting(true);
    try {
      const txHash = await castVote(selectedCandidate);
      if (txHash) {
        setLastTransactionHash(txHash);
        setHasVoted(true);
        await loadCandidates(); // Refresh vote counts
        setSelectedCandidate(null);
      }
    } catch (error) {
      console.error('Voting failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  // Load data when connected
  useEffect(() => {
    if (isConnected) {
      loadCandidates();
      checkVotingStatus();
    }
  }, [isConnected, account]);

  if (!isConnected) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Wallet Not Connected</AlertTitle>
        <AlertDescription>
          Please connect your MetaMask wallet to participate in blockchain voting.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Blockchain Voting
          </CardTitle>
          <CardDescription>
            Cast your vote directly on the blockchain using your connected wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasVoted && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Vote Recorded</AlertTitle>
              <AlertDescription className="text-green-700">
                Your vote has been successfully recorded on the blockchain.
                {lastTransactionHash && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-mono">{lastTransactionHash.slice(0, 20)}...</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => window.open(`https://etherscan.io/tx/${lastTransactionHash}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold">Select a Candidate:</h3>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <Card 
                  key={candidate.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCandidate === candidate.id ? 'ring-2 ring-blue-500' : ''
                  } ${hasVoted ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current votes: {candidate.voteCount}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedCandidate === candidate.id && !hasVoted && (
                          <Badge>Selected</Badge>
                        )}
                        <Badge variant="outline">ID: {candidate.id}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">Loading candidates...</p>
            )}
          </div>

          {!hasVoted && (
            <div className="mt-6 flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={selectedCandidate === null || isVoting || isLoading}
                    className="w-full md:w-auto"
                  >
                    {isVoting ? 'Processing Transaction...' : 'Cast Vote on Blockchain'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Blockchain Vote</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to cast your vote for{' '}
                      <strong>
                        {candidates.find(c => c.id === selectedCandidate)?.name}
                      </strong>{' '}
                      on the blockchain.
                      
                      <div className="mt-4 bg-muted p-4 rounded-md">
                        <p className="font-medium">Important:</p>
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                          <li>This transaction will be recorded permanently on the blockchain</li>
                          <li>You will need to pay gas fees for this transaction</li>
                          <li>Once confirmed, your vote cannot be changed</li>
                          <li>Make sure you have enough ETH for gas fees</li>
                        </ul>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleVote}>
                      Confirm & Sign Transaction
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainVoting;
