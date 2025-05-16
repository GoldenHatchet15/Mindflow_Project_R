// src/components/breathing/VideoCard.tsx
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Clock } from 'lucide-react';

interface VideoCardProps {
  title: string;
  description?: string;
  thumbnail: string;
  duration: string;
  videoSrc?: string; // Actual video source (will be a placeholder for now)
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  description,
  thumbnail,
  duration,
  videoSrc,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300" onClick={() => setIsOpen(true)}>
        <div className="relative">
          {/* Thumbnail image */}
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="h-16 w-16 rounded-full bg-white/80 flex items-center justify-center">
              <Play className="h-8 w-8 text-primary ml-1" />
            </div>
          </div>
          
          {/* Duration badge */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {duration}
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-1">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardContent>
      </Card>
      
      {/* Video Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {/* Video placeholder - in a real app, this would be a video element */}
            <div className="w-full aspect-video bg-gray-200 rounded-md overflow-hidden relative">
              <img 
                src={thumbnail} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-4">
                    <Play className="h-10 w-10 text-primary ml-1" />
                  </div>
                  <p className="text-white">Video placeholder - Actual video will be added later</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium text-lg mb-2">{title}</h3>
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoCard;