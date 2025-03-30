
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import RouteGuard from '@/components/RouteGuard';
import { useBlockchain } from '@/context/BlockchainContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Vote, Users, BarChart3, Clock, Shield, FilePlus } from 'lucide-react';

const AdminDashboardPage = () => {
  const { elections, votes, transactions } = useBlockchain();
  const navigate = useNavigate();
  
  const activeElections = elections.filter(e => e.status === 'active').length;
  const upcomingElections = elections.filter(e => e.status === 'upcoming').length;
  const completedElections = elections.filter(e => e.status === 'completed').length;
  
  const totalVotes = votes.length;
  const totalCandidates = elections.reduce((sum, election) => sum + election.candidates.length, 0);
  
  const electionStatusData = [
    { name: 'Active', value: activeElections, color: '#22c55e' },
    { name: 'Upcoming', value: upcomingElections, color: '#3b82f6' },
    { name: 'Completed', value: completedElections, color: '#6b7280' },
  ].filter(item => item.value > 0);
  
  const electionVotesData = elections
    .filter(election => {
      const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
      return totalVotes > 0;
    })
    .map(election => ({
      name: election.title.length > 20 ? election.title.substring(0, 20) + '...' : election.title,
      votes: election.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0),
    }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  return (
    <RouteGuard allowedRoles={['admin']}>
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold">Election Administrator Dashboard</h1>
            <Button onClick={() => navigate('/admin/elections/new')}>
              <FilePlus className="mr-2 h-4 w-4" />
              Create New Election
            </Button>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Elections</p>
                    <p className="text-3xl font-bold">{elections.length}</p>
                  </div>
                  <div className="bg-electra-blue-100 p-3 rounded-full">
                    <Vote className="h-6 w-6 text-electra-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Active Elections</p>
                    <p className="text-3xl font-bold">{activeElections}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Votes</p>
                    <p className="text-3xl font-bold">{totalVotes}</p>
                  </div>
                  <div className="bg-electra-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-electra-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Candidates</p>
                    <p className="text-3xl font-bold">{totalCandidates}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Election Status Distribution</CardTitle>
                <CardDescription>Overview of election status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {electionStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={electionStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {electionStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No election data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Elections by Votes</CardTitle>
                <CardDescription>Elections with the highest participation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {electionVotesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={electionVotesData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="votes" fill="#8884d8" name="Votes" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No vote data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-electra-blue-500" />
                Recent Blockchain Transactions
              </CardTitle>
              <CardDescription>
                Latest activity on the voting blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Transaction Hash</th>
                      <th className="text-left py-3 px-4">Block</th>
                      <th className="text-left py-3 px-4">From</th>
                      <th className="text-left py-3 px-4">To</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.slice(0, 5).map((tx) => (
                        <tr key={tx.hash} className="border-b hover:bg-muted">
                          <td className="py-3 px-4 font-mono">{tx.hash.substring(0, 10)}...</td>
                          <td className="py-3 px-4">{tx.blockNumber}</td>
                          <td className="py-3 px-4">{tx.from.substring(0, 10)}...</td>
                          <td className="py-3 px-4">{tx.to.substring(0, 10)}...</td>
                          <td className="py-3 px-4">{tx.description}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              tx.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : tx.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {transactions.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline">View All Transactions</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </RouteGuard>
  );
};

export default AdminDashboardPage;
