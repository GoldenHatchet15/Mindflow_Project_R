
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="bubble-container">
        {[...Array(10)].map((_, index) => (
          <div 
            key={index}
            className="bubble"
            style={{
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
