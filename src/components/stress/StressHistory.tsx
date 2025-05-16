// src/components/stress/StressHistory.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { StressEntry, deleteStressEntry } from '@/lib/stress-storage';
import { toast } from '@/components/ui/sonner';
import { AlertTriangle, Download, Trash2 } from 'lucide-react';

interface StressHistoryProps {
  entries: StressEntry[];
  setEntries: React.Dispatch<React.SetStateAction<StressEntry[]>>;
  onSwitchToInput?: () => void;
}

const StressHistory: React.FC<StressHistoryProps> = ({ entries, setEntries, onSwitchToInput}) => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('day');
  
  // Prepare data based on timeframe
  const getFilteredData = () => {
    if (entries.length === 0) return [];
    
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;
    
    switch (timeframe) {
      case 'day':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      case 'all':
      default:
        // Find the earliest entry
        const dates = entries.map(entry => new Date(entry.date));
        startDate = new Date(Math.min(...dates.map(date => date.getTime())));
    }
    
    // Filter entries between start date and end date
    const filteredEntries = entries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
      })
      // Sort by date and time (oldest first)
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        // If timestamp exists, use it for more precise sorting
        if (a.timestamp && b.timestamp) {
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        }
        
        return dateA - dateB;
      });
      
    // For daily view, include time in the label
    if (timeframe === 'day') {
      return filteredEntries.map(entry => ({
        date: entry.timestamp 
          ? format(new Date(entry.timestamp), 'h:mm a')
          : format(new Date(entry.date), 'h:mm a'),
        level: entry.level,
        id: entry.id
      }));
    }
    
    // For other views, use date only
    return filteredEntries.map(entry => ({
      date: format(new Date(entry.date), 'MMM dd'),
      level: entry.level,
      id: entry.id
    }));
  };
  
  const chartData = getFilteredData();
  
  // Calculate average stress level
  const getAverageStress = () => {
    if (chartData.length === 0) return null;
    const sum = chartData.reduce((total, item) => total + item.level, 0);
    return (sum / chartData.length).toFixed(1);
  };
  
  // Count occurrences of each factor
  const getFactorCounts = () => {
    const counts: Record<string, number> = {};
    
    entries.forEach(entry => {
      entry.factors.forEach(factor => {
        counts[factor] = (counts[factor] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 factors
  };
  
  const factorsData = getFactorCounts();
  
  // Get the top stress factor
  const getTopFactor = () => {
    if (factorsData.length === 0) return null;
    return factorsData[0].name;
  };
  
  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      try {
        deleteStressEntry(id);
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
        toast.success('Entry deleted successfully');
      } catch (error) {
        toast.error('Failed to delete entry');
        console.error(error);
      }
    }
  };
  
  const handleExportData = () => {
    try {
      // Create CSV content
      const headers = ['Date', 'Time', 'Stress Level', 'Factors', 'Journal'];
      const rows = entries.map(entry => [
        format(new Date(entry.date), 'yyyy-MM-dd'),
        entry.timestamp ? format(new Date(entry.timestamp), 'HH:mm:ss') : '',
        entry.level,
        entry.factors.join(', '),
        `"${entry.journal.replace(/"/g, '""')}"`  // Escape quotes in journal text
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
      link.setAttribute('download', `mindflow_stress_data_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
      console.error(error);
    }
  };
  
  // Display no data message if needed
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">No data available</h3>
          <p className="text-muted-foreground mb-4">
            You haven't recorded any stress entries yet. Start tracking your stress levels to see insights here.
          </p>
          <Button onClick={onSwitchToInput} className="bg-primary hover:bg-primary/90">
            Record Your First Entry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="w-auto">
          <TabsList>
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button variant="outline" onClick={handleExportData} className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>
      
      <Card>
      <CardHeader>
        <CardTitle>Recent Entries</CardTitle>
        <CardDescription>
          Your recent stress records
        </CardDescription>
      </CardHeader>
      <CardContent>
      <div className="space-y-4">
        {entries
          .sort((a, b) => {
            // Sort by date first (newest first)
            const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
            
            // If same date but have timestamps, sort by timestamp (newest first)
            if (dateComparison === 0 && a.timestamp && b.timestamp) {
              return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
            
            return dateComparison;
          })
          .slice(0, 5)
          .map(entry => {
            const entryDate = new Date(entry.date);
            const isToday = format(entryDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            const displayDate = isToday && entry.timestamp
              ? `Today at ${format(new Date(entry.timestamp), 'h:mm a')}`
              : format(entryDate, 'MMMM d, yyyy');
            
            return (
              <div key={entry.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                      entry.level <= 3 
                        ? 'bg-green-100 text-green-700' 
                        : entry.level <= 6
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.level}
                    </div>
                    <h4 className="font-medium">{displayDate}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {entry.factors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.factors.map(factor => (
                      <span key={factor} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {factor}
                      </span>
                    ))}
                  </div>
                )}
                {entry.journal && (
                  <p className="text-sm text-gray-600 line-clamp-3">{entry.journal}</p>
                )}
              </div>
            );
          })}
      </div>
    </CardContent>
    </Card>
    
    {/* Stress Level Chart - Now second */}
    <Card>
      <CardHeader>
        <CardTitle>Stress Level Over Time</CardTitle>
        <CardDescription>
          Track how your stress levels have changed recently
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">
            No data available for the selected timeframe
          </p>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip 
                  formatter={(value, name) => [value, 'Stress Level']}
                  labelFormatter={(label) => `${timeframe === 'day' ? 'Time' : 'Date'}: ${label}`}
                />
                <defs>
                  <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(265, 75%, 75%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(265, 75%, 75%)" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="level" 
                  stroke="hsl(265, 75%, 75%)" 
                  fillOpacity={1} 
                  fill="url(#colorLevel)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
    
    {/* Insights and Factors - Now last */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Common Stress Factors</CardTitle>
          <CardDescription>
            Most frequent contributors to your stress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {factorsData.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              No factor data available
            </p>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={factorsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(160, 84%, 39%)" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Stress Insights</CardTitle>
          <CardDescription>
            Patterns and observations about your stress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-accent rounded-lg">
              <h3 className="font-medium mb-1">Average Stress Level</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-semibold">{getAverageStress() || '-'}</span>
                </div>
                <span className="text-muted-foreground">
                  {getAverageStress()
                    ? Number(getAverageStress()) <= 3
                      ? 'Low stress level - keep it up!'
                      : Number(getAverageStress()) <= 6
                      ? 'Moderate stress level'
                      : 'High stress level - take care'
                    : 'No data available'}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-accent rounded-lg">
              <h3 className="font-medium mb-1">Top Stressor</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-semibold">
                    {getTopFactor() ? getTopFactor().charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {getTopFactor()
                    ? `${getTopFactor()} appears most frequently`
                    : 'No data available'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
};

export default StressHistory;