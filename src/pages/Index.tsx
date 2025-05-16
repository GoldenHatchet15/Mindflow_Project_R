
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const Index = () => {
  useEffect(() => {
    // Add a subtle parallax effect for scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const elements = document.querySelectorAll('.parallax-scroll');
      
      elements.forEach(element => {
        const speed = element.getAttribute('data-speed') || '0.1';
        const yPos = -(scrollY * parseFloat(speed));
        element.setAttribute('style', `transform: translateY(${yPos}px)`);
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div className="parallax-scroll" data-speed="0.05">
        <Features />
      </div>
      <div className="parallax-scroll" data-speed="0.03">
        <Testimonials />
      </div>
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
