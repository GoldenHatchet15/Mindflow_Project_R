// Update in src/pages/App.tsx
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, Brain, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AppPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="rounded-full overflow-hidden border-2 border-primary/20 p-2 bg-white inline-block mb-6">
            <img
              src="/lovable-uploads/4546c2ea-9a15-40c9-a1ec-f046c06e8245.png"
              alt="Mindflow Logo"
              className="h-24 w-24 object-contain rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Mindflow</h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
            Your personal companion for managing stress and finding inner peace.
            Start your journey to better mental wellbeing today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="feature-card transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Stress Tracking</CardTitle>
              <CardDescription>
                Monitor your stress levels and identify patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Record your daily stress levels, track contributing factors, and visualize your progress over time.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate('/app/stress')} className="w-full bg-primary hover:bg-primary/90">
                Track Stress <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="feature-card transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <HeartPulse className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Breathing Exercises</CardTitle>
              <CardDescription>
                Guided breathing techniques for relaxation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Practice proven breathing methods to reduce stress, improve focus, and calm your mind quickly.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="feature-card transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Meditation</CardTitle>
              <CardDescription>
                Guided sessions to center your mind
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Discover meditation techniques for different purposes - from quick stress relief to deep relaxation.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppPage;