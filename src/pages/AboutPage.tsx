
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Database, Vote, Users, Eye } from 'lucide-react';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex mb-4 bg-electra-blue-50 text-electra-blue-700 py-1 px-3 rounded-full text-sm font-medium">
            About ElectraGuard
          </div>
          <h1 className="text-4xl font-bold mb-6">
            Revolutionizing Elections with <span className="electra-gradient-text">Blockchain Technology</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            ElectraGuard is a next-generation voting system that leverages the security, transparency, and immutability of blockchain technology to ensure fair and tamper-proof elections.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-electra-blue-100 p-4 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8 text-electra-blue-700" />
              </div>
              <CardTitle>Secure</CardTitle>
              <CardDescription>
                Military-grade encryption and decentralized architecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Our platform employs cutting-edge encryption and secure authentication to protect votes from tampering or unauthorized access.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-electra-purple-100 p-4 rounded-full w-fit mb-4">
                <Eye className="h-8 w-8 text-electra-purple-700" />
              </div>
              <CardTitle>Transparent</CardTitle>
              <CardDescription>
                Full visibility into the voting process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Blockchain technology ensures complete transparency while maintaining voter privacy, allowing for public verification without revealing individual votes.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-electra-blue-100 p-4 rounded-full w-fit mb-4">
                <Database className="h-8 w-8 text-electra-blue-700" />
              </div>
              <CardTitle>Immutable</CardTitle>
              <CardDescription>
                Tamper-proof voting records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Once recorded on the blockchain, votes cannot be altered or deleted, ensuring the integrity of election results and preventing fraud.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How ElectraGuard Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines blockchain technology with a user-friendly interface to create a seamless and secure voting experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-electra-blue-100 h-10 w-10 rounded-full flex items-center justify-center text-electra-blue-700 font-bold">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Secure Voter Registration</h3>
                    <p className="text-muted-foreground">
                      Voters register with verified credentials and receive a unique cryptographic identity that preserves their anonymity while ensuring only eligible voters participate.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-electra-blue-100 h-10 w-10 rounded-full flex items-center justify-center text-electra-blue-700 font-bold">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ballot Creation and Deployment</h3>
                    <p className="text-muted-foreground">
                      Election administrators create digital ballots using smart contracts that are deployed to the blockchain, ensuring they cannot be modified once published.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-electra-blue-100 h-10 w-10 rounded-full flex items-center justify-center text-electra-blue-700 font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Secure Voting</h3>
                    <p className="text-muted-foreground">
                      Voters cast encrypted ballots that are securely recorded on the blockchain, with zero-knowledge proofs ensuring vote privacy while preventing double-voting.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-electra-blue-100 h-10 w-10 rounded-full flex items-center justify-center text-electra-blue-700 font-bold">4</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Transparent Counting</h3>
                    <p className="text-muted-foreground">
                      Votes are automatically tallied by the smart contract, with real-time results available for public verification through the blockchain explorer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-8 border border-border">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="font-mono text-sm mb-6">
                  <p className="text-green-600">// ElectraGuard Smart Contract</p>
                  <p><span className="text-blue-600">contract</span> <span className="text-purple-600">ElectionContract</span> {`{`}</p>
                  <p className="ml-4"><span className="text-blue-600">mapping</span>(address =&gt; <span className="text-blue-600">bool</span>) <span className="text-blue-600">public</span> hasVoted;</p>
                  <p className="ml-4"><span className="text-blue-600">mapping</span>(uint =&gt; uint) <span className="text-blue-600">public</span> candidateVotes;</p>
                  <p className="ml-4"><span className="text-blue-600">event</span> <span className="text-purple-600">VoteCast</span>(address indexed voter, uint candidateId);</p>
                  <p>&nbsp;</p>
                  <p className="ml-4"><span className="text-blue-600">function</span> <span className="text-purple-600">castVote</span>(uint candidateId) <span className="text-blue-600">public</span> {`{`}</p>
                  <p className="ml-8"><span className="text-blue-600">require</span>(!hasVoted[msg.sender], <span className="text-orange-600">"Already voted"</span>);</p>
                  <p className="ml-8">hasVoted[msg.sender] = <span className="text-blue-600">true</span>;</p>
                  <p className="ml-8">candidateVotes[candidateId]++;</p>
                  <p className="ml-8"><span className="text-blue-600">emit</span> <span className="text-purple-600">VoteCast</span>(msg.sender, candidateId);</p>
                  <p className="ml-4">{`}`}</p>
                  <p>{`}`}</p>
                </div>
                
                <div className="border-t border-border pt-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    This simplified smart contract demonstrates how votes are recorded on the blockchain, ensuring each voter can only vote once and all votes are immutably stored.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn more about ElectraGuard and how it can transform your elections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Is my vote really anonymous?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. ElectraGuard uses advanced cryptographic techniques to ensure your vote is recorded while keeping your identity separate from your voting choice. Your vote cannot be traced back to you personally.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How secure is the blockchain against hacking?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Blockchain technology is extremely resistant to hacking due to its decentralized nature and cryptographic security. To compromise the system, an attacker would need to control the majority of the network, which is practically impossible.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Can election administrators modify votes?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No. Once a vote is recorded on the blockchain, it cannot be altered by anyone, including administrators. The immutability of blockchain records ensures the integrity of all votes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What if I lose my voter credentials?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  ElectraGuard includes a secure recovery process that verifies your identity through multiple authentication factors, allowing you to regain access to your voting account without compromising security.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How can I verify my vote was counted?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  After voting, you receive a unique transaction hash that allows you to verify your vote was recorded on the blockchain. You can check this through our blockchain explorer without revealing your voting choice.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Can ElectraGuard handle large-scale elections?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes. Our platform is built to scale and can handle national elections with millions of voters. The distributed nature of blockchain allows for parallel processing of votes across the network.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="text-center py-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            ElectraGuard is developed by a team of blockchain experts, cryptographers, and election security specialists dedicated to bringing transparency and security to democratic processes worldwide.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
