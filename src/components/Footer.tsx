
import React from 'react';
import { Separator } from './ui/separator';

const Footer = () => {
  return (
    <footer id="about" className="bg-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/4546c2ea-9a15-40c9-a1ec-f046c06e8245.png" 
                alt="Mindflow Logo" 
                className="h-10 w-10 object-contain" 
              />
              <span className="font-semibold text-xl">Mindflow</span>
            </div>
            <p className="text-gray-600 max-w-md">
              Mindflow is dedicated to helping you find balance in your daily life through 
              evidence-based techniques for stress management and personal growth.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-primary">Features</a></li>
              <li><a href="#testimonials" className="text-gray-600 hover:text-primary">Testimonials</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Facebook</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Mindflow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
