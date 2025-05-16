
import React from 'react';
import { Brain, Activity, Leaf, Quote } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "Guided Meditations",
    description: "Access a library of guided meditations for stress relief, better sleep, and improved focus.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Activity,
    title: "Exercise Routines",
    description: "Follow simple exercises designed to release tension and boost your mental wellbeing.",
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: Leaf,
    title: "Natural Remedies",
    description: "Discover natural approaches to anxiety management backed by research and tradition.",
    color: "bg-green-50 text-green-700",
  },
  {
    icon: Quote,
    title: "Daily Quotes",
    description: "Start each day with inspiring quotes that help you shift perspective and stay motivated.",
    color: "bg-amber-50 text-amber-700",
  }
];

const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
  return (
    <div className="feature-card bg-white rounded-xl shadow-sm p-6 transition-all duration-300 h-full">
      <div className={`${feature.color} inline-block p-3 rounded-lg mb-4`}>
        <feature.icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Features Designed for Your Wellbeing</h2>
          <p className="text-gray-600">
            Mindflow combines proven techniques to help you manage stress and anxiety while fostering personal growth.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
