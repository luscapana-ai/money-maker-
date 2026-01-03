import React, { useState } from 'react';
import { ViewState, SavedIdea } from './types';
import StrategyGenerator from './components/StrategyGenerator';
import RevenueSimulator from './components/RevenueSimulator';
import MarketTrends from './components/MarketTrends';
import AiMonetizationGuide from './components/AiMonetizationGuide';
import SavedIdeas from './components/SavedIdeas';
import CommunityChat from './components/CommunityChat';
import { LayoutDashboard, Calculator, TrendingUp, Menu, X, Rocket, Bot, BookMarked, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.STRATEGY);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [strategyInput, setStrategyInput] = useState('');
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);

  const handleUseTemplate = (template: string) => {
    setStrategyInput(template);
    setView(ViewState.STRATEGY);
  };

  const handleSaveIdea = (title: string, content: string) => {
    const newIdea: SavedIdea = {
      id: Date.now().toString(),
      title: title || "Untitled Strategy",
      content,
      date: new Date().toLocaleDateString()
    };
    setSavedIdeas(prev => [newIdea, ...prev]);
  };

  const handleDeleteIdea = (id: string) => {
    setSavedIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const navItems = [
    { id: ViewState.STRATEGY, label: 'Strategy Architect', icon: Rocket },
    { id: ViewState.SIMULATOR, label: 'Revenue Simulator', icon: Calculator },
    { id: ViewState.TRENDS, label: 'Market Trends', icon: TrendingUp },
    { id: ViewState.AI_MONETIZATION, label: 'Make Money with AI', icon: Bot },
    { id: ViewState.COMMUNITY, label: 'Founder\'s Lounge', icon: MessageSquare },
    { id: ViewState.SAVED_IDEAS, label: 'Saved Ideas', icon: BookMarked },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-950 border-r border-slate-800 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span>MonetizeAI</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800/50' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="font-medium">{item.label}</span>
                {item.id === ViewState.SAVED_IDEAS && savedIdeas.length > 0 && (
                   <span className="ml-auto bg-cyan-900 text-cyan-200 text-xs font-bold px-2 py-0.5 rounded-full">
                     {savedIdeas.length}
                   </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
           <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs text-slate-500">
             <p className="mb-2 font-semibold text-slate-400">Pro Tip:</p>
             <p>Validate your idea before building. Use the Strategy Architect to find your niche.</p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-lg text-white">MonetizeAI</span>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-slate-900 scroll-smooth">
          <div className="container mx-auto py-6">
            {view === ViewState.STRATEGY && (
              <StrategyGenerator 
                input={strategyInput} 
                setInput={setStrategyInput} 
                onSave={handleSaveIdea}
              />
            )}
            {view === ViewState.SIMULATOR && <RevenueSimulator />}
            {view === ViewState.TRENDS && <MarketTrends />}
            {view === ViewState.AI_MONETIZATION && (
              <AiMonetizationGuide onUseTemplate={handleUseTemplate} />
            )}
            {view === ViewState.COMMUNITY && (
              <CommunityChat />
            )}
            {view === ViewState.SAVED_IDEAS && (
              <SavedIdeas ideas={savedIdeas} onDelete={handleDeleteIdea} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;