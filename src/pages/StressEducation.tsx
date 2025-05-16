// src/pages/StressEducation.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Brain, Coffee, Heart, Zap, Shield, AlertCircle, BookOpen} from 'lucide-react';

const StressEducation = () => {
  const [activeTab, setActiveTab] = useState("what-is-stress");
  
  return (
    /*header*/
    <div className="space-y-6">
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 shadow-lg overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Understanding Stress</h1>
            <p className="text-white/80 max-w-2xl">Learn about stress and how to manage it effectively</p>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
            <TabsTrigger value="what-is-stress">About Stress</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="triggers">Triggers</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="long-term">Long-term Management</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="myth-vs-fact">Myths vs Facts</TabsTrigger>
          </TabsList>
        </div>
        
        {/* About Stress Section */}
        <TabsContent value="what-is-stress" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>What is Stress?</CardTitle>
              </div>
              <CardDescription>Understanding the body's stress response</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Stress is your body's reaction to pressure from a certain situation or event. It's a natural
                physiological and psychological response designed to help you cope with challenges. While
                stress in small doses can be beneficial, chronic stress can have negative effects on your overall health.
              </p>
              
              <h3 className="font-medium text-lg mt-4">The Science of Stress</h3>
              <p>
                When you encounter a stressor, your body activates the "fight or flight" response. Your
                brain releases hormones like adrenaline and cortisol, raising your heart rate, blood pressure,
                and energy levels to prepare you to deal with the situation.
              </p>
              
              <div className="bg-accent p-4 rounded-lg mt-4">
                <h4 className="font-medium">Types of Stress</h4>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>
                    <span className="font-medium">Acute stress:</span> Short-term stress that resolves quickly
                  </li>
                  <li>
                    <span className="font-medium">Episodic acute stress:</span> Frequent occurrences of acute stress
                  </li>
                  <li>
                    <span className="font-medium">Chronic stress:</span> Long-term stress that persists over an extended period
                  </li>
                  <li>
                    <span className="font-medium">Eustress:</span> Positive stress that motivates and focuses energy
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Effects of Stress Section */}
        <TabsContent value="effects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle>Effects of Stress</CardTitle>
              </div>
              <CardDescription>How stress impacts your mind and body</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Mental Effects
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Anxiety and worry</li>
                    <li>Difficulty concentrating</li>
                    <li>Memory problems</li>
                    <li>Racing thoughts</li>
                    <li>Negative thinking</li>
                    <li>Mood swings</li>
                  </ul>
                </div>
                
                <div className="bg-accent p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    Physical Effects
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Elevated blood pressure</li>
                    <li>Muscle tension and pain</li>
                    <li>Headaches</li>
                    <li>Digestive issues</li>
                    <li>Sleep problems</li>
                    <li>Weakened immune system</li>
                  </ul>
                </div>
                
                <div className="bg-accent p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2">
                    <Coffee className="h-4 w-4 text-primary" />
                    Behavioral Effects
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Changes in appetite</li>
                    <li>Increased use of alcohol or substances</li>
                    <li>Social withdrawal</li>
                    <li>Procrastination</li>
                    <li>Nervous habits</li>
                    <li>Decreased productivity</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-lg">Long-term Health Risks</h3>
                <p className="mt-2">
                  Chronic stress has been linked to numerous health conditions, including heart disease, 
                  high blood pressure, diabetes, depression, anxiety disorder, and other illnesses. Managing 
                  stress effectively is crucial for maintaining both physical and mental health.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Common Triggers Section */}
        <TabsContent value="triggers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Common Stress Triggers</CardTitle>
              </div>
              <CardDescription>Identifying what causes your stress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Stress triggers (or stressors) can be external events or internal thoughts and feelings. 
                  Learning to identify your personal triggers is an important step in managing stress.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-2">External Triggers</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-medium">Work/School:</span> Deadlines, workload, conflicts with colleagues
                      </li>
                      <li>
                        <span className="font-medium">Relationships:</span> Conflicts, responsibilities, expectations
                      </li>
                      <li>
                        <span className="font-medium">Financial issues:</span> Debt, expenses, financial uncertainty
                      </li>
                      <li>
                        <span className="font-medium">Major life changes:</span> Moving, changing jobs, relationship changes
                      </li>
                      <li>
                        <span className="font-medium">Environment:</span> Noise, crowding, lack of privacy
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Internal Triggers</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-medium">Perfectionism:</span> Setting unrealistically high standards
                      </li>
                      <li>
                        <span className="font-medium">Negative self-talk:</span> Harsh inner critic
                      </li>
                      <li>
                        <span className="font-medium">Pessimistic outlook:</span> Expecting the worst outcomes
                      </li>
                      <li>
                        <span className="font-medium">Poor time management:</span> Feeling constantly rushed
                      </li>
                      <li>
                        <span className="font-medium">Uncertainty tolerance:</span> Difficulty handling unknown situations
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-accent p-4 rounded-lg mt-4">
                  <h3 className="font-medium">Stress Trigger Journal Exercise</h3>
                  <p className="mt-2">
                    Consider keeping a stress journal to identify your personal triggers. Note when you feel stressed, 
                    what happened just before, how you felt physically and emotionally, and how you responded. 
                    Over time, patterns may emerge that can help you better manage your stress response.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Stress Management Techniques Section */}
        <TabsContent value="techniques" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Stress Management Techniques</CardTitle>
              </div>
              <CardDescription>Practical ways to reduce and manage stress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p>
                  There are many effective techniques to manage stress. Different approaches work better for different people, 
                  so it's worth exploring various options to find what works best for you.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Physical Techniques</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <span className="text-primary font-medium text-sm">1</span>
                        </div>
                        <div>
                          <span className="font-medium">Deep Breathing</span>
                          <p className="text-sm text-gray-600">
                            Try the 4-7-8 technique: Inhale for 4 counts, hold for 7, exhale for 8
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <span className="text-primary font-medium text-sm">2</span>
                        </div>
                        <div>
                          <span className="font-medium">Progressive Muscle Relaxation</span>
                          <p className="text-sm text-gray-600">
                            Tense and then release each muscle group, working from toes to head
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <span className="text-primary font-medium text-sm">3</span>
                        </div>
                        <div>
                          <span className="font-medium">Regular Exercise</span>
                          <p className="text-sm text-gray-600">
                            Even a 20-minute walk can reduce stress hormones and boost endorphins
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <span className="text-primary font-medium text-sm">4</span>
                        </div>
                        <div>
                          <span className="font-medium">Adequate Sleep</span>
                          <p className="text-sm text-gray-600">
                            Aim for 7-9 hours of quality sleep each night
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Mental Techniques</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <span className="text-primary font-medium text-sm">1</span>
                        </div>
                        <div>
                          <span className="font-medium">Mindfulness Meditation</span>
                          <p className="text-sm text-gray-600">
                            Focus on the present moment without judgment
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <span className="text-primary font-medium text-sm">2</span>
                        </div>
                        <div>
                          <span className="font-medium">Cognitive Reframing</span>
                          <p className="text-sm text-gray-600">
                            Challenge negative thoughts and consider alternative perspectives
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <span className="text-primary font-medium text-sm">3</span>
                        </div>
                        <div>
                          <span className="font-medium">Guided Imagery</span>
                          <p className="text-sm text-gray-600">
                            Visualize peaceful scenes or successful outcomes
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <span className="text-primary font-medium text-sm">4</span>
                        </div>
                        <div>
                          <span className="font-medium">Journaling</span>
                          <p className="text-sm text-gray-600">
                            Write about stressors and potential solutions
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-accent p-4 rounded-lg mt-4">
                  <h3 className="font-medium">Quick Stress Relievers</h3>
                  <p className="mt-1 mb-2">
                    When stress hits suddenly, try these quick techniques:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-white p-2 rounded-md">
                      <p className="text-sm font-medium">5-5-5 Breathing</p>
                      <p className="text-xs">Breathe in for 5, hold for 5, out for 5</p>
                    </div>
                    <div className="bg-white p-2 rounded-md">
                      <p className="text-sm font-medium">Grounding Technique</p>
                      <p className="text-xs">Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste</p>
                    </div>
                    <div className="bg-white p-2 rounded-md">
                      <p className="text-sm font-medium">Physical Reset</p>
                      <p className="text-xs">Splash cold water on face or take a quick walk</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Long-term Management Section */}
        <TabsContent value="long-term" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Long-term Stress Management</CardTitle>
              </div>
              <CardDescription>Building resilience and healthier habits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                While quick stress-relief techniques are important, developing a comprehensive long-term 
                stress management plan can help build resilience and reduce overall stress levels.
              </p>
              
              <div className="space-y-4">
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Lifestyle Changes</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Maintain a balanced diet rich in stress-reducing foods</li>
                    <li>Establish a consistent sleep schedule</li>
                    <li>Incorporate regular physical activity</li>
                    <li>Limit caffeine, alcohol, and nicotine</li>
                    <li>Practice time management and set boundaries</li>
                    <li>Build a strong support network</li>
                  </ul>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Developing Healthy Habits</h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Start small - focus on one habit at a time</li>
                    <li>Set specific, achievable goals</li>
                    <li>Track your progress using your stress journal</li>
                    <li>Build in regular self-care activities</li>
                    <li>Celebrate small victories</li>
                    <li>Be patient and compassionate with yourself</li>
                  </ol>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-lg">When to Seek Professional Help</h3>
                <p className="mt-2">
                  While self-management techniques are effective for many, it's important to recognize 
                  when professional help might be needed. Consider seeking support if:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Stress is significantly impacting your daily functioning</li>
                  <li>You're experiencing persistent anxiety or depression</li>
                  <li>You're relying on substances to cope</li>
                  <li>You've experienced traumatic events</li>
                  <li>Self-help strategies aren't providing relief</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Resources Section */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Additional Resources</CardTitle>
              </div>
              <CardDescription>Helpful books, apps, and websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg">Books</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Why Zebras Don't Get Ulcers</h4>
                      <p className="text-sm text-gray-600">By Robert M. Sapolsky</p>
                      <p className="text-sm mt-1">
                        An accessible exploration of how prolonged stress affects physical health
                      </p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">The Upside of Stress</h4>
                      <p className="text-sm text-gray-600">By Kelly McGonigal</p>
                      <p className="text-sm mt-1">
                        A new perspective on stress and how changing your mindset can improve resilience
                      </p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Full Catastrophe Living</h4>
                      <p className="text-sm text-gray-600">By Jon Kabat-Zinn</p>
                      <p className="text-sm mt-1">
                        A practical guide to mindfulness-based stress reduction
                      </p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Burnout</h4>
                      <p className="text-sm text-gray-600">By Emily Nagoski and Amelia Nagoski</p>
                      <p className="text-sm mt-1">
                        Explores the science behind stress and burnout with practical solutions
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">Websites & Organizations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">National Institute of Mental Health</h4>
                      <p className="text-sm mt-1">
                        Research-based information on stress and mental health
                      </p>
                      <a href="https://www.nimh.nih.gov/health/topics/stress" target="_blank" rel="noopener noreferrer" className="text-primary text-sm inline-block mt-2">
                        Visit website →
                      </a>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">The American Institute of Stress</h4>
                      <p className="text-sm mt-1">
                        Education and resources for stress management
                      </p>
                      <a href="https://www.stress.org" target="_blank" rel="noopener noreferrer" className="text-primary text-sm inline-block mt-2">
                        Visit website →
                      </a>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Mental Health America</h4>
                      <p className="text-sm mt-1">
                        Tools and resources for mental wellness
                      </p>
                      <a href="https://www.mhanational.org/conditions/stress" target="_blank" rel="noopener noreferrer" className="text-primary text-sm inline-block mt-2">
                        Visit website →
                      </a>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Anxiety and Depression Association of America</h4>
                      <p className="text-sm mt-1">
                        Information, resources, and support for anxiety and stress
                      </p>
                      <a href="https://adaa.org" target="_blank" rel="noopener noreferrer" className="text-primary text-sm inline-block mt-2">
                        Visit website →
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg">Mobile Apps</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Headspace</h4>
                      <p className="text-sm mt-1">
                        Guided meditation and mindfulness exercises
                      </p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Calm</h4>
                      <p className="text-sm mt-1">
                        Sleep stories, meditation, and relaxing music
                      </p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Insight Timer</h4>
                      <p className="text-sm mt-1">
                        Free library of guided meditations
                      </p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Breathe2Relax</h4>
                      <p className="text-sm mt-1">
                        Diaphragmatic breathing exercises
                      </p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">Woebot</h4>
                      <p className="text-sm mt-1">
                        AI chatbot using CBT techniques
                      </p>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h4 className="font-medium">MoodKit</h4>
                      <p className="text-sm mt-1">
                        Activities based on CBT principles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Myths vs Facts Section */}
        <TabsContent value="myth-vs-fact" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <CardTitle>Stress Myths vs. Facts</CardTitle>
              </div>
              <CardDescription>Separating stress misinformation from reality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  There are many common misconceptions about stress that can affect how we understand 
                  and manage it. Here's what the science actually tells us:
                </p>
                
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="border-l-4 border-red-400 pl-4 py-2">
                      <h3 className="font-medium">MYTH: All stress is bad for you</h3>
                      <p className="text-sm mt-1">
                        Many people believe that all forms of stress have negative effects on health and should be 
                        completely eliminated.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4 py-2">
                      <h3 className="font-medium">FACT: Some stress can be beneficial</h3>
                      <p className="text-sm mt-1">
                        Short-term, moderate stress (eustress) can enhance motivation, focus, and performance. 
                        It can help you rise to challenges and grow from experiences.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-red-400 pl-4 py-2">
                      <h3 className="font-medium">MYTH: Stress is all in your mind</h3>
                      <p className="text-sm mt-1">
                        Some believe that stress is purely psychological and has no real physical effects.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4 py-2">
                      <h3 className="font-medium">FACT: Stress has real physiological effects</h3>
                      <p className="text-sm mt-1">
                        Stress triggers measurable physical changes including hormone release, increased heart rate, 
                        blood pressure changes, and immune system impacts.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-red-400 pl-4 py-2">
                      <h3 className="font-medium">MYTH: Everyone experiences stress the same way</h3>
                      <p className="text-sm mt-1">
                        The assumption that stress affects everyone equally and in the same manner.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4 py-2">
                      <h3 className="font-medium">FACT: Stress responses vary greatly</h3>
                      <p className="text-sm mt-1">
                        People have different thresholds, triggers, and reactions to stress based on genetics, 
                        personality, experiences, and coping skills.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-red-400 pl-4 py-2">
                      <h3 className="font-medium">MYTH: Successful people don't feel stressed</h3>
                      <p className="text-sm mt-1">
                        The belief that high achievers handle pressure effortlessly without stress.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4 py-2">
                      <h3 className="font-medium">FACT: Success often comes with stress</h3>
                      <p className="text-sm mt-1">
                        Many successful people experience significant stress; they've learned to manage it effectively 
                        rather than eliminating it entirely.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-red-400 pl-4 py-2">
                      <h3 className="font-medium">MYTH: You can't control stress</h3>
                      <p className="text-sm mt-1">
                        The idea that stress is entirely external and beyond our control.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4 py-2">
                      <h3 className="font-medium">FACT: Many aspects of stress are manageable</h3>
                      <p className="text-sm mt-1">
                        While we can't control all stressors, we can control our response to stress through 
                        various techniques and lifestyle changes.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-red-400 pl-4 py-2">
                      <h3 className="font-medium">MYTH: Only major events cause stress</h3>
                      <p className="text-sm mt-1">
                        The belief that only big life changes or traumatic events can cause significant stress.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4 py-2">
                      <h3 className="font-medium">FACT: Daily hassles accumulate</h3>
                      <p className="text-sm mt-1">
                        Small daily stressors like traffic, deadlines, or arguments can accumulate and have 
                        significant cumulative effects on health.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-red-400 pl-4 py-2">
                      <h3 className="font-medium">MYTH: Sleep deprivation is unrelated to stress</h3>
                      <p className="text-sm mt-1">
                        The idea that lack of sleep and stress are separate issues.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4 py-2">
                      <h3 className="font-medium">FACT: Sleep and stress are interconnected</h3>
                      <p className="text-sm mt-1">
                        Poor sleep increases stress hormones, while stress can disrupt sleep quality, creating 
                        a cyclical relationship.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-red-400 pl-4 py-2">
                      <h3 className="font-medium">MYTH: Ignoring stress makes it go away</h3>
                      <p className="text-sm mt-1">
                        The belief that avoiding thinking about stressors will make them disappear.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-400 pl-4 py-2">
                      <h3 className="font-medium">FACT: Unaddressed stress tends to worsen</h3>
                      <p className="text-sm mt-1">
                        Avoiding or suppressing stress often intensifies it. Acknowledging and addressing stress 
                        with appropriate techniques is more effective.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-accent p-4 rounded-lg mt-6">
                  <h3 className="font-medium mb-2">Key Takeaways</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Stress is a normal part of life that can be both helpful and harmful</li>
                    <li>Individual stress responses vary widely</li>
                    <li>Most stress can be managed effectively with the right tools and techniques</li>
                    <li>Understanding stress facts helps develop better coping strategies</li>
                    <li>Professional help is available and effective when self-management isn't enough</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StressEducation;