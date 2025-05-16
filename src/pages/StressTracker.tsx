// src/pages/StressTracker.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import StressInput from '../components/stress/StressInput'; 
import StressFactors from '../components/stress/StressFactors';
import StressJournal from '../components/stress/StressJournal';
import StressHistory from '../components/stress/StressHistory';
import { Check, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { addStressEntry, getStressEntries, StressEntry } from '@/lib/stress-storage';

const StressTracker = () => {
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [stressFactors, setStressFactors] = useState<string[]>([]);
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [activeTab, setActiveTab] = useState('input');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<StressEntry[]>([]);
  const [entriesForSelectedDate, setEntriesForSelectedDate] = useState<StressEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to switch to input tab
  const switchToInputTab = () => {
    setActiveTab('input');
  };
  
  // Load entries from localStorage
  useEffect(() => {
    // Using async/await with an IIFE (Immediately Invoked Function Expression)
    (async () => {
      try {
        setLoading(true);
        // Get entries asynchronously
        const loadedEntries = await getStressEntries();
        // Make sure it's always an array
        const entriesArray = Array.isArray(loadedEntries) ? loadedEntries : [];
        setEntries(entriesArray);
      } catch (error) {
        console.error("Error loading stress entries:", error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  
  // Check for entries on the selected date
  useEffect(() => {
    if (!entries || entries.length === 0) {
      setEntriesForSelectedDate([]);
      return;
    }
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const existingEntries = entries.filter(entry => {
      if (!entry || !entry.date) return false;
      const entryDate = new Date(entry.date);
      return format(entryDate, 'yyyy-MM-dd') === dateString;
    });
    
    setEntriesForSelectedDate(existingEntries);
    
    // Reset form for new entry
    setStressLevel(5);
    setStressFactors([]);
    setJournalEntry('');
  }, [selectedDate, entries]);

  const handleSaveEntry = async () => {
    try {
      const dateString = selectedDate.toISOString();
      
      // Create timestamp that matches the selected date (not always current time)
      // Get current time components
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      // Create a new date from selectedDate but with current time
      const timestampDate = new Date(selectedDate);
      timestampDate.setHours(hours);
      timestampDate.setMinutes(minutes);
      timestampDate.setSeconds(seconds);
      
      // Create new entry with timestamp
      const newEntry = {
        date: dateString,
        level: stressLevel,
        factors: stressFactors,
        journal: journalEntry,
        timestamp: timestampDate.toISOString(), // Use timestamp that matches selected date
      };
      
      // Save to localStorage/API
      const savedEntry = await addStressEntry(newEntry);
      
      // Add the new entry to the array (don't replace existing ones)
      setEntries(prevEntries => [...prevEntries, savedEntry]);
      
      toast.success('Your stress entry has been saved');
      
      // Reset form for a new entry
      setStressLevel(5);
      setStressFactors([]);
      setJournalEntry('');
      
      // Optionally switch to history tab
      setActiveTab('history');
    } catch (error) {
      toast.error('Failed to save entry. Please try again.');
      console.error(error);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="input">Record Stress</TabsTrigger>
            <TabsTrigger value="history">View History</TabsTrigger>
          </TabsList>
          
          {activeTab === 'input' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(selectedDate, 'MMM dd, yyyy')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  disabled={{ after: new Date() }}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        <TabsContent value="input" className="space-y-6">
          {entriesForSelectedDate.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-medium text-blue-800">
                You have {entriesForSelectedDate.length} {entriesForSelectedDate.length === 1 ? 'entry' : 'entries'} for {format(selectedDate, 'MMMM d, yyyy')}
              </p>
              <p className="text-sm text-blue-700">
                You can add another entry to track how your stress changes throughout the day.
              </p>
            </div>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <span className="text-primary font-semibold">1</span>
                </div>
                How are you feeling {format(selectedDate, 'MMM d') === format(new Date(), 'MMM d') 
                  ? 'right now' 
                  : `on ${format(selectedDate, 'MMMM d')}`}?
              </CardTitle>
              <CardDescription>
                Move the slider to indicate your stress level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StressInput value={stressLevel} onChange={setStressLevel} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <span className="text-primary font-semibold">2</span>
                </div>
                What's contributing to your stress?
              </CardTitle>
              <CardDescription>
                Select all factors that apply
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StressFactors selected={stressFactors} onSelect={setStressFactors} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <span className="text-primary font-semibold">3</span>
                </div>
                Journal Entry (Optional)
              </CardTitle>
              <CardDescription>
                Add notes about how you're feeling or what happened
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StressJournal value={journalEntry} onChange={setJournalEntry} />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveEntry} className="bg-primary hover:bg-primary/90">
                <Check className="mr-2 h-4 w-4" /> Save Entry
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading stress history...</p>
            </div>
          ) : (
            <StressHistory 
              entries={entries} 
              setEntries={setEntries} 
              onSwitchToInput={switchToInputTab} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StressTracker;