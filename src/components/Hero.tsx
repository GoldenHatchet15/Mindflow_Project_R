
import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, User } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

const Hero = () => {
  return (
    <section className="min-h-screen hero-gradient pt-24 pb-16 px-4 flex items-center relative">
      <AnimatedBackground />
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6 md:order-1 order-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight fade-in-text">
            Find Your <span className="text-primary">Inner Peace</span> with Mindflow
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-md fade-in-text-delay-1">
            Your personal companion for managing stress and anxiety through exercises, meditation, 
            natural remedies and daily inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 fade-in-text-delay-2">
            <Button size="lg" className="bg-primary hover:bg-primary/90 pulse-animation" onClick={() => window.location.href = '/app'}>
              Launch App
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.location.href = '/auth'}>
              Sign Up
              <User className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
        <div className="md:order-2 order-1 flex justify-center">
          <div className="relative max-w-md pulse-animation">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30"></div>
            <div className="relative bg-white rounded-full p-3">
              <img 
                src="/lovable-uploads/4546c2ea-9a15-40c9-a1ec-f046c06e8245.png" 
                alt="Mindflow Logo" 
                className="w-64 h-64 md:w-80 md:h-80 object-contain animate-float rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
