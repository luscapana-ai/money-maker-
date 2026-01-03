import React, { useEffect, useState } from 'react';
import { streamMarketTrends } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { TrendingUp, RefreshCw } from 'lucide-react';

const MarketTrends: React.FC = () => {
  const [trends, setTrends] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchTrends = async () => {
    setLoading(true);
    setTrends('');
    try {
      await streamMarketTrends((chunk) => {
        setTrends(prev => prev + chunk);
      });
    } catch (e) {
      setTrends("Could not load trends. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTrends();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex items-center gap-3">
          <TrendingUp className="text-pink-500 w-8 h-8" />
          Live Market Trends
        </h2>
        <button 
          onClick={fetchTrends}
          disabled={loading}
          className="p-2 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 shadow-2xl min-h-[400px]">
        {loading && !trends && (
          <div className="flex items-center justify-center h-64 text-slate-500 gap-2 animate-pulse">
             Fetching latest market intelligence...
          </div>
        )}
        <div className="prose prose-lg prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-li:text-slate-300 prose-strong:text-cyan-400">
          <ReactMarkdown>{trends}</ReactMarkdown>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 p-6 rounded-lg">
          <h3 className="font-bold text-indigo-300 mb-2">Micro-SaaS Niche</h3>
          <p className="text-sm text-slate-400">Building small, specialized tools for specific industries (e.g., "CRM for Dog Walkers") is trending. Low competition, high retention.</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/30 p-6 rounded-lg">
          <h3 className="font-bold text-emerald-300 mb-2">AI Wrappers -> Agents</h3>
          <p className="text-sm text-slate-400">Apps are moving from simple text-generation wrappers to autonomous agents that perform tasks (booking, ordering, coding).</p>
        </div>
      </div>
    </div>
  );
};

export default MarketTrends;