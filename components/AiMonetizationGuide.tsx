import React, { useEffect, useState } from 'react';
import { streamAiMonetizationTips } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Bot, Lightbulb, RefreshCw, Copy, Check } from 'lucide-react';

interface AiMonetizationGuideProps {
  onUseTemplate: (template: string) => void;
}

const AiMonetizationGuide: React.FC<AiMonetizationGuideProps> = ({ onUseTemplate }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchGuide = async () => {
    setLoading(true);
    setContent('');
    try {
      await streamAiMonetizationTips((chunk) => {
        setContent(prev => prev + chunk);
      });
    } catch (e) {
      setContent("Could not load the guide. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuide();
  }, []);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center gap-3">
            <Bot className="text-emerald-400 w-8 h-8" />
            Make Money with AI
          </h2>
          <p className="text-slate-400 mt-2">Actionable paths to revenue using Artificial Intelligence.</p>
        </div>
        
        <button 
          onClick={fetchGuide}
          disabled={loading}
          className="p-2 bg-slate-800 border border-slate-700 rounded-full hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 shadow-2xl min-h-[400px]">
        {loading && !content && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-4 animate-pulse">
             <Lightbulb className="w-8 h-8 opacity-50" />
             <p>Generating expert guide...</p>
          </div>
        )}
        <div className="prose prose-lg prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-li:text-slate-300 prose-strong:text-emerald-400">
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
                     <div className="relative group rounded-lg overflow-hidden my-6 border border-slate-700/50 text-base">
                       <div className="flex justify-between items-center bg-slate-900 px-4 py-2 border-b border-slate-800">
                         <span className="text-xs text-slate-400 font-mono">{match![1]}</span>
                         <button 
                           onClick={() => copyToClipboard(textContent, codeIndex)}
                           className="text-slate-400 hover:text-emerald-400 transition-colors"
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
                         customStyle={{ margin: 0, padding: '1.5rem', background: '#0f172a' }}
                       >
                         {textContent}
                       </SyntaxHighlighter>
                     </div>
                   );
                 }
                 return (
                   <code {...props} className={`${className} bg-slate-700/50 text-emerald-200 px-1.5 py-0.5 rounded text-sm font-mono`}>
                     {children}
                   </code>
                 );
               },
               table({children}) {
                  return <div className="overflow-x-auto my-6 border border-slate-700 rounded-lg shadow-sm"><table className="w-full text-left border-collapse bg-slate-900/50">{children}</table></div>
               },
               thead({children}) {
                  return <thead className="bg-slate-900 text-slate-200 border-b border-slate-700">{children}</thead>
               },
               th({children}) {
                  return <th className="p-4 border-r border-slate-700 font-semibold last:border-r-0 text-emerald-400/90 whitespace-nowrap">{children}</th>
               },
               td({children}) {
                  return <td className="p-4 border-b border-r border-slate-700 last:border-r-0 text-slate-300">{children}</td>
               }
             }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      
      {/* Static Quick Cards - Interactive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onUseTemplate("I want to build an AI wrapper for a specific niche (e.g. Resume Rewriter). How should I monetize it?")}
          className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800/60 transition cursor-pointer group"
        >
           <div className="w-10 h-10 bg-emerald-900/50 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <span className="text-xl">🚀</span>
           </div>
           <h3 className="font-semibold text-slate-200 mb-2">Build a Wrapper</h3>
           <p className="text-sm text-slate-400 mb-4">Solve one specific problem using Gemini API (e.g., "Resume Rewriter").</p>
           <span className="text-xs text-emerald-400 font-medium">Click to Generate Strategy &rarr;</span>
        </div>
        
         <div 
           onClick={() => onUseTemplate("I want to start a B2B AI Automation Agency for local businesses. Create a business plan.")}
           className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800/60 transition cursor-pointer group"
         >
           <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <span className="text-xl">👔</span>
           </div>
           <h3 className="font-semibold text-slate-200 mb-2">B2B Automation</h3>
           <p className="text-sm text-slate-400 mb-4">Help local businesses automate emails and support using AI agents.</p>
           <span className="text-xs text-emerald-400 font-medium">Click to Generate Strategy &rarr;</span>
        </div>

         <div 
           onClick={() => onUseTemplate("I want to create an educational course about using AI tools. How should I structure and price it?")}
           className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800/60 transition cursor-pointer group"
         >
           <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <span className="text-xl">🎓</span>
           </div>
           <h3 className="font-semibold text-slate-200 mb-2">Education</h3>
           <p className="text-sm text-slate-400 mb-4">Create tutorials or courses on how to use new AI tools efficiently.</p>
           <span className="text-xs text-emerald-400 font-medium">Click to Generate Strategy &rarr;</span>
        </div>
      </div>
    </div>
  );
};

export default AiMonetizationGuide;