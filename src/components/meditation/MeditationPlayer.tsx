import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { saveCompletedSession } from '@/lib/meditation-storage';
import { 
  SkipForward, 
  Play, 
  Pause, 
  Volume2, 
  Music,
  Check, 
  BookOpen as Lotus,
  ArrowLeft, 
  ArrowRight,
} from 'lucide-react';

// Using the type from your Meditation.tsx file
interface MeditationStep {
  title: string;
  description: string;
  duration: number; // in seconds
  image: string;
  instruction: string;
}

interface MeditationMusic {
  title: string;
  artist: string;
  coverArt: string;
  audioSrc: string;
}

interface MeditationTechnique {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Focus' | 'Relaxation' | 'Sleep' | 'Emotional Balance' | 'Energy' | 'Spiritual';
  coverImage: string;
  backgroundImage: string;
  steps?: MeditationStep[];
  recommendedMusic?: MeditationMusic[];
}

interface MeditationPlayerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  technique: MeditationTechnique;
}

const MeditationPlayer: React.FC<MeditationPlayerProps> = ({ isOpen, setIsOpen, technique }) => {
  // Session state
  const [sessionInProgress, setSessionInProgress] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepTimeLeft, setStepTimeLeft] = useState(0);
  const [totalSessionProgress, setTotalSessionProgress] = useState(0);
  
  // Music player state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<MeditationMusic | null>(null);
  const [volume, setVolume] = useState(70);
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Get steps based on technique id
  const getTechniqueSteps = (): MeditationStep[] => {
    // If technique already has steps, use those
    if (technique.steps && technique.steps.length > 0) {
      return technique.steps;
    }
    
    // Otherwise, provide default steps based on technique type
    switch (technique.id) {
      case 'mindfulness-meditation':
        return [
          {
            title: "Find a Comfortable Position",
            description: "Sit in a comfortable position with your back straight but not stiff.",
            duration: 60, // 1 minute
            image: "/images/meditation/sitting-position.jpg",
            instruction: "Sit comfortably with your back straight. Relax your shoulders and place your hands on your knees or lap."
          },
          {
            title: "Focus on Your Breath",
            description: "Close your eyes and start focusing on your natural breathing pattern.",
            duration: 120, // 2 minutes
            image: "/images/meditation/breath-focus.jpg",
            instruction: "Gently close your eyes. Bring awareness to the sensation of breath entering and leaving your body. Notice the rising and falling of your chest and abdomen."
          },
          {
            title: "Notice Wandering Thoughts",
            description: "When your mind wanders, gently bring your attention back to your breath.",
            duration: 180, // 3 minutes
            image: "/images/meditation/wandering-thoughts.jpg",
            instruction: "As thoughts arise, acknowledge them without judgment, then gently return your focus to your breathing. This is normal and part of the practice."
          },
          {
            title: "Body Scan",
            description: "Bring awareness to different parts of your body, noticing any sensations.",
            duration: 240, // 4 minutes
            image: "/images/meditation/body-scan.jpg",
            instruction: "Gradually move your attention from your toes to the top of your head, noticing any sensations, tension, or comfort in each area."
          },
          {
            title: "Open Awareness",
            description: "Expand your awareness to include sounds, sensations, and thoughts.",
            duration: 180, // 3 minutes
            image: "/images/meditation/open-awareness.jpg",
            instruction: "Broaden your attention to include all sensations, sounds, and thoughts. Observe them coming and going without getting caught up in any particular one."
          }
        ];
        
      case 'loving-kindness':
        return [
          {
            title: "Comfortable Position",
            description: "Find a comfortable seated position with your eyes closed.",
            duration: 60,
            image: "/images/meditation/sitting-position.jpg",
            instruction: "Sit in a comfortable position with your back straight. Gently close your eyes and take a few deep breaths to center yourself."
          },
          {
            title: "Self-Kindness",
            description: "Begin by directing loving-kindness towards yourself.",
            duration: 180,
            image: "/images/meditation/self-kindness.jpg",
            instruction: "Focus on your heart area. Silently repeat: 'May I be happy. May I be healthy. May I be safe. May I live with ease.' Feel these wishes for yourself sincerely."
          },
          {
            title: "Loved Ones",
            description: "Extend loving-kindness to someone you care about deeply.",
            duration: 180,
            image: "/images/meditation/loved-ones.jpg",
            instruction: "Bring to mind someone you care about. Direct the same phrases toward them: 'May you be happy. May you be healthy. May you be safe. May you live with ease.'"
          },
          {
            title: "Neutral Person",
            description: "Extend loving-kindness to someone you neither like nor dislike.",
            duration: 180,
            image: "/images/meditation/neutral-person.jpg",
            instruction: "Think of someone you have a neutral relationship with. Repeat the same phrases for them, wishing them well-being and happiness."
          },
          {
            title: "Difficult Person",
            description: "Extend loving-kindness to someone with whom you have difficulty.",
            duration: 180,
            image: "/images/meditation/difficult-person.jpg",
            instruction: "Bring to mind someone you find difficult. Try to send them wishes for well-being using the same phrases. This may be challenging, so approach with patience."
          },
          {
            title: "All Beings",
            description: "Extend loving-kindness to all beings everywhere.",
            duration: 120,
            image: "/images/meditation/all-beings.jpg",
            instruction: "Extend your loving-kindness to all beings: 'May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease.'"
          }
        ];
      
      case 'body-scan':
        return [
          {
            title: "Lie Down Comfortably",
            description: "Find a comfortable lying position on your back.",
            duration: 60,
            image: "/images/meditation/lying-position.jpg",
            instruction: "Lie down on your back with your arms at your sides, palms facing up. Let your legs relax and fall slightly apart."
          },
          {
            title: "Deep Breathing",
            description: "Take a few deep breaths to center yourself.",
            duration: 90,
            image: "/images/meditation/deep-breathing.jpg",
            instruction: "Take several deep breaths, feeling your abdomen rise and fall. Allow your body to relax more deeply with each exhale."
          },
          {
            title: "Feet and Legs",
            description: "Bring awareness to your feet and legs, relaxing each area.",
            duration: 180,
            image: "/images/meditation/feet-legs.jpg",
            instruction: "Focus on your toes, feet, ankles, calves, and thighs. Notice any sensations. As you exhale, imagine tension releasing from these areas."
          },
          {
            title: "Torso and Arms",
            description: "Scan through your abdomen, chest, back, and arms.",
            duration: 180,
            image: "/images/meditation/torso-arms.jpg",
            instruction: "Move your attention to your hips, abdomen, lower back, chest, upper back, shoulders, arms, hands, and fingers. Notice any sensations and release tension."
          },
          {
            title: "Head and Face",
            description: "Bring awareness to your neck, face, and head.",
            duration: 180,
            image: "/images/meditation/head-face.jpg",
            instruction: "Focus on your neck, jaw, mouth, nose, eyes, forehead, and scalp. Release any tension in these areas as you exhale."
          },
          {
            title: "Whole Body Awareness",
            description: "Experience your entire body as a whole.",
            duration: 120,
            image: "/images/meditation/whole-body.jpg",
            instruction: "Now sense your entire body as a whole. Feel the boundary between your body and the space around it. Notice the sense of wholeness and integration."
          }
        ];
      
      case 'zen-meditation':
        return [
          {
            title: "Zazen Posture",
            description: "Take the traditional seated Zen posture.",
            duration: 90,
            image: "/images/meditation/zazen-posture.jpg",
            instruction: "Sit with your legs crossed in a stable position. Keep your back straight, forming a solid base with your knees and hips."
          },
          {
            title: "Hand Position",
            description: "Form the cosmic mudra with your hands.",
            duration: 60,
            image: "/images/meditation/cosmic-mudra.jpg",
            instruction: "Place your left hand on top of your right, palms facing up, with thumbs lightly touching to form an oval. Rest hands against your lower abdomen."
          },
          {
            title: "Eyes and Gaze",
            description: "Keep eyes half-open with a downward gaze.",
            duration: 60,
            image: "/images/meditation/zen-gaze.jpg",
            instruction: "Keep your eyes half-open, gazing downward at about a 45-degree angle. This helps prevent drowsiness while maintaining a meditative state."
          },
          {
            title: "Breathing Technique",
            description: "Focus on deep, diaphragmatic breathing.",
            duration: 240,
            image: "/images/meditation/zen-breathing.jpg",
            instruction: "Breathe deeply through your nose. Focus on the sensation of breath in your lower abdomen (hara). Count each breath cycle from one to ten, then repeat."
          },
          {
            title: "Mind Like Sky",
            description: "Allow thoughts to pass like clouds in the sky.",
            duration: 300,
            image: "/images/meditation/mind-sky.jpg",
            instruction: "When thoughts arise, acknowledge them without attachment, then return to counting your breaths. Imagine your mind as vast as the sky, with thoughts passing like clouds."
          },
          {
            title: "Extended Sitting",
            description: "Maintain your posture and awareness.",
            duration: 300,
            image: "/images/meditation/extended-sitting.jpg",
            instruction: "Continue sitting in stillness, maintaining your posture and breath awareness. If discomfort arises, acknowledge it and return to your breath."
          }
        ];
      
      case 'chakra-meditation':
        return [
          {
            title: "Seated Position",
            description: "Sit comfortably with your spine straight.",
            duration: 60,
            image: "/images/meditation/chakra-seated.jpg",
            instruction: "Sit in a comfortable position with your spine straight. Place your hands on your knees with palms facing up or in a mudra position."
          },
          {
            title: "Root Chakra (Muladhara)",
            description: "Focus on the base of your spine, associated with security and stability.",
            duration: 120,
            image: "/images/meditation/root-chakra.jpg",
            instruction: "Focus at the base of your spine. Visualize a glowing red light or spinning wheel. Mentally repeat: 'I am safe and secure. I am grounded.'"
          },
          {
            title: "Sacral Chakra (Svadhisthana)",
            description: "Bring awareness to your lower abdomen, center of creativity and emotion.",
            duration: 120,
            image: "/images/meditation/sacral-chakra.jpg",
            instruction: "Move your attention to about 2 inches below your navel. Visualize an orange light. Mentally repeat: 'I honor my emotions. I embrace my creativity.'"
          },
          {
            title: "Solar Plexus Chakra (Manipura)",
            description: "Focus on the area above your navel, related to personal power and confidence.",
            duration: 120,
            image: "/images/meditation/solar-plexus-chakra.jpg",
            instruction: "Focus on your upper abdomen. Visualize a yellow light. Mentally repeat: 'I am confident and empowered. I trust my inner wisdom.'"
          },
          {
            title: "Heart Chakra (Anahata)",
            description: "Center on your heart area, associated with love and compassion.",
            duration: 120,
            image: "/images/meditation/heart-chakra.jpg",
            instruction: "Focus on the center of your chest. Visualize a green light. Mentally repeat: 'I am open to giving and receiving love. My heart is full of compassion.'"
          },
          {
            title: "Throat Chakra (Vishuddha)",
            description: "Bring awareness to your throat, the center of communication and expression.",
            duration: 120,
            image: "/images/meditation/throat-chakra.jpg",
            instruction: "Focus on your throat area. Visualize a blue light. Mentally repeat: 'I speak my truth with clarity. I express myself authentically.'"
          },
          {
            title: "Third Eye Chakra (Ajna)",
            description: "Focus on the space between your eyebrows, related to intuition and insight.",
            duration: 120,
            image: "/images/meditation/third-eye-chakra.jpg",
            instruction: "Focus on the space between your eyebrows. Visualize an indigo light. Mentally repeat: 'I trust my intuition. I am connected to my inner wisdom.'"
          }
        ];
      
      case 'quick-relaxation':
        return [
          {
            title: "Comfortable Position",
            description: "Sit comfortably wherever you are.",
            duration: 30,
            image: "/images/meditation/quick-position.jpg",
            instruction: "Find a comfortable sitting position. You don't need special equipment or a specific posture. Just sit with your back supported."
          },
          {
            title: "Grounding Breath",
            description: "Take three deep breaths to center yourself.",
            duration: 30,
            image: "/images/meditation/grounding-breath.jpg",
            instruction: "Take three deep breaths. Inhale slowly through your nose, and exhale fully through your mouth. Feel your body becoming more present with each breath."
          },
          {
            title: "Body Check-In",
            description: "Quickly scan your body for tension.",
            duration: 60,
            image: "/images/meditation/quick-body-scan.jpg",
            instruction: "Quickly scan your body from head to toe. Notice any areas of tension without trying to change them. Just becoming aware often begins to release tension naturally."
          },
          {
            title: "Mindful Minute",
            description: "Focus on your natural breathing for one minute.",
            duration: 60,
            image: "/images/meditation/mindful-minute.jpg",
            instruction: "For the next minute, simply follow your natural breathing. There's no need to control it, just notice the sensations of breath entering and leaving your body."
          },
          {
            title: "Thought Cloud",
            description: "Visualize your thoughts as clouds passing by.",
            duration: 60,
            image: "/images/meditation/thought-cloud.jpg",
            instruction: "If your mind is busy with thoughts, imagine them as clouds in the sky. Watch them form and dissolve, without getting caught up in any particular thought."
          }
        ];
      
      // Default case: provide generic steps
      default:
        return [
          {
            title: "Find a Comfortable Position",
            description: "Sit or lie down in a comfortable position.",
            duration: 60,
            image: "/images/meditation/sitting-position.jpg",
            instruction: "Find a comfortable position where you can remain still. Allow your body to relax but keep your mind alert."
          },
          {
            title: "Mindful Breathing",
            description: "Focus on your breath.",
            duration: 120,
            image: "/images/meditation/breath-focus.jpg",
            instruction: "Bring your attention to your breath. Notice the sensation of air flowing in and out of your body. Don't try to control it, just observe."
          },
          {
            title: "Mind Centering",
            description: "Bring your focus to the present moment.",
            duration: 180,
            image: "/images/meditation/mindful-minute.jpg",
            instruction: "Bring your full attention to the present moment. If your mind wanders, gently bring it back to your breath and the now."
          }
        ];
    }
  };
  
  // Get recommended music based on technique
  const getTechniqueMusic = (): MeditationMusic[] => {
    // If technique already has recommended music, use that
    if (technique.recommendedMusic && technique.recommendedMusic.length > 0) {
      return technique.recommendedMusic;
    }
    
    // Otherwise, provide default music based on technique category
    switch (technique.category) {
      case 'Focus':
        return [
          {
            title: "Deep Focus",
            artist: "Concentration Masters",
            coverArt: "/images/meditation/music/focus.jpg",
            audioSrc: "/audio/meditation/focus.mp3"
          },
          {
            title: "Mental Clarity",
            artist: "Brain Waves",
            coverArt: "/images/meditation/music/clarity.jpg",
            audioSrc: "/audio/meditation/clarity.mp3"
          },
          {
            title: "Alpha Waves",
            artist: "Mind Builders",
            coverArt: "/images/meditation/music/alpha.jpg",
            audioSrc: "/audio/meditation/alpha.mp3"
          },
          {
            title: "Deep Relaxation",
            artist: "Calm Waters",
            coverArt: "/images/meditation/music/relaxation.jpg",
            audioSrc: "/audio/meditation/relaxation.mp3"
          },
          {
            title: "Peaceful Garden",
            artist: "Nature Sounds",
            coverArt: "/images/meditation/music/garden.jpg",
            audioSrc: "/audio/meditation/garden.mp3"
          },
          {
            title: "Gentle Piano",
            artist: "Classical Relaxation",
            coverArt: "/images/meditation/music/piano.jpg",
            audioSrc: "/audio/meditation/piano.mp3"
          }
        ];
      
      case 'Relaxation':
        return [
           {
            title: "Deep Focus",
            artist: "Concentration Masters",
            coverArt: "/images/meditation/music/focus.jpg",
            audioSrc: "/audio/meditation/focus.mp3"
          },
          {
            title: "Mental Clarity",
            artist: "Brain Waves",
            coverArt: "/images/meditation/music/clarity.jpg",
            audioSrc: "/audio/meditation/clarity.mp3"
          },
          {
            title: "Alpha Waves",
            artist: "Mind Builders",
            coverArt: "/images/meditation/music/alpha.jpg",
            audioSrc: "/audio/meditation/alpha.mp3"
          },
          {
            title: "Deep Relaxation",
            artist: "Calm Waters",
            coverArt: "/images/meditation/music/relaxation.jpg",
            audioSrc: "/audio/meditation/relaxation.mp3"
          },
          {
            title: "Peaceful Garden",
            artist: "Nature Sounds",
            coverArt: "/images/meditation/music/garden.jpg",
            audioSrc: "/audio/meditation/garden.mp3"
          },
          {
            title: "Gentle Piano",
            artist: "Classical Relaxation",
            coverArt: "/images/meditation/music/piano.jpg",
            audioSrc: "/audio/meditation/piano.mp3"
          }
        ];
      
      case 'Sleep':
        return [
         {
            title: "Deep Focus",
            artist: "Concentration Masters",
            coverArt: "/images/meditation/music/focus.jpg",
            audioSrc: "/audio/meditation/focus.mp3"
          },
          {
            title: "Mental Clarity",
            artist: "Brain Waves",
            coverArt: "/images/meditation/music/clarity.jpg",
            audioSrc: "/audio/meditation/clarity.mp3"
          },
          {
            title: "Alpha Waves",
            artist: "Mind Builders",
            coverArt: "/images/meditation/music/alpha.jpg",
            audioSrc: "/audio/meditation/alpha.mp3"
          },
          {
            title: "Deep Relaxation",
            artist: "Calm Waters",
            coverArt: "/images/meditation/music/relaxation.jpg",
            audioSrc: "/audio/meditation/relaxation.mp3"
          },
          {
            title: "Peaceful Garden",
            artist: "Nature Sounds",
            coverArt: "/images/meditation/music/garden.jpg",
            audioSrc: "/audio/meditation/garden.mp3"
          },
          {
            title: "Gentle Piano",
            artist: "Classical Relaxation",
            coverArt: "/images/meditation/music/piano.jpg",
            audioSrc: "/audio/meditation/piano.mp3"
          }
        ];
      
      case 'Emotional Balance':
        return [
           {
            title: "Deep Focus",
            artist: "Concentration Masters",
            coverArt: "/images/meditation/music/focus.jpg",
            audioSrc: "/audio/meditation/focus.mp3"
          },
          {
            title: "Mental Clarity",
            artist: "Brain Waves",
            coverArt: "/images/meditation/music/clarity.jpg",
            audioSrc: "/audio/meditation/clarity.mp3"
          },
          {
            title: "Alpha Waves",
            artist: "Mind Builders",
            coverArt: "/images/meditation/music/alpha.jpg",
            audioSrc: "/audio/meditation/alpha.mp3"
          },
          {
            title: "Deep Relaxation",
            artist: "Calm Waters",
            coverArt: "/images/meditation/music/relaxation.jpg",
            audioSrc: "/audio/meditation/relaxation.mp3"
          },
          {
            title: "Peaceful Garden",
            artist: "Nature Sounds",
            coverArt: "/images/meditation/music/garden.jpg",
            audioSrc: "/audio/meditation/garden.mp3"
          },
          {
            title: "Gentle Piano",
            artist: "Classical Relaxation",
            coverArt: "/images/meditation/music/piano.jpg",
            audioSrc: "/audio/meditation/piano.mp3"
          }
        ];
      
      case 'Energy':
        return [
           {
            title: "Deep Focus",
            artist: "Concentration Masters",
            coverArt: "/images/meditation/music/focus.jpg",
            audioSrc: "/audio/meditation/focus.mp3"
          },
          {
            title: "Mental Clarity",
            artist: "Brain Waves",
            coverArt: "/images/meditation/music/clarity.jpg",
            audioSrc: "/audio/meditation/clarity.mp3"
          },
          {
            title: "Alpha Waves",
            artist: "Mind Builders",
            coverArt: "/images/meditation/music/alpha.jpg",
            audioSrc: "/audio/meditation/alpha.mp3"
          },
          {
            title: "Deep Relaxation",
            artist: "Calm Waters",
            coverArt: "/images/meditation/music/relaxation.jpg",
            audioSrc: "/audio/meditation/relaxation.mp3"
          },
          {
            title: "Peaceful Garden",
            artist: "Nature Sounds",
            coverArt: "/images/meditation/music/garden.jpg",
            audioSrc: "/audio/meditation/garden.mp3"
          },
          {
            title: "Gentle Piano",
            artist: "Classical Relaxation",
            coverArt: "/images/meditation/music/piano.jpg",
            audioSrc: "/audio/meditation/piano.mp3"
          }
        ];
      
      case 'Spiritual':
        return [
           {
            title: "Deep Focus",
            artist: "Concentration Masters",
            coverArt: "/images/meditation/music/focus.jpg",
            audioSrc: "/audio/meditation/focus.mp3"
          },
          {
            title: "Mental Clarity",
            artist: "Brain Waves",
            coverArt: "/images/meditation/music/clarity.jpg",
            audioSrc: "/audio/meditation/clarity.mp3"
          },
          {
            title: "Alpha Waves",
            artist: "Mind Builders",
            coverArt: "/images/meditation/music/alpha.jpg",
            audioSrc: "/audio/meditation/alpha.mp3"
          },
          {
            title: "Deep Relaxation",
            artist: "Calm Waters",
            coverArt: "/images/meditation/music/relaxation.jpg",
            audioSrc: "/audio/meditation/relaxation.mp3"
          },
          {
            title: "Peaceful Garden",
            artist: "Nature Sounds",
            coverArt: "/images/meditation/music/garden.jpg",
            audioSrc: "/audio/meditation/garden.mp3"
          },
          {
            title: "Gentle Piano",
            artist: "Classical Relaxation",
            coverArt: "/images/meditation/music/piano.jpg",
            audioSrc: "/audio/meditation/piano.mp3"
          }
        ];
      
      // Default music options
      default:
        return [
           {
            title: "Deep Focus",
            artist: "Concentration Masters",
            coverArt: "/images/meditation/music/focus.jpg",
            audioSrc: "/audio/meditation/focus.mp3"
          },
          {
            title: "Mental Clarity",
            artist: "Brain Waves",
            coverArt: "/images/meditation/music/clarity.jpg",
            audioSrc: "/audio/meditation/clarity.mp3"
          },
          {
            title: "Alpha Waves",
            artist: "Mind Builders",
            coverArt: "/images/meditation/music/alpha.jpg",
            audioSrc: "/audio/meditation/alpha.mp3"
          },
          {
            title: "Deep Relaxation",
            artist: "Calm Waters",
            coverArt: "/images/meditation/music/relaxation.jpg",
            audioSrc: "/audio/meditation/relaxation.mp3"
          },
          {
            title: "Peaceful Garden",
            artist: "Nature Sounds",
            coverArt: "/images/meditation/music/garden.jpg",
            audioSrc: "/audio/meditation/garden.mp3"
          },
          {
            title: "Gentle Piano",
            artist: "Classical Relaxation",
            coverArt: "/images/meditation/music/piano.jpg",
            audioSrc: "/audio/meditation/piano.mp3"
          }
        ];
    }
  };
  
  // Get the steps and music based on the technique
  const steps = getTechniqueSteps();
  const recommendedMusic = getTechniqueMusic();
  
  // Initialize the session when the dialog opens
  useEffect(() => {
    if (isOpen && !sessionInProgress) {
      startSession();
    }
  }, [isOpen, sessionInProgress]);
  
  // Start meditation session
  const startSession = () => {
    setSessionInProgress(true);
    setSessionStartTime(new Date());
    setCurrentStep(0);
    
    // Start first step
    if (steps.length > 0) {
      setStepTimeLeft(steps[0].duration);
      runStepTimer();
    }
  };
  
  // Run the timer for the current step
  const runStepTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setStepTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Move to next step
          moveToNextStep();
          return 0;
        }
        return prevTime - 1;
      });
      
      // Update overall session progress
      updateSessionProgress();
    }, 1000);
  };
  
  // Update overall session progress
  const updateSessionProgress = () => {
    const totalDuration = steps.reduce((total, step) => total + step.duration, 0);
    const completedDuration = steps
      .slice(0, currentStep)
      .reduce((total, step) => total + step.duration, 0);
    
    const currentStepDuration = steps[currentStep]?.duration || 0;
    const currentStepCompletedDuration = currentStepDuration - stepTimeLeft;
    
    const progressPercentage = ((completedDuration + currentStepCompletedDuration) / totalDuration) * 100;
    setTotalSessionProgress(progressPercentage);
  };
  
  // Move to the next step
  const moveToNextStep = () => {
    const nextStep = currentStep + 1;
    
    // Check if this was the last step
    if (nextStep >= steps.length) {
      completeSession();
      return;
    }
    
    // Move to next step
    setCurrentStep(nextStep);
    setStepTimeLeft(steps[nextStep].duration);
  };
  
  // Move to the previous step
  const moveToPrevStep = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setStepTimeLeft(steps[prevStep].duration);
    }
  };

  // Skip to the next step
  const skipStep = () => {
    moveToNextStep();
  };
  
  // Complete the meditation session
  const completeSession = () => {
  if (!sessionStartTime) return;
  
  // Clear any existing timer
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
  
  const now = new Date();
  const durationInSeconds = Math.round((now.getTime() - sessionStartTime.getTime()) / 1000);
  
  // Add this line to save the completed session:
  saveCompletedSession(technique, durationInSeconds);
  console.log(`Session completed: ${durationInSeconds} seconds`);
  
  // Reset states
  setSessionInProgress(false);
  setSessionStartTime(null);
  setCurrentStep(0);
  setStepTimeLeft(0);
  setTotalSessionProgress(0);
  
  // Close the player dialog
  setIsOpen(false);
  
  // Stop music if playing
  if (audioRef.current) {
    audioRef.current.pause();
    setIsMusicPlaying(false);
  }
};
  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Handle music selection
    const selectMusic = (music: MeditationMusic) => {
        setSelectedMusic(music);
        setIsAudioLoading(true);
        
        if (audioRef.current) {
            audioRef.current.src = music.audioSrc;
            audioRef.current.volume = volume / 100;
            
            audioRef.current.load();
            audioRef.current.play()
            .then(() => {
                setIsMusicPlaying(true);
                setIsAudioLoading(false);
            })
            .catch(error => {
                console.error("Error playing audio:", error);
                setIsMusicPlaying(false);
                setIsAudioLoading(false);
            });
        }
    };
  
  // Toggle music play/pause
  const toggleMusic = () => {
    if (!selectedMusic) return;
    
    setIsMusicPlaying(!isMusicPlaying);
    
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  
    useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
        const handleCanPlay = () => setIsAudioLoading(false);
        const handleEnded = () => setIsMusicPlaying(false);
        const handleError = (e: Event) => {
        console.error("Audio error:", e);
        setIsMusicPlaying(false);
        setIsAudioLoading(false);
        };
        
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        
        return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        };
    }
    }, []);
  
  // Demo music tracks
  const demoMusic: MeditationMusic[] = [
    {
      title: "Ambient Calm",
      artist: "Tranquil Sounds",
      coverArt: "/images/meditation/music/ambient.jpg",
      audioSrc: "/audio/meditation/ambient.mp3"
    },
    {
      title: "Forest Meditation",
      artist: "Nature Sounds",
      coverArt: "/images/meditation/music/forest.jpg",
      audioSrc: "/audio/meditation/forest.mp3"
    },
    {
      title: "Gentle Piano",
      artist: "Classical Mindfulness",
      coverArt: "/images/meditation/music/piano.jpg",
      audioSrc: "/audio/meditation/piano.mp3"
    }
  ];
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && sessionInProgress) {
          // Ask for confirmation before closing
          if (window.confirm('Are you sure you want to end your meditation session?')) {
            completeSession();
          } else {
            setIsOpen(true);
            return;
          }
        }
        setIsOpen(open);
      }}
    >
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        {/* Improved layout with side-by-side content */}
        <div className="flex flex-col md:flex-row h-[85vh]">
          {/* Meditation content - Left side */}
          <div className={`relative w-full ${showMusicPanel ? 'md:w-1/2' : 'md:w-2/3'} bg-gray-50 p-6 flex flex-col transition-all duration-300`}>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-50 to-transparent"></div>
            
            {/* Header with progress bar */}
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold text-gray-800 text-center mb-1">
                {steps[currentStep]?.title}
              </h2>
              <p className="text-gray-500 text-center mb-4">
                Step {currentStep + 1} of {steps.length}
              </p>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${totalSessionProgress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500 mb-6">
                <span>{formatTime(stepTimeLeft)}</span>
                <span>{formatTime(steps[currentStep]?.duration || 0)}</span>
              </div>
            </div>
            
            {/* Main meditation content area */}
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-8">
                  <div className={`w-16 h-16 rounded-full bg-purple-500 opacity-80 ${sessionInProgress ? 'animate-pulse' : ''}`}></div>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  {steps[currentStep]?.instruction}
                </p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="relative z-10">
              <div className="flex justify-center gap-3 mb-4">
                <Button 
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                  onClick={moveToPrevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant={sessionInProgress ? "outline" : "default"}
                  size="icon"
                  className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white hover:bg-purple-700 transition-colors"
                  onClick={() => {
                    if (sessionInProgress) {
                      // Pause/resume logic
                      if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                      } else {
                        runStepTimer();
                      }
                    } else {
                      startSession();
                    }
                    setSessionInProgress(!sessionInProgress);
                  }}
                >
                  {sessionInProgress && timerRef.current ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
                  onClick={skipStep}
                  disabled={currentStep === steps.length - 1}
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex justify-between">

                              
                <Button 
                  variant="outline"
                  size="sm"
                  className="py-2 px-4 rounded-full bg-gray-200 text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-300 transition-colors"
                  onClick={skipStep}
                >
                  <SkipForward className="h-4 w-4" />
                  Skip Step
                </Button>
                {/*End Session Button*/}
                <Button
                  variant="destructive"
                  size="sm"
                  className="py-2 px-4 rounded-full bg-gray-200 text-gray-700 text-sm flex items-center gap-2 hover:bg-gray-300 transition-colors"
                  onClick={completeSession}
                >End Session</Button>
              </div>
            </div>
          </div>
          
          {/* Music Player - Right side */}
          <div className={`w-full ${showMusicPanel ? 'md:w-1/2' : 'md:w-1/3'} bg-gray-900 text-white p-6 overflow-y-auto transition-all duration-300`}>
            <h3 className="text-xl font-semibold mb-6">Meditation Music</h3>
            
            {/* Currently playing */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-1">Currently Playing</p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                  {selectedMusic ? (
                    <img 
                      src={selectedMusic.coverArt} 
                      alt={selectedMusic.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Music className="h-8 w-8 text-gray-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-medium">
                    {selectedMusic ? selectedMusic.title : 'No music selected'}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {selectedMusic ? selectedMusic.artist : 'Select a track below'}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  onClick={toggleMusic}
                  disabled={!selectedMusic}
                >
                  {isMusicPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Volume control */}
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="h-5 w-5 text-gray-400" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              <span className="text-gray-400 text-sm w-8 text-right">{volume}%</span>
            </div>
            
            {/* Music selection */}
            <h4 className="font-medium text-sm text-gray-400 mb-3">Choose Background Music</h4>
            <div className="space-y-3">
              {recommendedMusic.map((music, index) => (
                <div 
                  key={index}
                  className={`
                    flex items-center gap-3 p-2 rounded-lg 
                    ${selectedMusic?.title === music.title ? 'bg-purple-900/30 border border-purple-500/50' : 'hover:bg-white/5'} 
                    cursor-pointer transition-colors
                  `}
                  onClick={() => selectMusic(music)}
                >
                  <img 
                    src={music.coverArt} 
                    alt={music.title} 
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-grow">
                    <h5 className="font-medium">{music.title}</h5>
                    <p className="text-gray-400 text-sm">{music.artist}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectMusic(music);
                    }}
                  >
                    <Play className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
      
      {/* Hidden audio element for music playback */}
      <audio
        ref={audioRef}
        src="/audio/meditation-ambient.mp3"
        loop
      />
    </Dialog>
  );
};

export default MeditationPlayer;