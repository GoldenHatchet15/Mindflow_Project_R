// src/components/breathing/BreathingHistory.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Download, 
  Calendar, 
  Clock, 
  Award, 
  Trash2, 
  Play, 
  Wind
} from 'lucide-react';
import { 
  getRecentSessions, 
  getTotalCompletedSessions, 
  getCurrentStreak, 
  getTotalBreathingTime,
  getMostPracticedExercise,
  deleteBreathingSession,
  BreathingSession
} from '@/lib/breathing-storage';

interface BreathingHistoryProps {
  onStartSession?: () => void;
}

const BreathingHistory: React.FC<BreathingHistoryProps> = ({ onStartSession }) => {
  const [recentSessions, setRecentSessions] = useState<BreathingSession[]>([]);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchSessions();
  }, []);
  
  // Function to fetch sessions
  const fetchSessions = () => {
    try {
      const sessions = getRecentSessions();
      setRecentSessions(sessions);
    } catch (error) {
      console.error('Error fetching breathing sessions:', error);
    }
  };
  
  // Handle delete session
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        deleteBreathingSession(id);
        setRecentSessions(prev => prev.filter(session => session.id !== id));
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };
  
  // Calculate data for weekly chart
  const getWeeklyChartData = () => {
    // Get last 7 days
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayStr = format(date, 'EEE');
      
      // Count sessions for this day
      const sessionsForDay = recentSessions.filter(session => {
        const sessionDate = format(new Date(session.date), 'yyyy-MM-dd');
        return sessionDate === dateStr && session.completed;
      });
      
      // Calculate total minutes for this day
      const totalMinutes = sessionsForDay.reduce((total, session) => 
        total + Math.round(session.duration / 60), 0);
      
      result.push({
        day: dayStr,
        count: sessionsForDay.length,
        minutes: totalMinutes
      });
    }
    
    return result;
  };
  
  // Export session data as CSV
  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ['Date', 'Time', 'Exercise', 'Duration (minutes)', 'Completed'];
      const rows = getRecentSessions(100).map(session => [
        format(new Date(session.date), 'yyyy-MM-dd'),
        format(new Date(session.timestamp), 'HH:mm:ss'),
        session.exerciseName,
        Math.round(session.duration / 60),
        session.completed ? 'Yes' : 'No'
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `mindflow_breathing_sessions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data');
    }
  };
  
  // Check if we have any sessions
  const hasNoSessions = recentSessions.length === 0;
  
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{getTotalCompletedSessions()}</div>
              <div className="text-sm text-muted-foreground ml-2">sessions</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{getCurrentStreak()}</div>
              <div className="text-sm text-muted-foreground ml-2">days</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{getTotalBreathingTime()}</div>
              <div className="text-sm text-muted-foreground ml-2">minutes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Favorite Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold line-clamp-1">
              {getMostPracticedExercise()?.name || 'None yet'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your breathing exercise history</CardDescription>
          </div>
          
          {!hasNoSessions && (
            <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {hasNoSessions ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Wind className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="text-lg font-medium mb-2">No sessions yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Complete your first breathing exercise session to start building your history.
                We'll track your progress and show trends over time.
              </p>
              {onStartSession && (
                <Button onClick={onStartSession}>
                  Start Your First Session
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {recentSessions.map((session) => {
                const sessionDate = new Date(session.date);
                const isToday = format(sessionDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                const displayDate = isToday
                  ? `Today at ${format(new Date(session.timestamp), 'h:mm a')}`
                  : format(sessionDate, 'MMMM d, yyyy - h:mm a');
                
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        session.completed 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {session.completed ? <Clock className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{session.exerciseName}</h4>
                        <p className="text-sm text-muted-foreground">{displayDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="inline-flex items-center bg-primary/10 px-2 py-1 rounded-full text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.round(session.duration / 60)} min
                        </span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(session.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tips for consistency */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Tips for Consistency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Same Time Daily</h3>
              <p className="text-sm text-muted-foreground">
                Choose a specific time each day for your breathing practice to build a sustainable habit.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Start Small</h3>
              <p className="text-sm text-muted-foreground">
                Begin with just 3-5 minutes daily and gradually increase your session duration.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Link to Existing Habits</h3>
              <p className="text-sm text-muted-foreground">
                Pair breathing exercises with something you already do daily, like brushing your teeth.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingHistory;