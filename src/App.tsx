
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ElectionsPage from '@/pages/ElectionsPage';
import ElectionDetailsPage from '@/pages/ElectionDetailsPage';
import CreateElectionPage from '@/pages/CreateElectionPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import { AuthProvider } from '@/context/AuthContext';
import { BlockchainProvider } from '@/context/BlockchainContext';
import { Toaster } from '@/components/ui/sonner';
import { Web3Provider } from '@/context/Web3Context';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Web3Provider>
          <AuthProvider>
            <BlockchainProvider>
              <Toaster />
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/elections" element={<ElectionsPage />} />
                  <Route path="/elections/:id" element={<ElectionDetailsPage />} />
                  <Route path="/create-election" element={<CreateElectionPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </div>
            </BlockchainProvider>
          </AuthProvider>
        </Web3Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
