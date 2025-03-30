import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useBlockchain, Candidate } from '@/context/BlockchainContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarDays, Users, Clock, AlertTriangle, Check, ExternalLink, Vote, Shield, Database, BarChart } from 'lucide-react';
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';
import { toast } from 'sonner';

const ElectionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getElection, castVote, getUserVote, transactions, loading } = useBlockchain();
  const { user, isAuthenticated } = useAuth();
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  
  if (!id) {
    navigate('/elections');
    return null;
  }
  
  const election = getElection(id);
  
  if (!election) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Election Not Found</h1>
          <p className="text-muted-foreground mb-8">The election you're looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate('/elections')}>Back to Elections</Button>
        </div>
      </Layout>
    );
  }
  
  const userVote = user && user.voterId 
    ? getUserVote(election.id, user.voterId)
    : undefined;
  
  const electionTransactions = transactions.filter(
    t => t.description.includes(election.id) || t.description.includes(election.title)
  );
  
  const startDate = new Date(election.startDate);
  const endDate = new Date(election.endDate);
  const now = new Date();
  
  const isActive = election.status === 'active';
  const hasEnded = isPast(endDate);
  const notStarted = isFuture(startDate);
  
  const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
  
  const getStatusColor = () => {
    switch (election.status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
    }
  };
  
  const getTimeInfo = () => {
    if (hasEnded) {
      return `Ended ${formatDistanceToNow(endDate, { addSuffix: true })}`;
    }
    
    if (notStarted) {
      return `Starts ${formatDistanceToNow(startDate, { addSuffix: true })}`;
    }
    
    if (isActive) {
      return `Ends ${formatDistanceToNow(endDate, { addSuffix: true })}`;
    }
    
    return '';
  };
  
  const handleVoteSubmit = async () => {
    if (!selectedCandidate || !user?.voterId) return;
    
    setIsVoting(true);
    try {
      await castVote(election.id, selectedCandidate.id, user.voterId);
      setSelectedCandidate(null);
    } catch (error) {
      console.error('Voting error:', error);
    } finally {
      setIsVoting(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const getCandidatePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{election.title}</h1>
                  <Badge className={getStatusColor()}>
                    {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{election.description}</p>
              </div>
              
              <Button 
                onClick={() => navigate('/elections')}
                variant="outline"
              >
                Back to Elections
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-electra-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">{format(startDate, 'PPP')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-electra-blue-500" />
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">{format(endDate, 'PPP')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-electra-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-muted-foreground">{getTimeInfo()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="candidates">
              <TabsList className="mb-6">
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="results">Live Results</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="candidates">
                <div className="space-y-4">
                  {election.candidates.map(candidate => (
                    <Card 
                      key={candidate.id} 
                      className={`${
                        selectedCandidate?.id === candidate.id 
                          ? 'ring-2 ring-electra-blue-500' 
                          : ''
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 bg-electra-blue-100 text-electra-blue-700">
                              <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{candidate.name}</h3>
                              <p className="text-muted-foreground">{candidate.party}</p>
                            </div>
                          </div>
                          
                          {isActive && !userVote && user?.role === 'voter' && (
                            <Button 
                              variant={selectedCandidate?.id === candidate.id ? "default" : "outline"}
                              onClick={() => setSelectedCandidate(candidate)}
                              disabled={isVoting}
                            >
                              {selectedCandidate?.id === candidate.id ? 'Selected' : 'Select'}
                            </Button>
                          )}
                          
                          {userVote && userVote.candidateId === candidate.id && (
                            <Badge className="bg-green-500">
                              <Check className="mr-1 h-3 w-3" />
                              Your Vote
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {!isAuthenticated && (
                  <Alert className="mt-6">
                    <AlertTitle>Authentication Required</AlertTitle>
                    <AlertDescription>
                      You need to be logged in to vote in this election.
                      <div className="mt-2">
                        <Button onClick={() => navigate('/login')} size="sm">Log in</Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {isAuthenticated && user?.role !== 'voter' && (
                  <Alert className="mt-6">
                    <AlertTitle>Voter Account Required</AlertTitle>
                    <AlertDescription>
                      You need a voter account to participate in this election.
                    </AlertDescription>
                  </Alert>
                )}
                
                {isAuthenticated && user?.role === 'voter' && !isActive && (
                  <Alert className="mt-6">
                    <Clock className="h-4 w-4" />
                    <AlertTitle>Election not active</AlertTitle>
                    <AlertDescription>
                      {notStarted 
                        ? `This election has not started yet. It will begin on ${format(startDate, 'PPP')}.` 
                        : `This election has ended. Voting closed on ${format(endDate, 'PPP')}.`}
                    </AlertDescription>
                  </Alert>
                )}
                
                {isAuthenticated && user?.role === 'voter' && isActive && userVote && (
                  <Alert className="mt-6 bg-green-500/10 text-green-700 border-green-500">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Vote Recorded</AlertTitle>
                    <AlertDescription>
                      Your vote has been securely recorded on the blockchain.
                      {userVote.transactionHash && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-xs font-mono truncate">{userVote.transactionHash}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {isAuthenticated && user?.role === 'voter' && isActive && !userVote && (
                  <div className="mt-6 flex justify-end">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          disabled={!selectedCandidate || isVoting}
                          className="w-full md:w-auto"
                        >
                          {isVoting ? 'Processing...' : 'Cast Vote'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to cast your vote for <strong>{selectedCandidate?.name}</strong> in the <strong>{election.title}</strong> election.
                            <div className="mt-4 bg-muted p-4 rounded-md">
                              <p>Please note:</p>
                              <ul className="list-disc pl-4 mt-2 space-y-1">
                                <li>Your vote will be recorded on the blockchain</li>
                                <li>Once submitted, it cannot be changed or removed</li>
                                <li>Your vote is secure and encrypted</li>
                              </ul>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleVoteSubmit}>
                            Confirm Vote
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="results">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-electra-blue-500" />
                      Live Results
                    </CardTitle>
                    <CardDescription>
                      {totalVotes} vote{totalVotes !== 1 ? 's' : ''} recorded on the blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {election.candidates.map(candidate => (
                        <div key={candidate.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8 bg-muted">
                                <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                              </Avatar>
                              <span>{candidate.name}</span>
                            </div>
                            <div className="font-medium">
                              {candidate.voteCount} vote{candidate.voteCount !== 1 ? 's' : ''} ({getCandidatePercentage(candidate.voteCount)}%)
                            </div>
                          </div>
                          <Progress value={getCandidatePercentage(candidate.voteCount)} className="h-2" />
                        </div>
                      ))}
                    </div>
                    
                    {totalVotes === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        No votes have been cast yet in this election
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="blockchain">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-electra-blue-500" />
                      Blockchain Transactions
                    </CardTitle>
                    <CardDescription>
                      Immutable record of all transactions related to this election
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {electionTransactions.length > 0 ? (
                        electionTransactions.map(transaction => (
                          <div key={transaction.hash} className="p-4 border rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-mono text-xs truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                {transaction.hash}
                              </div>
                              <Badge variant="outline">Block #{transaction.blockNumber}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div className="text-muted-foreground">From:</div>
                              <div className="font-mono truncate">{transaction.from}</div>
                              <div className="text-muted-foreground">To:</div>
                              <div className="font-mono truncate">{transaction.to}</div>
                              <div className="text-muted-foreground">Timestamp:</div>
                              <div>{format(new Date(transaction.timestamp), 'PPp')}</div>
                              <div className="text-muted-foreground">Description:</div>
                              <div>{transaction.description}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          No blockchain transactions found for this election
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-electra-blue-500" />
                  Blockchain Security
                </CardTitle>
                <CardDescription>
                  How your vote is secured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted rounded-md p-4">
                    <h3 className="font-medium mb-2">Immutable Record</h3>
                    <p className="text-sm text-muted-foreground">
                      Once cast, your vote is permanently recorded on the blockchain and cannot be altered or deleted.
                    </p>
                  </div>
                  
                  <div className="bg-muted rounded-md p-4">
                    <h3 className="font-medium mb-2">Encrypted Voting</h3>
                    <p className="text-sm text-muted-foreground">
                      Your vote is encrypted using advanced cryptographic techniques to ensure privacy.
                    </p>
                  </div>
                  
                  <div className="bg-muted rounded-md p-4">
                    <h3 className="font-medium mb-2">Transparent Process</h3>
                    <p className="text-sm text-muted-foreground">
                      All votes are publicly verifiable while maintaining voter anonymity.
                    </p>
                  </div>
                  
                  <div className="bg-muted rounded-md p-4">
                    <h3 className="font-medium mb-2">Decentralized Network</h3>
                    <p className="text-sm text-muted-foreground">
                      The election is secured by a distributed network of nodes, eliminating single points of failure.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Election Smart Contract</h3>
                  <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
                    <p>contract ElectionContract {"{"}</p>
                    <p className="ml-4">mapping(address =&gt; bool) public hasVoted;</p>
                    <p className="ml-4">mapping(uint =&gt; uint) public candidateVotes;</p>
                    <p>{"}"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ElectionDetailsPage;
