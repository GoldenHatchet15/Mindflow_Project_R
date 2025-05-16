// src/components/stress/StressInput.tsx
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface StressInputProps {
  value: number;
  onChange: (value: number) => void;
}

const StressInput: React.FC<StressInputProps> = ({ value, onChange }) => {
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };
  
  // Determine color based on stress level
  const getColorForStressLevel = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getEmojiForStressLevel = (level: number) => {
    if (level <= 2) return '😌';
    if (level <= 4) return '🙂';
    if (level <= 6) return '😐';
    if (level <= 8) return '😟';
    return '😩';
  };
  
  const getLabelForStressLevel = (level: number) => {
    if (level <= 2) return 'Very Calm';
    if (level <= 4) return 'Relaxed';
    if (level <= 6) return 'Neutral';
    if (level <= 8) return 'Stressed';
    return 'Very Stressed';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center mb-8">
        <div className="text-6xl animate-float">
          {getEmojiForStressLevel(value)}
        </div>
      </div>
      
      <div className="text-center mb-4">
        <span className="text-xl font-medium">{getLabelForStressLevel(value)}</span>
      </div>
      
      <Slider
        defaultValue={[value]}
        max={10}
        min={1}
        step={1}
        onValueChange={handleChange}
        className="w-full"
      />
      
      <div className="w-full flex justify-between text-sm text-gray-500 px-2">
        <span>Low Stress</span>
        <span>High Stress</span>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className={`h-12 w-12 rounded-full ${getColorForStressLevel(value)} flex items-center justify-center text-white font-bold text-xl transition-all duration-300 pulse-animation`}>
          {value}
        </div>
      </div>
    </div>
  );
};

export default StressInput;