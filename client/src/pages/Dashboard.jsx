import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItemModal from './ListItem';

const stats = [
  { label: 'Total Items Listed', value: '1,247' },
  { label: 'Swaps Completed', value: '342' },
  { label: 'Items Awaiting Approval', value: '12' },
  { label: 'Flagged Items', value: '3' },
];

const featuredItems = [
  { 
    title: 'Vintage Denim Jacket', 
    subtitle: 'Size M • 120 points',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop'
  },
  { 
    title: 'Summer Floral Dress', 
    subtitle: 'Size S • 95 points',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'
  },
  { 
    title: 'Designer Sneakers', 
    subtitle: 'Size 9 • 150 points',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
  },
  { 
    title: 'Wool Coat', 
    subtitle: 'Size L • 110 points',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'
  },
  { 
    title: 'Silk Blouse', 
    subtitle: 'Size M • 80 points',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
  },
];

const phrases = [
  "Swap. Share. Sustain.",
  "Fashion with Purpose.",
  "Sustainable Style.",
  "ReWear the Future."
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let typingSpeed = 100;
    let pause = 1200;
    const currentPhrase = phrases[currentPhraseIndex];

    if (!isDeleting && charIndex <= currentPhrase.length) {
      if (charIndex === currentPhrase.length) {
        typingSpeed = pause;
        setTimeout(() => setIsDeleting(true), pause);
      } else {
        setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      }
    } else if (isDeleting && charIndex >= 0) {
      if (charIndex === 0) {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 50);
      }
    }
    // eslint-disable-next-line
  }, [charIndex, isDeleting, currentPhraseIndex]);

  useEffect(() => {
    // Reset charIndex when phrase changes
    if (!isDeleting) setCharIndex(0);
    // eslint-disable-next-line
  }, [currentPhraseIndex]);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 py-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {displayText}
              <span className={`inline-block w-1 h-12 bg-blue-600 ml-1 ${!isDeleting ? 'animate-pulse' : 'opacity-0'}`}></span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
              ReWear your fashion, not the planet. Join our community of conscious fashion lovers trading preloved pieces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                Start Swapping →
              </button>
              <button 
                onClick={() => navigate('/browse')}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Browse Items
              </button>
              <button
                onClick={() => navigate('/list')}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                List an Item
              </button>
            </div>
          </div>
          <div className="flex-1 w-full flex justify-center">
            <div className="w-full max-w-md h-80 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-800 dark:to-blue-800 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=400&fit=crop" 
                alt="Sustainable Fashion" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Items */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Featured Items
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {featuredItems.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="h-32 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
