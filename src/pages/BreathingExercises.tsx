// src/pages/BreathingExercises.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Wind, Play, Clock, Calendar, Heart, Brain, Info, Award, Check } from 'lucide-react';
import BreathingHistory from '../components/breathing/BreathingHistory';
import { useSearchParams, useLocation } from 'react-router-dom';
import { addBreathingSession, updateBreathingSession } from '@/lib/breathing-storage';



// Define breathing exercise type
interface BreathingExercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Relaxation' | 'Focus' | 'Energy' | 'Sleep';
  thumbnail: string;
  videoSrc: string;
  benefits: string[];
  instructions: string[];
}

// Sample breathing exercises data
const breathingExercises: BreathingExercise[] = [
  {
    id: "box-breathing",
    title: "Box Breathing",
    description: "A simple yet powerful technique to reduce stress and improve focus.",
    duration: "5 min",
    level: "Beginner",
    category: "Relaxation",
    thumbnail: "/images/breathing/box-breathing.jpg",
    videoSrc: "/videos/breathing/box-breathing.mp4",
    benefits: [
      "Reduces stress and anxiety",
      "Improves concentration",
      "Helps manage emotions",
      "Can be done anywhere"
    ],
    instructions: [
      "Sit in a comfortable position with your back straight",
      "Breathe in through your nose for 4 seconds",
      "Hold your breath for 4 seconds",
      "Exhale through your mouth for 4 seconds",
      "Hold your breath for 4 seconds",
      "Repeat for 5 minutes or until calm"
    ]
  },
  {
    id: "4-7-8-breathing",
    title: "4-7-8 Breathing",
    description: "A tranquilizing breath that helps reduce anxiety and fall asleep.",
    duration: "8 min",
    level: "Beginner",
    category: "Sleep",
    thumbnail: "/images/breathing/4-7-8-breathing.jpg",
    videoSrc: "/videos/breathing/4-7-8-breathing.mp4",
    benefits: [
      "Helps you fall asleep faster",
      "Reduces anxiety",
      "Manages cravings and impulses",
      "Decreases stress"
    ],
    instructions: [
      "Sit or lie in a comfortable position",
      "Place the tip of your tongue against the roof of your mouth, behind your front teeth",
      "Exhale completely through your mouth",
      "Close your mouth and inhale through your nose for 4 seconds",
      "Hold your breath for 7 seconds",
      "Exhale completely through your mouth for 8 seconds",
      "Repeat for 4 cycles"
    ]
  },
  {
    id: "diaphragmatic-breathing",
    title: "Diaphragmatic Breathing",
    description: "Deep belly breathing that activates the parasympathetic nervous system.",
    duration: "10 min",
    level: "Intermediate",
    category: "Relaxation",
    thumbnail: "/images/breathing/diaphragmatic-breathing.jpg",
    videoSrc: "/videos/breathing/diaphragmatic-breathing.mp4",
    benefits: [
      "Reduces stress",
      "Lowers heart rate",
      "Lowers blood pressure",
      "Improves core muscle stability"
    ],
    instructions: [
      "Lie on your back with knees bent or sit comfortably",
      "Place one hand on your chest and the other on your abdomen",
      "Breathe in slowly through your nose, feeling your abdomen rise",
      "Keep your chest relatively still",
      "Exhale slowly through pursed lips",
      "Repeat for 5-10 minutes"
    ]
  },
  {
    id: "alternate-nostril",
    title: "Alternate Nostril Breathing",
    description: "Balances your nervous system and improves focus.",
    duration: "7 min",
    level: "Intermediate",
    category: "Focus",
    thumbnail: "/images/breathing/alternate-nostril.jpg",
    videoSrc: "/videos/breathing/alternate-nostril.mp4",
    benefits: [
      "Improves focus and attention",
      "Balances the nervous system",
      "Reduces stress and anxiety",
      "Promotes mental clarity"
    ],
    instructions: [
      "Sit comfortably with your back straight",
      "Rest your left hand on your lap",
      "Place your right thumb against your right nostril",
      "Inhale through your left nostril",
      "Close your left nostril with your ring finger",
      "Open your right nostril and exhale",
      "Inhale through your right nostril",
      "Close your right nostril and exhale through your left",
      "Continue alternating for 5-7 minutes"
    ]
  },
  {
    id: "energizing-breath",
    title: "Energizing Breath",
    description: "Revitalizing breathing technique to boost energy and alertness.",
    duration: "3 min",
    level: "Beginner",
    category: "Energy",
    thumbnail: "/images/breathing/energizing-breath.jpg",
    videoSrc: "/videos/breathing/energizing-breath.mp4",
    benefits: [
      "Increases energy and alertness",
      "Improves focus",
      "Decreases feelings of sluggishness",
      "Prepares mind for challenging tasks"
    ],
    instructions: [
      "Sit comfortably with your back straight",
      "Take a quick, strong inhale through your nose",
      "Immediately exhale forcefully through your nose",
      "Continue rapid breathing for 10-15 seconds",
      "Rest and breathe normally for 15 seconds",
      "Repeat for 2-3 minutes"
    ]
  },
  {
    id: "relaxing-breath",
    title: "Relaxing Breath",
    description: "Calming technique to prepare for meditation or sleep.",
    duration: "12 min",
    level: "Advanced",
    category: "Sleep",
    thumbnail: "/images/breathing/relaxing-breath.jpg",
    videoSrc: "/videos/breathing/relaxing-breath.mp4",
    benefits: [
      "Promotes deep relaxation",
      "Prepares mind for meditation",
      "Helps with insomnia",
      "Reduces racing thoughts"
    ],
    instructions: [
      "Lie down or sit in a comfortable position",
      "Close your eyes and relax your body",
      "Breathe deeply through your nose, filling your abdomen",
      "Exhale slowly, making your exhale longer than your inhale",
      "Focus on the sound of your breath",
      "Continue for 10-15 minutes"
    ]
  }
];

const BreathingExercises: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentView, setCurrentView] = useState<'exercises' | 'history'>('exercises');
  const [sessionInProgress, setSessionInProgress] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const closeDialogRef = useRef<() => void>(() => {});
  const phaseSequenceRef = useRef<string[]>([]);


  const startGuidedBreathing = () => {
    if (!selectedExercise) return;
    
    // Set up the initial state
    setBreathingPhase('inhale');
    setCycleCount(0);
    
    // Define breathing patterns for each exercise type
    const startGuidedBreathing = () => {
      if (!selectedExercise) return;
      
      // Reset states
      setBreathingPhase('inhale');
      setCycleCount(0);
      setPhaseIndex(0);
      
      // Define breathing patterns for each exercise type
      const breathingPatterns = {
        "box-breathing": {
          phases: ['inhale', 'hold', 'exhale', 'rest'],
          durations: {
            inhale: 4,
            hold: 4,
            exhale: 4,
            rest: 4
          },
          totalCycles: 5
        },
        "4-7-8-breathing": {
          phases: ['inhale', 'hold', 'exhale'],
          durations: {
            inhale: 4,
            hold: 7,
            exhale: 8
          },
          totalCycles: 4
        },
        "diaphragmatic-breathing": {
          phases: ['inhale', 'exhale', 'rest'],
          durations: {
            inhale: 4,
            exhale: 6,
            rest: 1
          },
          totalCycles: 6
        },
        "alternate-nostril": {
          phases: ['inhale', 'hold', 'exhale'],
          durations: {
            inhale: 4,
            hold: 2,
            exhale: 4
          },
          totalCycles: 6
        },
        "energizing-breath": {
          phases: ['inhale', 'exhale'],
          durations: {
            inhale: 1,
            exhale: 1
          },
          totalCycles: 10
        },
        "relaxing-breath": {
          phases: ['inhale', 'exhale', 'rest'],
          durations: {
            inhale: 4,
            exhale: 6,
            rest: 1
          },
          totalCycles: 6
        }
      };
      
      // Get the pattern for the selected exercise (default to box breathing if not found)
      const pattern = breathingPatterns[selectedExercise.id] || breathingPatterns["box-breathing"];
      
      // Store phase sequence
      phaseSequenceRef.current = pattern.phases;
      
      // Start with the first phase
      setBreathingPhase(pattern.phases[0] as any);
      setSecondsLeft(pattern.durations[pattern.phases[0]]);
      
      // Start the timer to guide through the breathing cycle
      const runTimer = () => {
        timerRef.current = setInterval(() => {
          setSecondsLeft(prev => {
            if (prev <= 1) {
              // Move to next phase
              setPhaseIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % pattern.phases.length;
                const nextPhase = pattern.phases[nextIndex] as 'inhale' | 'hold' | 'exhale' | 'rest';
                
                // If we've completed a full cycle (back to inhale)
                if (nextIndex === 0) {
                  setCycleCount(prevCycle => {
                    const nextCycle = prevCycle + 1;
                    
                    // If we've completed all cycles
                    if (nextCycle >= pattern.totalCycles) {
                      clearInterval(timerRef.current!);
                      // Add a slight delay before completing the session
                      setTimeout(() => {
                        completeSession();
                      }, 500);
                    }
                    
                    return nextCycle;
                  });
                }
                
                setBreathingPhase(nextPhase);
                return nextIndex;
              });
              
              // Set duration for next phase
              const nextPhaseIndex = (phaseIndex + 1) % pattern.phases.length;
              const nextPhase = pattern.phases[nextPhaseIndex];
              return pattern.durations[nextPhase];
            }
            return prev - 1;
          });
        }, 1000);
      };
      
      runTimer();
      
      // Start the session now (this will start tracking time)
      startSession();
      
    };
    startGuidedBreathing();
  };
  


   // Load saved video progress on component mount
   useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('mindflow_video_progress');
      if (savedProgress) {
        setVideoProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading video progress:', error);
    }
  }, []);
  
  // Update document title and manage active session
  useEffect(() => {
    if (sessionInProgress && selectedExercise) {
      document.title = `Breathing - ${selectedExercise.title} in progress`;
      
      return () => {
        document.title = 'Mindflow - Breathing Exercises';
      };
    }
  }, [sessionInProgress, selectedExercise]);

  useEffect(() => {
    const exerciseId = searchParams.get('exercise');
    if (exerciseId) {
      // Find the exercise by ID
      const exercise = breathingExercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        // Switch to exercises view in case we're in history view
        setCurrentView('exercises');
        
        // Automatically select and open this exercise
        setSelectedExercise(exercise);
        setIsDialogOpen(true);
        
        // Clear the URL parameter to avoid reopening on page refresh
        window.history.replaceState({}, document.title, location.pathname);
      }
    }
  }, [searchParams, location.pathname, breathingExercises, setCurrentView, setSelectedExercise, setIsDialogOpen]);
  

  
  // Function to filter exercises based on active tab
  const getFilteredExercises = () => {
    if (activeTab === "all") return breathingExercises;
    return breathingExercises.filter(exercise => 
      activeTab === "beginner" ? exercise.level === "Beginner" :
      activeTab === "intermediate" ? exercise.level === "Intermediate" :
      activeTab === "advanced" ? exercise.level === "Advanced" :
      activeTab === "relaxation" ? exercise.category === "Relaxation" :
      activeTab === "focus" ? exercise.category === "Focus" :
      activeTab === "energy" ? exercise.category === "Energy" :
      activeTab === "sleep" ? exercise.category === "Sleep" :
      true
    );
  };
  
  // Handle exercise selection and dialog opening
  const handleExerciseSelect = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setIsDialogOpen(true);
    setSessionCompleted(false);
  };

  // Start a session
  const startSession = () => {
    if (!selectedExercise) return;
    
    setSessionInProgress(selectedExercise.id);
    setSessionStartTime(new Date());
    
    // Create a session record with completed=false initially
    const now = new Date();
    addBreathingSession({
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.title,
      date: now.toISOString().split('T')[0],
      timestamp: now.toISOString(),
      duration: 0, // Will be updated when completed
      completed: false
    });
  };
  
  // Complete a session and close the dialog
  const completeSession = () => {
    if (!selectedExercise || !sessionStartTime) return;
    
    // Clear the timer if it exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const now = new Date();
    const durationInSeconds = Math.round((now.getTime() - sessionStartTime.getTime()) / 1000);
    
    // Get the estimated duration in minutes from the exercise
    const estimatedMinutes = parseInt(selectedExercise.duration.split(' ')[0]);
    
    // Use either the actual time or estimated time, whichever is greater
    const finalDuration = Math.max(durationInSeconds, estimatedMinutes * 60);
    
    // Update the session in storage
    const recentSessions = require('@/lib/breathing-storage').getRecentSessions(1);
    if (recentSessions.length > 0) {
      const session = recentSessions[0];
      updateBreathingSession({
        ...session,
        duration: finalDuration,
        completed: true
      });
    }
    
    // Clean up states
    setSessionCompleted(false);
    setSessionInProgress(null);
    setSessionStartTime(null);
    
    // Reset breathing state
    setBreathingPhase('inhale');
    setCycleCount(0);
    setSecondsLeft(0);
    
    // IMPORTANT: Close the dialog immediately
    setIsDialogOpen(false);
  };


  // Get badge color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Relaxation': 
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Focus': 
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'Energy': 
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'Sleep': 
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      default: 
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  // Add this function
  const handleCompleteAndClose = () => {
    // Run the complete session logic
    if (selectedExercise && sessionStartTime) {
      const now = new Date();
      const durationInSeconds = Math.round((now.getTime() - sessionStartTime.getTime()) / 1000);
      const estimatedMinutes = parseInt(selectedExercise.duration.split(' ')[0]);
      const finalDuration = Math.max(durationInSeconds, estimatedMinutes * 60);
      
      // Update session
      const recentSessions = require('@/lib/breathing-storage').getRecentSessions(1);
      if (recentSessions.length > 0) {
        const session = recentSessions[0];
        updateBreathingSession({
          ...session,
          duration: finalDuration,
          completed: true
        });
      }
    }
    
    // Reset all state variables
    setSessionCompleted(false);
    setSessionInProgress(null);
    setSessionStartTime(null);
    
    // Force close dialog
    setIsDialogOpen(false);
  };

  // Get badge color based on level
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': 
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Intermediate': 
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'Advanced': 
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 shadow-lg overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Wind className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Breathing Exercises</h2>
            <p className="text-white/80 max-w-2xl">Discover techniques to reduce stress and enhance wellbeing</p>
          </div>
        </div>
      </div>
      
      {/* View selector tabs - similar to Stress Tracker */}
      <div>
        <div className="flex space-x-2">
          <Button
            variant={currentView === 'exercises' ? 'default' : 'outline'}
            onClick={() => setCurrentView('exercises')}
          >
            View Exercises
          </Button>
          <Button
            variant={currentView === 'history' ? 'default' : 'outline'}
            onClick={() => setCurrentView('history')}
          >
            View History
          </Button>
          <div className="flex-grow"></div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
      
      {/* Content based on current view */}
      {currentView === 'exercises' ? (
        <div className="space-y-6">
          {/* Filter Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap gap-2 bg-transparent h-auto p-0 mb-6">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 h-9"
              >
                All Exercises
              </TabsTrigger>
              
              <TabsTrigger 
                value="beginner"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-full px-4 h-9"
              >
                Beginner
              </TabsTrigger>
              
              <TabsTrigger 
                value="intermediate"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-full px-4 h-9"
              >
                Intermediate
              </TabsTrigger>
              
              <TabsTrigger 
                value="advanced"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-full px-4 h-9"
              >
                Advanced
              </TabsTrigger>
              
              <TabsTrigger 
                value="relaxation"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-full px-4 h-9"
              >
                Relaxation
              </TabsTrigger>
              
              <TabsTrigger 
                value="focus"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-full px-4 h-9"
              >
                Focus
              </TabsTrigger>
              
              <TabsTrigger 
                value="energy"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-full px-4 h-9"
              >
                Energy
              </TabsTrigger>
              
              <TabsTrigger 
                value="sleep"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-full px-4 h-9"
              >
                Sleep
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredExercises().map((exercise) => (
                  <Card key={exercise.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="relative">
                      {/* Thumbnail image */}
                      <img 
                        src={exercise.thumbnail} 
                        alt={exercise.title} 
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Play button overlay */}
                      <button 
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        onClick={() => handleExerciseSelect(exercise)}
                      >
                        <div className="h-16 w-16 rounded-full bg-white/80 flex items-center justify-center">
                          <Play className="h-8 w-8 text-primary ml-1" />
                        </div>
                      </button>
                      
                      {/* Duration badge */}
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {exercise.duration}
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex gap-2 mb-2">
                        <Badge className={getLevelColor(exercise.level)} variant="outline">
                          {exercise.level}
                        </Badge>
                        <Badge className={getCategoryColor(exercise.category)} variant="outline">
                          {exercise.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{exercise.title}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    
                    <CardFooter>
                      <Button 
                        onClick={() => handleExerciseSelect(exercise)}
                        className="w-full gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Start Exercise
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {/* Empty state if no exercises match the filter */}
              {getFilteredExercises().length === 0 && (
                <div className="text-center py-12">
                  <Wind className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No exercises found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    No breathing exercises match your current filter. Try selecting a different category or level.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Additional information card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Why Breathing Exercises Matter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Breathing exercises are powerful tools for managing stress and improving mental health. 
                Controlled breathing activates your parasympathetic nervous system, which helps counter 
                the fight-or-flight response and reduces stress hormones in your body.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg">
                  <Heart className="h-8 w-8 text-red-500 mb-2" />
                  <h3 className="font-medium mb-1">Physical Benefits</h3>
                  <p className="text-sm text-muted-foreground">
                    Lowers blood pressure, reduces heart rate, improves immune function
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg">
                  <Brain className="h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="font-medium mb-1">Mental Benefits</h3>
                  <p className="text-sm text-muted-foreground">
                    Reduces anxiety, improves focus, enhances emotional regulation
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="font-medium mb-1">Long-term Benefits</h3>
                  <p className="text-sm text-muted-foreground">
                    Builds resilience to stress, improves sleep quality, increases mindfulness
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // History view
        <BreathingHistory onStartSession={() => setCurrentView('exercises')} />
      )}
      
     {/* Exercise Video Dialog */}
     <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          // If dialog is closing, capture the function that closes it
          if (!open) {
            closeDialogRef.current = () => setIsDialogOpen(false);
            
            // Reset states when dialog closes
            setSessionCompleted(false);
            setSessionInProgress(null);
            setSessionStartTime(null);
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
          }
          
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-4xl w-full" forceMount>
          {selectedExercise && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedExercise.title}</DialogTitle>
                <DialogDescription>
                  {selectedExercise.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                {/* Video player */}
                <div className="w-full aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                  {sessionInProgress ? (
                    // Guided breathing UI
                    <div className="bg-gray-900 w-full h-full flex items-center justify-center">
                    {/* Purple dot indicator */}
                    <div className="absolute top-4 right-4">
                      <div className="h-4 w-4 rounded-full bg-purple-500 animate-pulse"></div>
                    </div>
                    
                    {/* Define breathing patterns for each exercise type */}
                    {(() => {
                      const breathingPatterns = {
                        "box-breathing": {
                          totalCycles: 5,
                          instructions: {
                            inhale: 'Breathe in through your nose',
                            hold: 'Hold your breath',
                            exhale: 'Breathe out through your mouth',
                            rest: 'Hold your breath'
                          }
                        },
                        "4-7-8-breathing": {
                          totalCycles: 4,
                          instructions: {
                            inhale: 'Breathe in through your nose',
                            hold: 'Hold your breath',
                            exhale: 'Breathe out through your mouth'
                          }
                        },
                        "diaphragmatic-breathing": {
                          totalCycles: 6,
                          instructions: {
                            inhale: 'Breathe in through your nose, fill your belly',
                            exhale: 'Breathe out slowly through pursed lips',
                            rest: 'Pause briefly'
                          }
                        },
                        "alternate-nostril": {
                          totalCycles: 6,
                          instructions: {
                            inhale: 'Breathe in through left nostril',
                            hold: 'Hold your breath',
                            exhale: 'Breathe out through right nostril'
                          }
                        },
                        "energizing-breath": {
                          totalCycles: 10,
                          instructions: {
                            inhale: 'Quick, strong inhale through your nose',
                            exhale: 'Quick, forceful exhale through your nose'
                          }
                        },
                        "relaxing-breath": {
                          totalCycles: 6,
                          instructions: {
                            inhale: 'Breathe in deeply through your nose',
                            exhale: 'Long, slow exhale through your mouth',
                            rest: 'Pause briefly'
                          }
                        }
                      };
                      
                      // Get the pattern for the selected exercise
                      const pattern = selectedExercise ? 
                        breathingPatterns[selectedExercise.id] || breathingPatterns["box-breathing"] : 
                        breathingPatterns["box-breathing"];
                        
                      return (
                        <>
                          {/* Progress indicator */}
                          <div className="absolute top-6 left-0 w-full px-6">
                            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                              {(() => {
                                // Get total cycles for this exercise
                                const totalCycles = 
                                  selectedExercise?.id === "box-breathing" ? 5 :
                                  selectedExercise?.id === "4-7-8-breathing" ? 4 :
                                  selectedExercise?.id === "energizing-breath" ? 10 : 6;
                                  
                                // Calculate progress percentage
                                const progressPercentage = totalCycles > 0 ? (cycleCount / totalCycles) * 100 : 0;
                                
                                return (
                                  <div 
                                    className="h-full bg-primary transition-all duration-500 ease-linear" 
                                    style={{ width: `${progressPercentage}%` }}
                                  ></div>
                                );
                              })()}
                            </div>
                            
                            <div className="flex justify-between text-white/70 text-xs mt-1">
                              <span>
                                Cycle {cycleCount + 1} of {
                                  selectedExercise?.id === "box-breathing" ? 5 :
                                  selectedExercise?.id === "4-7-8-breathing" ? 4 :
                                  selectedExercise?.id === "energizing-breath" ? 10 : 6
                                }
                              </span>
                              
                              <span>
                                {(() => {
                                  // Calculate elapsed time
                                  if (!sessionStartTime) return "0:00";
                                  const elapsedMs = new Date().getTime() - sessionStartTime.getTime();
                                  const elapsedSeconds = Math.floor(elapsedMs / 1000);
                                  const minutes = Math.floor(elapsedSeconds / 60);
                                  const seconds = elapsedSeconds % 60;
                                  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                })()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-center space-y-8">
                            {/* Breathing circle that expands/contracts */}
                            <div 
                              className={`h-40 w-40 rounded-full flex items-center justify-center mx-auto transition-all duration-1000 ${
                                breathingPhase === 'inhale' ? 'bg-primary/20 scale-100 animate-[expand_4s_ease-in-out]' : 
                                breathingPhase === 'hold' ? 'bg-primary/30 scale-110' : 
                                breathingPhase === 'exhale' ? 'bg-primary/20 scale-90 animate-[contract_8s_ease-in-out]' : 
                                'bg-primary/10 scale-90'
                              }`}
                            >
                              <span className="text-white text-5xl font-bold">{secondsLeft}</span>
                            </div>
                            
                            {/* Instruction text */}
                            <div>
                              <p className="text-white text-2xl font-medium mb-2">
                                {breathingPhase.charAt(0).toUpperCase() + breathingPhase.slice(1)}
                              </p>
                              <p className="text-white/70 text-lg">
                                {pattern.instructions[breathingPhase] || ''}
                              </p>
                            </div>
                            
                            {/* Manual complete button - with multiple closing approaches */}
                            <DialogClose asChild>
                              <Button 
                                className="bg-white/20 hover:bg-white/30 text-white"
                                onClick={() => {
                                  // Put all your session completion logic here
                                  if (selectedExercise && sessionStartTime) {
                                    // Clear any timers
                                    if (timerRef.current) {
                                      clearInterval(timerRef.current);
                                      timerRef.current = null;
                                    }
                                    
                                    const now = new Date();
                                    // Rest of your session completion logic
                                    // ...
                                  }
                                  
                                  // Reset all states
                                  setSessionCompleted(false);
                                  setSessionInProgress(null);
                                  setSessionStartTime(null);
                                  setBreathingPhase('inhale');
                                  setCycleCount(0);
                                  setSecondsLeft(0);
                                }}
                              >
                                End Exercise
                              </Button>
                            </DialogClose>
                      </div>
                      </>
                      );
                    })()}
                  </div>
                  ) : (
                    <>
                      {/* Your existing video player code */}
                      <video
                        ref={videoRef}
                        src={selectedExercise.videoSrc}
                        poster={selectedExercise.thumbnail}
                        controls
                        className="w-full h-full object-cover"
                        onTimeUpdate={() => {
                          if (videoRef.current && selectedExercise) {
                            const currentTime = videoRef.current.currentTime;
                            // Only save progress if we've watched at least 5 seconds
                            if (currentTime > 5) {
                              const newProgress = {
                                ...videoProgress,
                                [selectedExercise.id]: currentTime
                              };
                              setVideoProgress(newProgress);
                              localStorage.setItem('mindflow_video_progress', JSON.stringify(newProgress));
                            }
                          }
                        }}
                        onLoadedMetadata={() => {
                          if (videoRef.current && selectedExercise && videoProgress[selectedExercise.id]) {
                            // Set the video to start from the saved position
                            const savedTime = videoProgress[selectedExercise.id];
                            // Only restore if we haven't watched the whole thing
                            if (videoRef.current.duration && savedTime < videoRef.current.duration - 10) {
                              videoRef.current.currentTime = savedTime;
                            }
                          }
                        }}
                        onError={(e) => {
                          // Fallback if video fails to load
                          const target = e.target as HTMLVideoElement;
                          target.style.display = 'none';
                          document.getElementById('video-fallback')?.classList.remove('hidden');
                        }}
                      />
                      
                      {/* Fallback for when video isn't available */}
                      <div 
                        id="video-fallback" 
                        className="hidden absolute inset-0 flex items-center justify-center bg-black/40"
                      >
                        <div className="text-center space-y-4">
                          <div className="h-20 w-20 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-4">
                            <Play className="h-10 w-10 text-primary ml-1" />
                          </div>
                          <p className="text-white">Video demonstration coming soon</p>
                        </div>
                      </div>

                      {/* Begin exercise button - now calls startGuidedBreathing */}
                      <Button 
                        onClick={startGuidedBreathing}
                        className="absolute bottom-4 right-4 bg-primary hover:bg-primary/90 shadow-lg"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Begin Exercise
                      </Button>
                    </>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Benefits */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Benefits
                    </h3>
                    <ul className="space-y-2">
                      {selectedExercise.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <span className="text-primary text-xs">✓</span>
                          </div>
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Instructions */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      Instructions
                    </h3>
                    <ol className="space-y-2 list-decimal list-inside">
                      {selectedExercise.instructions.map((instruction, index) => (
                        <li key={index} className="text-sm pl-1">
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg mt-6">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">Pro Tip</h4>
                      <p className="text-sm text-muted-foreground">
                        Consistency is key with breathing exercises. Even 5 minutes daily can significantly 
                        reduce stress levels and improve your overall wellbeing over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
        </Dialog>
    </div>
  );
};


export default BreathingExercises;