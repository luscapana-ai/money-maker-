import React, { useState } from 'react';
import { SavedIdea } from '../types';
import { Trash2, Calendar, BookMarked, ArrowRight, X, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface SavedIdeasProps {
  ideas: SavedIdea[];
  onDelete: (id: string) => void;
}

const SavedIdeas: React.FC<SavedIdeasProps> = ({ ideas, onDelete }) => {
  const [selectedIdea, setSelectedIdea] = useState<SavedIdea | null>(null);

  // Helper to strip markdown for preview text
  const getPreviewText = (text: string) => {
    return text
      .replace(/[#*`_\[\]]/g, '') // Remove common markdown characters
      .replace(/\n\n/g, ' ')      // Replace double newlines
      .trim()
      .substring(0, 160) + (text.length > 160 ? '...' : '');
  };

  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-slate-400 space-y-4">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center ring-1 ring-slate-700">
          <BookMarked className="w-10 h-10 opacity-50" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-200">No saved ideas yet</h3>
          <p className="mt-2 max-w-sm mx-auto text-slate-500">
            Generate a strategy in the Architect view and click "Save Idea" to build your collection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
        <div className="bg-cyan-900/20 p-3 rounded-xl">
          <BookMarked className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Saved Ideas</h2>
          <p className="text-slate-400">Your collection of monetization strategies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea) => (
          <div 
            key={idea.id} 
            className="group relative bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 flex flex-col h-full hover:bg-slate-800/60 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedIdea(idea)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                💡
              </div>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1 bg-slate-900/50 px-2 py-1 rounded border border-slate-800">
                <Calendar className="w-3 h-3" /> {idea.date}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-3 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">
              {idea.title}
            </h3>

            <p className="text-sm text-slate-400 mb-6 flex-grow line-clamp-4 leading-relaxed">
              {getPreviewText(idea.content)}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
              <span className="text-sm font-medium text-cyan-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                View Strategy <ArrowRight className="w-4 h-4" />
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(idea.id);
                }}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors z-10"
                title="Delete idea"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Screen Modal */}
      {selectedIdea && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedIdea(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900 rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
                  💡
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white line-clamp-1">{selectedIdea.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Generated on {selectedIdea.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this idea?')) {
                      onDelete(selectedIdea.id);
                      setSelectedIdea(null);
                    }
                  }}
                  className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
              <div className="prose prose-invert prose-cyan max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="relative my-6 rounded-lg overflow-hidden border border-slate-800 shadow-md">
                           <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                             <span className="text-xs text-slate-500 font-mono uppercase">{match[1]}</span>
                           </div>
                           <SyntaxHighlighter
                             {...props}
                             style={vscDarkPlus}
                             language={match[1]}
                             PreTag="div"
                             customStyle={{ margin: 0, padding: '1.5rem', background: '#020617' }}
                           >
                             {String(children).replace(/\n$/, '')}
                           </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code {...props} className={`${className} bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700/50`}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({children}) => <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-semibold text-slate-100 border-b border-slate-800 pb-2 mt-8 mb-4">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-medium text-cyan-100 mt-6 mb-3">{children}</h3>,
                    p: ({children}) => <p className="text-slate-300 leading-relaxed mb-4">{children}</p>,
                    li: ({children}) => <li className="text-slate-300 mb-1">{children}</li>,
                    strong: ({children}) => <strong className="text-cyan-400 font-semibold">{children}</strong>,
                    table: ({children}) => <div className="overflow-x-auto my-6 border border-slate-700 rounded-lg"><table className="w-full text-left border-collapse bg-slate-900">{children}</table></div>,
                    thead: ({children}) => <thead className="bg-slate-950 text-slate-200">{children}</thead>,
                    th: ({children}) => <th className="p-4 border-b border-r border-slate-800 font-semibold last:border-r-0 text-cyan-400/90 whitespace-nowrap">{children}</th>,
                    td: ({children}) => <td className="p-4 border-b border-r border-slate-800 last:border-r-0 text-slate-300">{children}</td>,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-cyan-500 pl-4 py-1 my-4 bg-slate-800/30 rounded-r-lg italic text-slate-400">{children}</blockquote>
                  }}
                >
                  {selectedIdea.content}
                </ReactMarkdown>
              </div>
            </div>
            
            <div className="md:hidden border-t border-slate-800 p-4 bg-slate-900 rounded-b-2xl">
               <button
                  onClick={() => {
                    if(confirm('Are you sure you want to delete this idea?')) {
                      onDelete(selectedIdea.id);
                      setSelectedIdea(null);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" /> Delete Strategy
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedIdeas;