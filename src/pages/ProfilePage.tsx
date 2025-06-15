
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <p className="text-muted-foreground">Profile management coming soon...</p>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
