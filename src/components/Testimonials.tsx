
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';

const testimonials = [
  {
    name: "Sarah L.",
    role: "Marketing Executive",
    content: "After using Mindflow for just three weeks, I noticed significant improvement in my sleep quality and overall anxiety levels.",
    avatar: "SL"
  },
  {
    name: "Michael T.",
    role: "Software Engineer",
    content: "The guided meditations helped me stay focused during my workday. I'm calmer and more productive since I started using the app.",
    avatar: "MT"
  },
  {
    name: "Jennifer R.",
    role: "Healthcare Worker",
    content: "As someone with a stressful job, the natural remedy recommendations have been life-changing for managing my day-to-day anxiety.",
    avatar: "JR"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 px-4 bg-accent">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600">
            Join thousands who've transformed their relationship with stress and anxiety using Mindflow.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden border border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback className="bg-primary text-white">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
