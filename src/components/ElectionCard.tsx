
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, BarChart } from 'lucide-react';
import { Election } from '@/context/BlockchainContext';
import { formatDistanceToNow, format, isPast, isFuture } from 'date-fns';

interface ElectionCardProps {
  election: Election;
}

const ElectionCard: React.FC<ElectionCardProps> = ({ election }) => {
  const navigate = useNavigate();
  
  const startDate = new Date(election.startDate);
  const endDate = new Date(election.endDate);
  const now = new Date();
  
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
  
  const getStatusText = () => {
    switch (election.status) {
      case 'active':
        return 'Active';
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
    }
  };
  
  const getTotalVotes = () => {
    return election.candidates.reduce((total, candidate) => total + candidate.voteCount, 0);
  };
  
  const getTimeInfo = () => {
    if (isPast(endDate)) {
      return `Ended ${formatDistanceToNow(endDate, { addSuffix: true })}`;
    }
    
    if (isFuture(startDate)) {
      return `Starts ${formatDistanceToNow(startDate, { addSuffix: true })}`;
    }
    
    if (election.status === 'active') {
      return `Ends ${formatDistanceToNow(endDate, { addSuffix: true })}`;
    }
    
    return '';
  };

  return (
    <Card className="h-full flex flex-col transform hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="mb-1">{election.title}</CardTitle>
            <CardDescription>{election.description}</CardDescription>
          </div>
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="flex items-center text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2 text-electra-purple-500" />
            <div className="text-sm">
              <div>Start: {format(startDate, 'PPP')}</div>
              <div>End: {format(endDate, 'PPP')}</div>
              <div className="text-xs font-medium text-foreground">{getTimeInfo()}</div>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2 text-electra-purple-500" />
            <span className="text-sm">{election.candidates.length} Candidate{election.candidates.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <BarChart className="h-4 w-4 mr-2 text-electra-purple-500" />
            <span className="text-sm">{getTotalVotes()} Vote{getTotalVotes() !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => navigate(`/elections/${election.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ElectionCard;
