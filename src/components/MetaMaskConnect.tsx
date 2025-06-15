
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWeb3 } from '@/context/Web3Context';
import { Wallet, AlertTriangle } from 'lucide-react';

const MetaMaskConnect = () => {
  const { account, isConnected, isLoading, connectWallet, disconnectWallet } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!window.ethereum) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          MetaMask is not installed. Please install MetaMask to interact with the blockchain.
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://metamask.io/download/', '_blank')}
            >
              Install MetaMask
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to participate in blockchain voting
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm font-medium text-green-800">Connected Account:</p>
              <p className="text-sm text-green-600 font-mono">{formatAddress(account!)}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={disconnectWallet}
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <Button 
            onClick={connectWallet}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaMaskConnect;
