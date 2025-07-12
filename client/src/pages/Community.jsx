import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const typewriterPhrases = [
  'Share your thoughts, tips, and stories with fellow ReWear members!',
  'Inspire others with your sustainable fashion journey.',
  'Ask questions, give advice, and connect with the community.',
  'Every thought makes ReWear better!'
];

const Community = () => {
  const { user } = useAuth ? useAuth() : { user: null };
  const [thoughts, setThoughts] = useState([]);
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Typewriter effect state
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterChar, setTypewriterChar] = useState(0);

  // Typewriter effect logic
  useEffect(() => {
    setTypewriterText('');
    setTypewriterChar(0);
    const phrase = typewriterPhrases[typewriterIndex];
    if (!phrase) return;
    const interval = setInterval(() => {
      setTypewriterText((prev) => {
        if (prev.length < phrase.length) {
          return phrase.slice(0, prev.length + 1);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setTypewriterIndex((idx) => (idx + 1) % typewriterPhrases.length);
          }, 1800);
          return prev;
        }
      });
    }, 38);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [typewriterIndex]);

  // Fetch thoughts from backend
  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/community/thoughts');
        setThoughts(res.data.thoughts);
      } catch (err) {
        setThoughts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchThoughts();
  }, []);

  const handleAddThought = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post('/api/community/thoughts', {
        user: user?.name || 'Anonymous',
        text: input
      });
      setThoughts([res.data.thought, ...thoughts]);
      setInput('');
    } catch (err) {
      alert('Failed to post thought');
    }
    setSubmitting(false);
  };

  return (
    <div
      style={{ width: '100vw', minHeight: '100vh', overflowX: 'hidden' }}
    >
      {/* Animated Header */}
      <div className="w-full text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-fade-in-down">
          Welcome to the Community
        </h1>
        <p className="mt-3 text-lg text-slate-300 animate-fade-in-up min-h-[2.5rem]">
          <span className="typewriter-cursor">{typewriterText}</span>
        </p>
      </div>

      {/* Add Your Thought */}
      <form onSubmit={handleAddThought} className="w-full flex flex-col sm:flex-row items-center gap-3 mb-8 animate-fade-in-up justify-center">
        <input
          type="text"
          className="flex-1 max-w-2xl px-5 py-3 rounded-full border border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-800 text-slate-100 placeholder-slate-400 shadow-sm"
          placeholder="Add your thought..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={submitting}
          maxLength={180}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-60"
          disabled={submitting || !input.trim()}
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </form>

      {/* Thoughts Feed */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading community thoughts...</p>
          </div>
        ) : thoughts.length > 0 ? (
          thoughts.map((thought, idx) => (
            <div
              key={thought._id || thought.id}
              className={`bg-slate-800 border border-slate-700 rounded-xl px-6 py-4 shadow-sm flex flex-col gap-1 animate-fade-in ${idx === 0 && submitting ? 'opacity-50' : 'opacity-100'}`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-blue-400">{thought.user}</span>
                <span className="text-xs text-slate-400">{new Date(thought.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <p className="text-slate-100 text-base break-words">{thought.text}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-slate-400 mb-2">No thoughts yet</p>
            <p className="text-slate-400 text-sm">Be the first to share your thought with the community!</p>
          </div>
        )}
      </div>

      {/* Animations & Typewriter Cursor */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-down { animation: fadeInDown 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-24px);} to { opacity: 1; transform: none; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px);} to { opacity: 1; transform: none; } }
        .typewriter-cursor:after { content: ''; display: inline-block; width: 1ch; height: 1.2em; background: currentColor; margin-left: 2px; animation: blink 1s steps(1) infinite; vertical-align: middle; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};

export default Community; 