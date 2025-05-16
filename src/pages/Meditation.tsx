// src/pages/Meditation.tsx - Part 3 (Adding Types and Dummy Meditation Cards)
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MeditationPlayer from '@/components/meditation/MeditationPlayer';
import MeditationHistory from '@/components/meditation/MeditationHistory';
import { 
  BookOpen as Lotus, // Use BookOpen as replacement for Lotus
  Sun,
  Moon,
  Sparkles,
  Play,
  Clock,
  Heart,
  Check,
  ArrowRight
} from 'lucide-react';
// Types
interface MeditationTechnique {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Focus' | 'Relaxation' | 'Sleep' | 'Emotional Balance' | 'Energy' | 'Spiritual';
  coverImage: string;
  backgroundImage: string;
}

// Dummy data for development
const dummyTechniques: MeditationTechnique[] = [
  {
    id: "mindfulness-meditation",
    title: "Mindfulness Meditation",
    description: "Cultivate awareness of the present moment and observe thoughts without judgment.",
    duration: "15 min",
    level: "Beginner",
    category: "Focus",
    coverImage: "/images/meditation/mindfulness.jpg",
    backgroundImage: "/images/meditation/mindfulness.jpg",
  },
  {
    id: "loving-kindness",
    title: "Loving-Kindness Meditation",
    description: "Develop feelings of goodwill, kindness and warmth towards others.",
    duration: "20 min",
    level: "Intermediate",
    category: "Emotional Balance",
    coverImage: "/images/meditation/loving-kindness.jpg",
    backgroundImage: "/images/meditation/loving-kindness.jpg",
  },
  {
    id: "body-scan",
    title: "Body Scan Meditation",
    description: "Progressively relax and bring awareness to each part of your body.",
    duration: "25 min",
    level: "Beginner",
    category: "Relaxation",
    coverImage: "/images/meditation/body-scan.jpg",
    backgroundImage: "/images/meditation/body-scan.jpg",
  },
  {
    id: "zen-meditation",
    title: "Zen Meditation",
    description: "A traditional Buddhist practice focused on posture and breath awareness.",
    duration: "30 min",
    level: "Advanced",
    category: "Spiritual",
    coverImage: "/images/meditation/zen.jpg",
    backgroundImage: "/images/meditation/zen.jpg",
  },
  {
    id: "chakra-meditation",
    title: "Chakra Meditation",
    description: "Balance your energy centers from root to crown chakra.",
    duration: "20 min",
    level: "Intermediate",
    category: "Energy",
    coverImage: "/images/meditation/chakra.jpg",
    backgroundImage: "/images/meditation/chakra.jpg",
  },
  {
    id: "quick-relaxation",
    title: "5-Minute Stress Relief",
    description: "A quick meditation to reduce stress and center yourself during a busy day.",
    duration: "5 min",
    level: "Beginner",
    category: "Relaxation",
    coverImage: "/images/meditation/quick-relief.jpg",
    backgroundImage: "/images/meditation/quick-relief.jpg",
  }
];

const Meditation: React.FC = () => {
  // State variables
  const [currentView, setCurrentView] = useState<'techniques' | 'history'>('techniques');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedTechnique, setSelectedTechnique] = useState<MeditationTechnique | null>(null);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);
  
  
  // Get filtered techniques
  const getFilteredTechniques = () => {
    if (selectedFilter === 'all') return dummyTechniques;
    
    if (['Beginner', 'Intermediate', 'Advanced'].includes(selectedFilter)) {
      return dummyTechniques.filter(technique => technique.level === selectedFilter);
    }
    
    return dummyTechniques.filter(technique => technique.category === selectedFilter);
  };
  
  return (
    <div className="space-y-6">
      {/* Header with a more modern aesthetic */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0 bg-[url('/images/meditation/pattern.svg')] opacity-10 bg-repeat"></div>
        
        <div className="relative flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Lotus className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Meditation</h2>
            <p className="text-white/80 max-w-2xl">
              Explore various meditation techniques to cultivate mindfulness, reduce stress, and enhance your overall well-being
            </p>
          </div>
        </div>
      </div>
      
      {/* View selector */}
      <div className="bg-white rounded-full p-1 shadow-sm inline-flex">
        <Button 
          variant={currentView === 'techniques' ? 'default' : 'ghost'}
          className={`rounded-full ${currentView === 'techniques' ? 'bg-primary text-primary-foreground' : 'hover:bg-slate-100'}`}
          onClick={() => setCurrentView('techniques')}
        >
          Meditation Techniques
        </Button>
        <Button
          variant={currentView === 'history' ? 'default' : 'ghost'} 
          className={`rounded-full ${currentView === 'history' ? 'bg-primary text-primary-foreground' : 'hover:bg-slate-100'}`}
          onClick={() => setCurrentView('history')}
        >
          Your Practice
        </Button>
      </div>
      
      {/* Content based on current view */}
      {currentView === 'techniques' ? (
        <div className="space-y-8">
          {/* Filters with horizontal scroll for mobile */}
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2 scrollbar-hide">
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'all' ? 'bg-primary/10 border-primary/30 text-primary' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All Techniques
            </Button>
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'Beginner' ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
              onClick={() => setSelectedFilter('Beginner')}
            >
              <Sun className="mr-1 h-4 w-4" />
              Beginner
            </Button>
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'Intermediate' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
              onClick={() => setSelectedFilter('Intermediate')}
            >
              <Moon className="mr-1 h-4 w-4" />
              Intermediate
            </Button>
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'Advanced' ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}`}
              onClick={() => setSelectedFilter('Advanced')}
            >
              <Sparkles className="mr-1 h-4 w-4" />
              Advanced
            </Button>
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'Focus' ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}`}
              onClick={() => setSelectedFilter('Focus')}
            >
              Focus
            </Button>
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'Relaxation' ? 'bg-teal-50 border-teal-200 text-teal-700' : ''}`}
              onClick={() => setSelectedFilter('Relaxation')}
            >
              Relaxation
            </Button>
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'Emotional Balance' ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
              onClick={() => setSelectedFilter('Emotional Balance')}
            >
              Emotional Balance
            </Button>
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'Energy' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}`}
              onClick={() => setSelectedFilter('Energy')}
            >
              Energy
            </Button>
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'Sleep' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}`}
              onClick={() => setSelectedFilter('Sleep')}
            >
              Sleep
            </Button>
            <Button
              variant="outline"
              className={`shrink-0 ${selectedFilter === 'Spiritual' ? 'bg-violet-50 border-violet-200 text-violet-700' : ''}`}
              onClick={() => setSelectedFilter('Spiritual')}
            >
              Spiritual
            </Button>
          </div>
          
          {/* Meditation technique cards with modern design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTechniques().map((technique) => (
              <div 
                key={technique.id} 
                className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedTechnique(technique);
                  setIsSessionDialogOpen(true);
                }}
              >
                {/* Background image with overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                <img 
                  src={technique.coverImage} 
                  alt={technique.title} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Content positioned at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      className={`
                        ${technique.level === 'Beginner' ? 'bg-green-500' : 
                          technique.level === 'Intermediate' ? 'bg-blue-500' : 
                          'bg-purple-500'} text-white
                      `}
                    >
                      {technique.level}
                    </Badge>
                    <Badge className="bg-white/20 backdrop-blur text-white">
                      <Clock className="mr-1 h-3 w-3" />
                      {technique.duration}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-foreground transition-colors">
                    {technique.title}
                  </h3>
                  
                  <p className="text-white/80 text-sm mb-3 line-clamp-2">
                    {technique.description}
                  </p>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Meditation
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Inspirational quote section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/meditation/lotus-pattern.svg')] opacity-5"></div>
            <Lotus className="mx-auto h-10 w-10 text-purple-400 mb-4" />
            <blockquote className="text-xl italic text-gray-700 max-w-2xl mx-auto">
                "The quieter you become, the more you can hear."
            </blockquote>
            <cite className="text-sm text-gray-500 mt-2 block">— Ram Dass</cite>
            </div>
          
          {/* Benefits of meditation section */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Benefits of Regular Meditation</h3>
                <p className="text-gray-600 mb-6">
                    Meditation is a powerful practice with numerous scientifically proven benefits for your mental, 
                    emotional, and physical wellbeing.
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-medium">Reduces Stress and Anxiety</h4>
                        <p className="text-sm text-gray-500">
                        Regular meditation activates the body's relaxation response and reduces stress hormone levels.
                        </p>
                    </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <Check className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-medium">Improves Focus and Attention</h4>
                        <p className="text-sm text-gray-500">
                        Meditation strengthens your ability to concentrate and maintain attention for longer periods.
                        </p>
                    </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <Check className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <div>
                        <h4 className="font-medium">Promotes Emotional Health</h4>
                        <p className="text-sm text-gray-500">
                        Regular practice creates more positive emotions and reduces negative thinking patterns.
                        </p>
                    </div>
                    </div>
                </div>
                
                <Button className="mt-6 self-start">
                    Learn More About Benefits
                </Button>
                </div>
                
                <div className="relative h-full min-h-[300px] md:min-h-0">
                <img
                    src="/images/meditation/benefits.jpg"
                    alt="Person meditating peacefully"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                </div>
            </div>
            </div>
        </div>
        ) : (
        // Render the MeditationHistory component
        <MeditationHistory onStartSession={() => setCurrentView('techniques')} />
        )}
        
      
      {/* Technique detail dialog */}
        <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {selectedTechnique && (
            <div className="flex flex-col md:flex-row h-[80vh] md:h-[70vh]">
                {/* Left side - Technique image and details */}
                <div className="relative w-full md:w-1/2 h-1/3 md:h-full">
                <img 
                    src={selectedTechnique.backgroundImage} 
                    alt={selectedTechnique.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50"></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div>
                    <Badge className="bg-white/20 backdrop-blur mb-2">
                        {selectedTechnique.category}
                    </Badge>
                    <h2 className="text-2xl font-bold mb-2">{selectedTechnique.title}</h2>
                    <p className="text-white/90">{selectedTechnique.description}</p>
                    </div>
                    
                    <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-white/20 backdrop-blur">
                        <Clock className="mr-1 h-3 w-3" />
                        {selectedTechnique.duration}
                        </Badge>
                        <Badge className={`
                        ${selectedTechnique.level === 'Beginner' ? 'bg-green-500' : 
                            selectedTechnique.level === 'Intermediate' ? 'bg-blue-500' : 
                            'bg-purple-500'} text-white
                        `}>
                        {selectedTechnique.level}
                        </Badge>
                    </div>
                    
                   <Button 
                    className="w-full bg-white text-gray-800 hover:bg-white/90"
                    onClick={() => {
                      setIsSessionDialogOpen(false);
                      setIsPlayerDialogOpen(true); // Add this state to your Meditation component
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Begin Meditation
                  </Button>
                    </div>
                </div>
                </div>
                
                {/* Right side - Technique details */}
                <div className="w-full md:w-1/2 h-2/3 md:h-full bg-white p-6 overflow-y-auto">
                <div className="space-y-6">
                    {/* Benefits - placeholder for now, will connect to real data later */}
                    <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Heart className="mr-2 h-5 w-5 text-red-500" />
                        Benefits
                    </h3>
                    <ul className="space-y-2">
                        {["Improves focus", "Reduces stress", "Enhances wellbeing", "Promotes clarity"].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-gray-700">{benefit}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                    
                    {/* What to expect */}
                    <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Lotus className="mr-2 h-5 w-5 text-purple-500" />
                        What to Expect
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 mb-4">
                        This {selectedTechnique.duration} meditation will guide you through a series of steps to help you practice {selectedTechnique.title.toLowerCase()}.
                        </p>
                    </div>
                    </div>
                    
                    {/* Tips */}
                    <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                        Tips for Success
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3 text-amber-600" />
                        </div>
                        <span>Find a quiet space where you won't be disturbed.</span>
                        </li>
                        <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3 text-amber-600" />
                        </div>
                        <span>Wear comfortable clothing and remove distractions.</span>
                        </li>
                        <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3 text-amber-600" />
                        </div>
                        <span>Stay patient and gentle with yourself if your mind wanders.</span>
                        </li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>
            )}
        </DialogContent>
        </Dialog>
        {/* Meditation player dialog */}
          {selectedTechnique && (
            <MeditationPlayer 
              isOpen={isPlayerDialogOpen}
              setIsOpen={setIsPlayerDialogOpen}
              technique={selectedTechnique}
            />
          )}
    </div>
  );
};

export default Meditation;