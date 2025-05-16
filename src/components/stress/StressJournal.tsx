// src/components/stress/StressJournal.tsx
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface StressJournalProps {
  value: string;
  onChange: (value: string) => void;
}

const StressJournal: React.FC<StressJournalProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Write about your day, what's on your mind, or any specific events that affected your stress level..."
        className="min-h-[150px] resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>This is private and only visible to you</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
};

export default StressJournal;