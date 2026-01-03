import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, AlertCircle, Copy, Check, BookmarkPlus, HelpCircle, Mail, Globe, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { streamStrategyAnalysis } from '../services/gemini';

interface StrategyGeneratorProps {
  input: string;
  setInput: (value: string) => void;
  onSave: (title: string, content: string) => void;
}

const StrategyGenerator: React.FC<StrategyGeneratorProps> = ({ input, setInput, onSave }) => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResult('');
    setError(null);
    setIsSaved(false);
    
    try {
      await streamStrategyAnalysis(input, (chunk) => {
        setResult(prev => prev + chunk);
      });
    } catch (err) {
      setError("Failed to generate strategy. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (result && input) {
      onSave(input, result);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  useEffect(() => {
    // Scroll to bottom functionality is less relevant without a fixed height container,
    // but we can keep it if we want to auto-scroll the window, 
    // though usually standard behavior is better for long documents.
  }, [result, isLoading]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* Header & Intro */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          AI Strategy Architect
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Turn your raw app idea into a complete business plan.
        </p>
      </div>

      {/* Tutorial / How It Works Section */}
      {!result && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/20 p-6 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-cyan-900/30 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/20">1</div>
            <h3 className="font-semibold text-slate-200">Describe Idea</h3>
            <p className="text-xs text-slate-500">Input your concept, target audience, or problem statement.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2 relative">
            <div className="hidden md:block absolute top-5 -left-1/2 w-full h-[1px] bg-slate-800 -z-10"></div>
            <div className="w-10 h-10 rounded-full bg-purple-900/30 text-purple-400 flex items-center justify-center font-bold border border-purple-500/20">2</div>
            <h3 className="font-semibold text-slate-200">AI Analysis</h3>
            <p className="text-xs text-slate-500">Gemini analyzes market trends, competitors, and models.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
             <div className="hidden md:block absolute top-5 -left-1/2 w-full h-[1px] bg-slate-800 -z-10"></div>
            <div className="w-10 h-10 rounded-full bg-emerald-900/30 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">3</div>
            <h3 className="font-semibold text-slate-200">Get Roadmap</h3>
            <p className="text-xs text-slate-500">Receive a detailed step-by-step execution plan.</p>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-xl relative z-10">
        <div className="relative">
          <textarea
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none h-32"
            placeholder="e.g., A fitness app for busy parents that uses AI to generate 15-minute workouts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !input.trim()}
            className="absolute bottom-4 right-4 bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div 
          ref={resultRef}
          className="bg-slate-800/80 border border-slate-700 rounded-xl p-8 shadow-2xl custom-markdown min-h-[500px]"
        >
           <div className="flex items-center justify-between mb-6 text-cyan-400 border-b border-slate-700 pb-4 sticky top-0 bg-slate-800/95 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <h3 className="font-bold text-xl">Strategic Blueprint</h3>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaved}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSaved 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4" /> Saved
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" /> Save Idea
                  </>
                )}
              </button>
           </div>
           
           {/* Removed max-height constraint and added prose-lg for better readability */}
           <div className="prose prose-lg prose-invert prose-cyan max-w-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-headings:text-slate-100 prose-p:text-slate-300">
             <ReactMarkdown
               remarkPlugins={[remarkGfm]}
               components={{
                 code({node, inline, className, children, ...props}: any) {
                   const match = /language-(\w+)/.exec(className || '');
                   const textContent = String(children).replace(/\n$/, '');
                   const isMatch = Boolean(match);
                   
                   if (!inline && isMatch) {
                     const codeIndex = textContent.length;
                     return (
                       <div className="relative group rounded-lg overflow-hidden my-6 border border-slate-700/50 shadow-md">
                         <div className="flex justify-between items-center bg-slate-900 px-4 py-2 border-b border-slate-800">
                           <span className="text-xs text-slate-400 font-mono uppercase">{match![1]}</span>
                           <button 
                             onClick={() => copyToClipboard(textContent, codeIndex)}
                             className="text-slate-400 hover:text-cyan-400 transition-colors"
                             title="Copy code"
                           >
                             {copiedIndex === codeIndex ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                           </button>
                         </div>
                         <SyntaxHighlighter
                           {...props}
                           style={vscDarkPlus}
                           language={match![1]}
                           PreTag="div"
                           customStyle={{ margin: 0, padding: '1.5rem', background: '#0f172a', fontSize: '0.9rem' }}
                         >
                           {textContent}
                         </SyntaxHighlighter>
                       </div>
                     );
                   }
                   
                   return (
                     <code {...props} className={`${className} bg-slate-700/50 text-cyan-200 px-1.5 py-0.5 rounded text-sm font-mono`}>
                       {children}
                     </code>
                   );
                 },
                 table({children}) {
                    return <div className="overflow-x-auto my-6 border border-slate-700 rounded-lg shadow-lg"><table className="w-full text-left border-collapse bg-slate-800/50">{children}</table></div>
                 },
                 thead({children}) {
                    return <thead className="bg-slate-900 text-slate-200 border-b border-slate-700">{children}</thead>
                 },
                 th({children}) {
                    return <th className="p-4 border-r border-slate-700 font-semibold last:border-r-0 whitespace-nowrap">{children}</th>
                 },
                 td({children}) {
                    return <td className="p-4 border-b border-r border-slate-700 last:border-r-0 text-slate-300">{children}</td>
                 },
                 li({children}) {
                    return <li className="marker:text-cyan-500">{children}</li>
                 }
               }}
             >
               {result}
             </ReactMarkdown>
           </div>
        </div>
      )}
      
      {/* Example Suggestions */}
      {!result && !isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-lg hover:border-cyan-500/50 transition cursor-pointer group" onClick={() => setInput("An AI-powered recipe generator based on ingredients in your fridge.")}>
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🍳</span>
              <h4 className="font-medium text-slate-200">Recipe Generator</h4>
           </div>
           <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-lg hover:border-cyan-500/50 transition cursor-pointer group" onClick={() => setInput("A specialized project management tool for freelance graphic designers.")}>
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🎨</span>
              <h4 className="font-medium text-slate-200">Freelance Tools</h4>
           </div>
           <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-lg hover:border-cyan-500/50 transition cursor-pointer group" onClick={() => setInput("A local community app for finding pickup sports games.")}>
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🏀</span>
              <h4 className="font-medium text-slate-200">Sports Community</h4>
           </div>
        </div>
      )}
    </div>
  );
};

export default StrategyGenerator;