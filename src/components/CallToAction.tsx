
import React from 'react';
import { Button } from './ui/button';

const CallToAction = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-primary/20 to-secondary/20">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Journey to Inner Peace Today</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Join thousands of others who have transformed their lives with Mindflow.
          Download the app now and take the first step towards a calmer, more balanced you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Download on App Store
          </Button>
          <Button size="lg" className="bg-secondary hover:bg-secondary/90">
            Get it on Google Play
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
