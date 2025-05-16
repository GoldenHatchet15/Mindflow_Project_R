// src/pages/RelaxationMusic.tsx - Updated with darker purple theme
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Music,
  Moon,
  Brain,
  Zap,
  Heart
} from 'lucide-react';

// Define types for music tracks and playlists
interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string; // in MM:SS format
  file: string;
  coverArt: string;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  coverImage: string;
  tracks: MusicTrack[];
}

// Define music tracks
const musicTracks: Record<string, MusicTrack[]> = {
  "sleep": [
    {
      id: "sleep-1",
      title: "Dreamy Night",
      artist: "Sleep Masters",
      duration: "5:10",
      file: "/audio/meditation/relaxation.mp3",
      coverArt: "/images/meditation/body-scan.jpg"
    },
    {
      id: "sleep-2",
      title: "Deep Slumber",
      artist: "Dream Weavers",
      duration: "6:22",
      file: "/audio/meditation/piano.mp3",
      coverArt: "/images/meditation/zen.jpg"
    }
  ],
  "relax": [
    {
      id: "relax-1",
      title: "Peaceful Garden",
      artist: "Nature Sounds",
      duration: "4:30",
      file: "/audio/meditation/garden.mp3",
      coverArt: "/images/meditation/loving-kindness.jpg"
    },
    {
      id: "relax-2",
      title: "Gentle Piano",
      artist: "Classical Relaxation",
      duration: "3:45",
      file: "/audio/meditation/piano.mp3",
      coverArt: "/images/meditation/chakra.jpg"
    }
  ],
  "focus": [
    {
      id: "focus-1",
      title: "Deep Focus",
      artist: "Concentration Masters",
      duration: "7:15",
      file: "/audio/meditation/focus.mp3",
      coverArt: "/images/meditation/mindfulness.jpg"
    },
    {
      id: "focus-2",
      title: "Mental Clarity",
      artist: "Brain Waves",
      duration: "5:30",
      file: "/audio/meditation/clarity.mp3",
      coverArt: "/images/meditation/zen-breathing.jpg"
    },
    {
      id: "focus-3",
      title: "Alpha Waves",
      artist: "Mind Builders",
      duration: "6:10",
      file: "/audio/meditation/alpha.mp3",
      coverArt: "/images/meditation/zazen-posture.jpg"
    }
  ]
};

// Define playlists
const playlists: Playlist[] = [
  {
    id: "sleep",
    title: "Sleep",
    description: "Soothing sounds to help you fall asleep faster and sleep deeper",
    icon: <Moon className="h-5 w-5" />,
    coverImage: "/images/meditation/body-scan.jpg",
    tracks: musicTracks.sleep
  },
  {
    id: "relax",
    title: "Relaxation",
    description: "Calm your mind and body with these peaceful melodies",
    icon: <Heart className="h-5 w-5" />,
    coverImage: "/images/meditation/loving-kindness.jpg",
    tracks: musicTracks.relax
  },
  {
    id: "focus",
    title: "Focus",
    description: "Enhance concentration and productivity with these tracks",
    icon: <Brain className="h-5 w-5" />,
    coverImage: "/images/meditation/mindfulness.jpg",
    tracks: musicTracks.focus
  }
];

const RelaxationMusic: React.FC = () => {
  // State for player
  const [currentPlaylist, setCurrentPlaylist] = useState<string>("relax");
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(70);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // Get current track
  const currentPlaylistObj = playlists.find(p => p.id === currentPlaylist) || playlists[0];
  const currentTrack = currentPlaylistObj.tracks[currentTrackIndex];
  
  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Initialize audio when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      
      // Add event listeners
      audioRef.current.addEventListener('ended', handleEnd);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnd);
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, []);
  
  // Update audio when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.file;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play()
          .catch(error => {
            console.error("Error playing audio:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [currentTrack]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Event handlers
  const handlePlayPause = () => {
    if (!isPlaying) {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            startTimeUpdate();
          })
          .catch(error => {
            console.error("Error playing audio:", error);
          });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      }
      setIsPlaying(false);
    }
  };
  
  const handleEnd = () => {
    if (isLooping) {
      // Restart current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else {
      // Play next track
      handleNext();
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const startTimeUpdate = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const updateTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        animationRef.current = requestAnimationFrame(updateTime);
      }
    };
    
    animationRef.current = requestAnimationFrame(updateTime);
  };
  
  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % currentPlaylistObj.tracks.length;
    setCurrentTrackIndex(nextIndex);
  };
  
  const handlePrevious = () => {
    // If we're more than 3 seconds into a track, restart it instead of going to previous
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    const prevIndex = (currentTrackIndex - 1 + currentPlaylistObj.tracks.length) % currentPlaylistObj.tracks.length;
    setCurrentTrackIndex(prevIndex);
  };
  
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const handleTrackSelect = (trackIndex: number) => {
    setCurrentTrackIndex(trackIndex);
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.src = currentPlaylistObj.tracks[trackIndex].file;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }
  };
  
  const handlePlaylistChange = (playlistId: string) => {
    setCurrentPlaylist(playlistId);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  };
  
  // Additional UI elements
  const getCoverImage = (path: string) => {
    // Check if it's an absolute URL or a path
    if (path.startsWith('http')) {
      return path;
    }
    
    return path;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/images/meditation/pattern.svg')] opacity-10 bg-repeat"></div>
        
        <div className="relative flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Music className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Relaxation Music</h2>
            <p className="text-white/80 max-w-2xl">
              Soothing sounds to help you relax, focus, and sleep better
            </p>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Playlists sidebar - Left */}
        <div className="p-6 bg-purple-900/10 border border-purple-800/20 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">Playlists</h3>
          <div className="space-y-3">
            {playlists.map(playlist => (
              <div 
                key={playlist.id}
                onClick={() => handlePlaylistChange(playlist.id)}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all duration-200
                  ${currentPlaylist === playlist.id ? 
                    'bg-purple-800/20 border border-purple-800/30' : 
                    'bg-white/80 hover:bg-purple-800/10 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center
                    ${currentPlaylist === playlist.id ? 
                      'bg-purple-700 text-white' : 
                      'bg-purple-200 text-purple-800'
                    }
                  `}>
                    {playlist.icon}
                  </div>
                  <div>
                    <h4 className={`font-medium ${currentPlaylist === playlist.id ? 'text-purple-800' : 'text-gray-800'}`}>
                      {playlist.title}
                    </h4>
                    <p className="text-sm text-gray-500">{playlist.tracks.length} tracks</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Player and tracks - Middle and Right */}
        <div className="lg:col-span-2 space-y-6">
          {/* Now playing card */}
          <Card className="bg-purple-900/10 border border-purple-800/20 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Album art - Left */}
              <div className="p-6 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-indigo-800/20">
                <div className="w-full max-w-[250px] aspect-square rounded-lg overflow-hidden shadow-md relative">
                  <div className="absolute inset-0 bg-purple-900/10"></div>
                  <img 
                    src={getCoverImage(currentTrack.coverArt)}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Controls - Right */}
              <div className="md:col-span-2 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-purple-800">{currentTrack.title}</h3>
                  <p className="text-purple-700 mb-4">{currentTrack.artist}</p>
                  <p className="text-sm text-purple-700 mb-6">
                    From the "{currentPlaylistObj.title}" playlist
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="mb-4">
                  <Slider 
                    value={[currentTime]} 
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-purple-700 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex justify-center items-center gap-4 mb-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handlePrevious}
                    className="h-10 w-10 rounded-full text-purple-700 hover:bg-purple-800/20 hover:text-purple-900"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="icon" 
                    onClick={handlePlayPause}
                    className="h-14 w-14 rounded-full bg-purple-700 hover:bg-purple-800"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNext}
                    className="h-10 w-10 rounded-full text-purple-700 hover:bg-purple-800/20 hover:text-purple-900"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Volume and loop */}
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setVolume(volume > 0 ? 0 : 70)}
                    className="h-8 w-8 rounded-full text-purple-700 hover:bg-purple-800/20 hover:text-purple-900"
                  >
                    {volume > 0 ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Slider 
                    value={[volume]} 
                    max={100}
                    onValueChange={handleVolumeChange}
                    className="w-32"
                  />
                  
                  <div className="flex-grow"></div>
                  
                  <Button 
                    variant={isLooping ? "default" : "ghost"}
                    size="icon" 
                    onClick={() => setIsLooping(!isLooping)}
                    className={`h-8 w-8 rounded-full ${isLooping ? 'bg-purple-700 text-white' : 'text-purple-700 hover:bg-purple-800/20 hover:text-purple-900'}`}
                  >
                    <Repeat className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Tracks list */}
          <Card className="bg-purple-900/10 border border-purple-800/20">
            <CardHeader className="border-b border-purple-800/20">
              <CardTitle className="text-purple-800">{currentPlaylistObj.title}</CardTitle>
              <CardDescription className="text-purple-700">{currentPlaylistObj.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {currentPlaylistObj.tracks.map((track, index) => (
                  <div 
                    key={track.id}
                    onClick={() => handleTrackSelect(index)}
                    className={`
                      flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${currentTrackIndex === index ? 
                        'bg-purple-800/20 border border-purple-800/30' : 
                        'hover:bg-purple-800/10 border border-transparent'
                      }
                    `}
                  >
                    {/* Track number or playing indicator */}
                    <div className="w-8 flex items-center justify-center">
                      {currentTrackIndex === index && isPlaying ? (
                        <div className="w-4 h-4 rounded-full bg-purple-700 animate-pulse"></div>
                      ) : (
                        <span className="text-purple-700">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Track info */}
                    <div className="flex-grow">
                      <h4 className={`font-medium ${currentTrackIndex === index ? 'text-purple-800' : 'text-gray-800'}`}>
                        {track.title}
                      </h4>
                      <p className="text-sm text-purple-700">{track.artist}</p>
                    </div>
                    
                    {/* Duration */}
                    <div className="text-sm text-purple-700">
                      {track.duration}
                    </div>
                    
                    {/* Play button */}
                    <Button 
                      variant={currentTrackIndex === index && isPlaying ? "default" : "ghost"}
                      size="icon"
                      className={`h-8 w-8 rounded-full ${
                        currentTrackIndex === index && isPlaying 
                          ? "bg-purple-700 text-white hover:bg-purple-800" 
                          : "text-purple-700 hover:bg-purple-800/20 hover:text-purple-900"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentTrackIndex === index) {
                          handlePlayPause();
                        } else {
                          handleTrackSelect(index);
                        }
                      }}
                    >
                      {currentTrackIndex === index && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
};

export default RelaxationMusic;