
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Vote, Lock, Database, UserCheck, BarChart3 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useBlockchain } from '@/context/BlockchainContext';
import ElectionCard from '@/components/ElectionCard';

const HomePage = () => {
  const { elections } = useBlockchain();
  const activeElections = elections.filter(e => e.status === 'active').slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-electra-blue-900/20 to-electra-purple-900/20 z-0" />
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="mb-2 inline-flex bg-electra-blue-50 text-electra-blue-700 py-1 px-3 rounded-full text-sm font-medium">
                Blockchain Secured Voting
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Secure Elections with <span className="electra-gradient-text">ElectraGuard</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                The next generation of transparent, immutable and secure voting systems powered by blockchain technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/elections">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Elections
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto" variant="outline">
                    Register as Voter
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-electra-blue-500/10 to-electra-purple-500/10 rounded-lg transform rotate-6"></div>
                <div className="relative bg-background rounded-lg p-8 border border-border shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-electra-blue-500" />
                      <span className="font-bold electra-gradient-text">ElectraGuard</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Block #16483921</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-muted rounded p-4">
                      <div className="text-sm font-medium mb-1">Transaction Hash</div>
                      <div className="font-mono text-xs truncate">0x71c7656ec7ab88b098defb751b7401b5f6d8976f</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded p-3">
                        <div className="text-xs font-medium mb-1">From</div>
                        <div className="font-mono text-xs truncate">0x8c5be1e...</div>
                      </div>
                      <div className="bg-muted rounded p-3">
                        <div className="text-xs font-medium mb-1">To</div>
                        <div className="font-mono text-xs truncate">0x6b175474...</div>
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded p-4">
                      <div className="text-sm font-medium mb-1">Vote Data</div>
                      <div className="font-mono text-xs">castVote(electionId, candidateId, voterId)</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-green-500/10 text-green-700 rounded">
                      <span className="text-xs">Status</span>
                      <span className="text-xs font-medium">CONFIRMED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why ElectraGuard?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines the security of blockchain technology with a user-friendly interface to revolutionize the voting experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="bg-electra-blue-100 p-3 rounded-full w-fit mb-4">
                <Lock className="h-6 w-6 text-electra-blue-700" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Enhanced Security</h3>
              <p className="text-muted-foreground">
                Military-grade encryption and blockchain technology ensure your vote is secure and tamper-proof.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="bg-electra-purple-100 p-3 rounded-full w-fit mb-4">
                <Database className="h-6 w-6 text-electra-purple-700" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Immutable Records</h3>
              <p className="text-muted-foreground">
                Once recorded on the blockchain, votes cannot be altered or deleted, ensuring complete transparency.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <div className="bg-electra-blue-100 p-3 rounded-full w-fit mb-4">
                <UserCheck className="h-6 w-6 text-electra-blue-700" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Secure Authentication</h3>
              <p className="text-muted-foreground">
                Multi-factor authentication and secure voter verification prevent fraud and ensure one person, one vote.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Active Elections Section */}
      {activeElections.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Active Elections</h2>
              <Link to="/elections">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeElections.map(election => (
                <ElectionCard key={election.id} election={election} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ElectraGuard makes the voting process secure, transparent, and accessible in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-electra-blue-100 text-electra-blue-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">Register</h3>
              <p className="text-muted-foreground text-sm">
                Create your secure voter account with proper verification.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-electra-blue-100 text-electra-blue-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">Authenticate</h3>
              <p className="text-muted-foreground text-sm">
                Verify your identity through our multi-factor authentication system.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-electra-blue-100 text-electra-blue-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Vote</h3>
              <p className="text-muted-foreground text-sm">
                Cast your vote securely in available elections.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-electra-blue-100 text-electra-blue-700 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold text-lg mb-2">Verify</h3>
              <p className="text-muted-foreground text-sm">
                Confirm your vote on the blockchain and track the results.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-electra-blue-700 to-electra-purple-700 rounded-xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to transform your voting process?</h2>
                <p className="mb-8 text-white/80">
                  Join thousands of organizations worldwide that are already using ElectraGuard for secure and transparent elections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 w-full sm:w-auto">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="hidden md:flex justify-end">
                <BarChart3 className="h-48 w-48 text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
