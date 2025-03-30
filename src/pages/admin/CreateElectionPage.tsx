
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import RouteGuard from '@/components/RouteGuard';
import { useBlockchain, Candidate } from '@/context/BlockchainContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, X, Plus, AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const CreateElectionPage = () => {
  const navigate = useNavigate();
  const { createElection, loading } = useBlockchain();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [candidates, setCandidates] = useState<Partial<Candidate>[]>([
    { id: '1', name: '', party: '' },
    { id: '2', name: '', party: '' }
  ]);
  const [error, setError] = useState<string | null>(null);
  
  const handleAddCandidate = () => {
    setCandidates([
      ...candidates, 
      { id: (candidates.length + 1).toString(), name: '', party: '' }
    ]);
  };
  
  const handleRemoveCandidate = (index: number) => {
    if (candidates.length <= 2) {
      toast.error('Elections require at least two candidates');
      return;
    }
    const newCandidates = [...candidates];
    newCandidates.splice(index, 1);
    setCandidates(newCandidates);
  };
  
  const handleCandidateChange = (index: number, field: keyof Candidate, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index] = { ...newCandidates[index], [field]: value };
    setCandidates(newCandidates);
  };
  
  const validateForm = () => {
    if (!title.trim()) {
      setError('Election title is required');
      return false;
    }
    
    if (!description.trim()) {
      setError('Election description is required');
      return false;
    }
    
    if (!startDate) {
      setError('Start date is required');
      return false;
    }
    
    if (!endDate) {
      setError('End date is required');
      return false;
    }
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (endDateObj <= startDateObj) {
      setError('End date must be after start date');
      return false;
    }
    
    for (const candidate of candidates) {
      if (!candidate.name?.trim() || !candidate.party?.trim()) {
        setError('All candidate fields are required');
        return false;
      }
    }
    
    const candidateNames = candidates.map(c => c.name?.trim().toLowerCase());
    const uniqueNames = new Set(candidateNames);
    
    if (uniqueNames.size !== candidateNames.length) {
      setError('Candidate names must be unique');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const newElection = await createElection({
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        candidates: candidates as Candidate[],
        createdBy: '1', // using a default admin ID
      });
      
      toast.success('Election created successfully!');
      navigate(`/elections/${newElection.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create election');
    }
  };
  
  // Format current date to yyyy-MM-dd for input[type="date"]
  const formatDateForInput = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };
  
  const today = formatDateForInput(new Date());

  return (
    <RouteGuard allowedRoles={['admin']}>
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/admin/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-electra-blue-100 p-3 rounded-full">
                <Vote className="h-6 w-6 text-electra-blue-700" />
              </div>
              <h1 className="text-3xl font-bold">Create New Election</h1>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Election Details</CardTitle>
                  <CardDescription>
                    Basic information about the election
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Election Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Presidential Election 2024"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the purpose and scope of this election"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        min={today}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        min={startDate || today}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Candidates</CardTitle>
                  <CardDescription>
                    Add candidates for this election
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {candidates.map((candidate, index) => (
                      <div 
                        key={index} 
                        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="grid gap-2">
                          <Label htmlFor={`candidate-name-${index}`}>Candidate Name</Label>
                          <Input
                            id={`candidate-name-${index}`}
                            placeholder="Full name"
                            value={candidate.name || ''}
                            onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor={`candidate-party-${index}`}>Party / Affiliation</Label>
                          <Input
                            id={`candidate-party-${index}`}
                            placeholder="Political party or affiliation"
                            value={candidate.party || ''}
                            onChange={(e) => handleCandidateChange(index, 'party', e.target.value)}
                            required
                          />
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCandidate(index)}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCandidate}
                    className="mt-6"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Candidate
                  </Button>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Election'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </RouteGuard>
  );
};

export default CreateElectionPage;
