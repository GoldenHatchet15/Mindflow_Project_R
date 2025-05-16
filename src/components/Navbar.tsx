
import React from 'react';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-white bg-opacity-90 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full overflow-hidden border-2 border-primary/20 p-1 bg-white">
            <img 
              src="/lovable-uploads/4546c2ea-9a15-40c9-a1ec-f046c06e8245.png" 
              alt="Mindflow Logo" 
              className="h-10 w-10 object-contain rounded-full"
            />
          </div>
          <span className="font-semibold text-xl text-gray-800">Mindflow</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a>
          <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">Testimonials</a>
          <a href="#about" className="text-gray-600 hover:text-primary transition-colors">About</a>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.href='/auth'}>
            Log in
          </Button>
          <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
