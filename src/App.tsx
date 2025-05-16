// src/App.tsx - Modified version to use our new BreathingExercises component
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import StressTracker from "./pages/StressTracker";
import StressEducation from '@/pages/StressEducation';
import BreathingExercises from './pages/BreathingExercises'; // Import the new BreathingExercises page
import Meditation from "./pages/Meditation";
import RelaxationMusic from "./pages/RelaxationMusic"; 
import { useEffect } from 'react';
import { migrateAllData, hasMigrationRun } from './lib/data-migration';
import { toast } from './components/ui/sonner';

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  // Run data migration on app load
  useEffect(() => {
  // Check if migration has already run
  if (!hasMigrationRun()) {
    // Run migration
    migrateAllData()
      .then(success => {
        if (success) {
          toast.success('Data successfully migrated to the cloud');
        }
      })
      .catch(error => {
        console.error('Error during data migration:', error);
      });
  }
}, []);
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Dashboard Routes */}
              <Route path="/app" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/app/stress" element={<DashboardLayout><StressTracker /></DashboardLayout>} />
              
              {/* Stress education route */}
              <Route path="/app/stress-education" element={<DashboardLayout><StressEducation /></DashboardLayout>} />
              
              {/* Replace the placeholder with our new BreathingExercises component */}
              <Route path="/app/breathing" element={<DashboardLayout><BreathingExercises /></DashboardLayout>} />
              
              {/* Other app routes */}
              <Route path="/app/meditation" element={<DashboardLayout><Meditation /></DashboardLayout>} />
               <Route path="/app/music" element={<DashboardLayout><RelaxationMusic /></DashboardLayout>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;