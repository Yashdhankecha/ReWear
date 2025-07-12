import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('mission');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleAiQuestion = async (question) => {
    setIsLoadingAi(true);
    // Simulate AI response - in a real app, this would call an AI API
    setTimeout(() => {
      const responses = {
        sustainability: "ReWear promotes sustainability by extending the lifecycle of clothing items. Each swap reduces textile waste and carbon footprint. Our community has saved over 10,000 items from landfills!",
        community: "Our community is built on trust and shared values. Users can rate each other, build profiles, and connect through their love for sustainable fashion.",
        points: "Points are earned by contributing quality items and maintaining good community standing. They can be used to request items from other users or unlock premium features."
      };
      setAiResponse(responses[question] || "I'm here to help with any questions about ReWear!");
      setIsLoadingAi(false);
    }, 1500);
  };

  const stats = [
    { number: '10,000+', label: 'Items Swapped', icon: '🔄' },
    { number: '5,000+', label: 'Active Users', icon: '👥' },
    { number: '50,000+', label: 'CO2 Saved (kg)', icon: '🌱' },
    { number: '95%', label: 'User Satisfaction', icon: '⭐' }
  ];

  const features = [
    {
      title: 'Smart Matching',
      description: 'AI-powered recommendations based on your style preferences and size',
      icon: '🤖',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Quality Assurance',
      description: 'All items are verified for condition and authenticity',
      icon: '✅',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Community Trust',
      description: 'Built-in rating system and user verification',
      icon: '🤝',
      color: 'from-orange-500 to-red-600'
    },
    {
      title: 'Sustainable Impact',
      description: 'Track your environmental contribution with detailed metrics',
      icon: '🌍',
      color: 'from-teal-500 to-cyan-600'
    }
  ];

  const team = [
    {
      name: 'Yash Dhankecha',
      role: 'MERN Stack Developer',
      bio: 'Full-stack developer passionate about creating sustainable and user-friendly web applications',
      avatar: '👨‍💻'
    },
    {
      name: 'Karansinh Desai',
      role: 'MERN Stack Developer',
      bio: 'Experienced developer focused on building scalable and efficient backend systems',
      avatar: '👨‍💻'
    },
    {
      name: 'Harsh Vyas',
      role: 'MERN Stack Developer',
      bio: 'Frontend specialist with expertise in modern React applications and responsive design',
      avatar: '👨‍💻'
    },
    {
      name: 'Asad Ahmed Saiyed',
      role: 'MERN Stack Developer',
      bio: 'Full-stack developer dedicated to creating innovative and sustainable solutions',
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 w-full">
      <div className="w-full px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 w-full">
          <h1 className="text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ReWear</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing fashion by creating a sustainable community where style meets responsibility. 
            Join thousands of conscious consumers making a difference, one swap at a time.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 w-full">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-600 hover:border-blue-500 transition-all duration-300 hover:scale-105"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 w-full">
          {['mission', 'features', 'team', 'ai'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeSection === section
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Mission Section */}
        {activeSection === 'mission' && (
          <div className="w-full">
            <div className="grid md:grid-cols-2 gap-8 w-full">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-slate-300 leading-relaxed">
                  ReWear was born from a simple yet powerful idea: what if we could create a world where 
                  every piece of clothing gets a second life? We're building a community that values 
                  sustainability, quality, and connection.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Our platform uses cutting-edge AI to match users with items that fit their style and 
                  preferences, making sustainable fashion accessible and enjoyable for everyone.
                </p>
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-4">
                  <h3 className="text-green-400 font-semibold mb-2">🌱 Environmental Impact</h3>
                  <p className="text-slate-300 text-sm">
                    Every item swapped saves approximately 2.5kg of CO2 emissions and prevents textile waste from landfills.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
                <p className="text-slate-300 leading-relaxed">
                  We envision a future where sustainable fashion is the norm, not the exception. A world 
                  where communities thrive through shared resources and conscious consumption.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-300">Zero waste fashion ecosystem</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-300">AI-powered personalization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-300">Global community of conscious consumers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {activeSection === 'features' && (
          <div className="w-full">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose ReWear?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600 hover:border-blue-500 transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Section */}
        {activeSection === 'team' && (
          <div className="w-full">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {team.map((member, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-600 hover:border-blue-500 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-5xl mb-4">{member.avatar}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-blue-400 font-medium mb-3 text-sm">{member.role}</p>
                  <p className="text-slate-300 text-xs leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Assistant Section */}
        {activeSection === 'ai' && (
          <div className="w-full">
            <div className="w-[96vw] ml-[1vw] bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-600">
              <div className="text-center mb-8">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-white mb-2">Ask Our AI Assistant</h3>
                <p className="text-slate-300">Get instant answers about ReWear, sustainability, and our community</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => handleAiQuestion('sustainability')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg hover:scale-105 transition-all duration-300"
                >
                  🌱 Sustainability
                </button>
                <button
                  onClick={() => handleAiQuestion('community')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg hover:scale-105 transition-all duration-300"
                >
                  👥 Community
                </button>
                <button
                  onClick={() => handleAiQuestion('points')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-lg hover:scale-105 transition-all duration-300"
                >
                  ⭐ Points System
                </button>
              </div>
              {isLoadingAi && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-300">AI is thinking...</p>
                </div>
              )}
              {aiResponse && !isLoadingAi && (
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">AI</span>
                    </div>
                    <span className="text-blue-400 font-medium">ReWear Assistant</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{aiResponse}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 w-full">
          <h2 className="text-3xl font-bold text-white mb-6">Join the ReWear Revolution</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Be part of a community that's changing the way we think about fashion. 
            Start swapping, start saving, start making a difference.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Get Started Today
            </button>
          </div>
        </div>
    </div>
  </div>
);
};

export default About; 