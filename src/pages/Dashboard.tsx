// src/pages/Dashboard.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart2, Brain, Wind, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentStreak, getTotalSessions, getOverallAverageStress, getLastCheckInTime } from '@/lib/stress-storage';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Get real data from stress-storage
  const streakDays = getCurrentStreak();
  const completedSessions = getTotalSessions();
  const avgStressLevel = getOverallAverageStress() || 0;
  const lastLoggedDate = getLastCheckInTime() || 'Never';
  const upcomingReminder = "Breathing exercise at 5:00 PM"; // You could implement a reminder system later
  const handleQuickBreathingStart = () => {
    // Navigate to breathing exercises page with a query parameter
    navigate('/app/breathing?exercise=4-7-8-breathing');
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Activity className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-gray-600">Here's an overview of your mindfulness journey</p>
          </div>
        </div>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{streakDays}</div>
              <div className="text-sm text-muted-foreground ml-2">days</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedSessions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Stress Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{avgStressLevel.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground ml-2">/ 10</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Check-in</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{typeof lastLoggedDate === 'string' && lastLoggedDate.startsWith('Today') 
              ? 'Today' 
              : lastLoggedDate}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick actions */}
      <h3 className="text-xl font-semibold mt-8 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="feature-card transition-all duration-300">
          <CardHeader>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <BarChart2 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Record Stress Level</CardTitle>
            <CardDescription>
              How are you feeling today?
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/app/stress')} className="w-full bg-primary hover:bg-primary/90">
              Track Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="feature-card transition-all duration-300">
          <CardHeader>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <Wind className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Quick Breathing</CardTitle>
            <CardDescription>
              4-7-8 breathing technique
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={handleQuickBreathingStart} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Start <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="feature-card transition-all duration-300">
          <CardHeader>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>5-Min Meditation</CardTitle>
            <CardDescription>
              Quick mindfulness practice
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Begin <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Reminder */}
      <div className="bg-accent rounded-lg p-4 mt-6 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Upcoming Reminder</h3>
          <p className="text-sm text-muted-foreground">{upcomingReminder}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;