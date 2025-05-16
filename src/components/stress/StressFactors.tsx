// src/components/stress/StressFactors.tsx
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';

interface StressFactorsProps {
  selected: string[];
  onSelect: (factors: string[]) => void;
}

const StressFactors: React.FC<StressFactorsProps> = ({ selected, onSelect }) => {
  const stressFactors = [
    { id: 'work', label: 'Work' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'health', label: 'Health' },
    { id: 'finances', label: 'Finances' },
    { id: 'family', label: 'Family' },
    { id: 'future', label: 'Future Uncertainty' },
    { id: 'social', label: 'Social Situations' },
    { id: 'time', label: 'Time Management' },
    { id: 'sleep', label: 'Sleep Problems' },
    { id: 'environment', label: 'Environment' },
    { id: 'technology', label: 'Technology' },
    { id: 'studies', label: 'Studies/Education' },
  ];
  
  const toggleFactor = (factorId: string) => {
    if (selected.includes(factorId)) {
      onSelect(selected.filter(id => id !== factorId));
    } else {
      onSelect([...selected, factorId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {stressFactors.map(factor => (
          <Badge 
            key={factor.id}
            variant={selected.includes(factor.id) ? "default" : "outline"}
            className={`
              cursor-pointer text-sm py-2 px-3 transition-all
              ${selected.includes(factor.id) 
                ? 'bg-primary hover:bg-primary/90' 
                : 'hover:bg-primary/10'
              }
            `}
            onClick={() => toggleFactor(factor.id)}
          >
            {selected.includes(factor.id) && (
              <Check className="mr-1 h-3 w-3" />
            )}
            {factor.label}
          </Badge>
        ))}
      </div>
      
      {selected.length === 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          Select all factors contributing to your stress
        </p>
      )}
    </div>
  );
};

export default StressFactors;