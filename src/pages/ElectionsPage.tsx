
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useBlockchain, Election } from '@/context/BlockchainContext';
import ElectionCard from '@/components/ElectionCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

const ElectionsPage = () => {
  const { elections } = useBlockchain();
  const [searchTerm, setSearchTerm] = useState('');
  
  const activeElections = elections.filter(e => e.status === 'active');
  const upcomingElections = elections.filter(e => e.status === 'upcoming');
  const completedElections = elections.filter(e => e.status === 'completed');
  
  const filterElections = (electionList: Election[]) => {
    if (!searchTerm) return electionList;
    
    return electionList.filter(
      election => 
        election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const getTabCount = (count: number) => {
    return count > 0 ? <Badge variant="secondary">{count}</Badge> : null;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Elections</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse and participate in secure blockchain-based elections
          </p>
        </div>
        
        <div className="flex items-center mb-8 relative max-w-md mx-auto">
          <Search className="absolute left-3 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search elections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mx-auto mb-8 flex justify-center">
            <TabsTrigger value="active" className="flex gap-2 items-center">
              Active {getTabCount(activeElections.length)}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex gap-2 items-center">
              Upcoming {getTabCount(upcomingElections.length)}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex gap-2 items-center">
              Completed {getTabCount(completedElections.length)}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {filterElections(activeElections).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterElections(activeElections).map(election => (
                  <ElectionCard key={election.id} election={election} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No active elections found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming">
            {filterElections(upcomingElections).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterElections(upcomingElections).map(election => (
                  <ElectionCard key={election.id} election={election} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No upcoming elections found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {filterElections(completedElections).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterElections(completedElections).map(election => (
                  <ElectionCard key={election.id} election={election} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No completed elections found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ElectionsPage;
