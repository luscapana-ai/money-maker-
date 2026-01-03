import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Wifi, WifiOff, MessageSquare } from 'lucide-react';
import { CommunityMessage } from '../types';

// Mock WebSocket Service to simulate real-time interaction in a serverless environment
class MockWebSocket {
  private listeners: ((data: any) => void)[] = [];
  private intervalId: any;
  private users = ['Alex_Dev', 'Sarah_SaaS', 'Mike_Product', 'Growth_Guru', 'CodeNinja'];
  private phrases = [
    "Has anyone tried the new subscription model?",
    "Gemini Flash is incredibly fast for my wrapper app.",
    "What's a good churn rate for a B2B app?",
    "Just launched on Product Hunt! 🚀",
    "I'm struggling with user acquisition for my AI tool.",
    "The revenue simulator here is actually pretty accurate.",
    "Anyone want to partner up on a fitness app?",
    "Focus on distribution, not just features!",
  ];

  constructor(onOpen: () => void) {
    setTimeout(() => {
      onOpen();
      this.startSimulation();
    }, 1000);
  }

  send(data: string) {
    // Echo back to simulate server confirmation (if needed), 
    // but usually we add our own message to UI immediately.
  }

  onMessage(callback: (data: any) => void) {
    this.listeners.push(callback);
  }

  private startSimulation() {
    // Simulate incoming messages every few seconds
    this.intervalId = setInterval(() => {
      const randomUser = this.users[Math.floor(Math.random() * this.users.length)];
      const randomPhrase = this.phrases[Math.floor(Math.random() * this.phrases.length)];
      
      const message = {
        type: 'message',
        data: {
          id: Date.now().toString(),
          user: randomUser,
          text: randomPhrase,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          avatarColor: this.getRandomColor()
        }
      };
      
      this.notify(message);
    }, 5000 + Math.random() * 5000); // Random interval between 5-10s
  }

  private notify(data: any) {
    this.listeners.forEach(l => l(data));
  }

  private getRandomColor() {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  close() {
    clearInterval(this.intervalId);
  }
}

const CommunityChat: React.FC = () => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(12);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<MockWebSocket | null>(null);

  useEffect(() => {
    // Initialize Mock Connection
    socketRef.current = new MockWebSocket(() => {
      setIsConnected(true);
      // specific initial message
      setMessages([{
        id: 'system-1',
        user: 'System',
        text: 'Welcome to the Founder\'s Lounge! This is a live feed of developers discussing strategy.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
        avatarColor: 'bg-cyan-600'
      }]);
    });

    socketRef.current.onMessage((event) => {
      if (event.type === 'message') {
        setMessages(prev => [...prev, event.data]);
        // Randomly fluctuate online users
        setOnlineUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
    });

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: CommunityMessage = {
      id: Date.now().toString(),
      user: 'You',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      avatarColor: 'bg-blue-600'
    };

    setMessages(prev => [...prev, newMessage]);
    socketRef.current?.send(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-6xl mx-auto p-4 md:p-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-violet-500 to-fuchsia-600 p-2.5 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Founder's Lounge</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
               <span className="flex items-center gap-1">
                 <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                 {isConnected ? 'Live Connection' : 'Connecting...'}
               </span>
               <span className="text-slate-600">|</span>
               <span className="flex items-center gap-1">
                 <Users className="w-3 h-3" /> {onlineUsers} Online
               </span>
            </div>
          </div>
        </div>
        <div className="hidden md:block text-xs text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
          WebSocket Status: <span className="text-cyan-400 font-mono">{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/30">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shrink-0
                  ${msg.isMe ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : (msg.avatarColor || 'bg-slate-600')}
                `}>
                  {msg.user.substring(0, 2).toUpperCase()}
                </div>
                
                {/* Message Bubble */}
                <div className={`max-w-[80%] md:max-w-[70%]`}>
                  <div className={`
                    flex items-baseline gap-2 mb-1 px-1
                    ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}
                  `}>
                    <span className="text-xs font-medium text-slate-300">{msg.user}</span>
                    <span className="text-[10px] text-slate-600">{msg.timestamp}</span>
                  </div>
                  <div className={`
                    p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.isMe 
                      ? 'bg-cyan-900/40 text-cyan-50 border border-cyan-800/50 rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-none'}
                  `}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Share a thought or ask a question..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/20 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Sidebar (Desktop only) */}
        <div className="hidden lg:flex flex-col w-64 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80">
            <h3 className="text-sm font-semibold text-slate-300">Active Topics</h3>
          </div>
          <div className="p-2 space-y-1">
            {['#general-chat', '#revenue-models', '#tech-stack', '#marketing', '#ai-trends'].map((channel) => (
              <button key={channel} className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-colors flex items-center gap-2">
                <span className="text-slate-600">#</span> {channel.replace('#', '')}
              </button>
            ))}
          </div>
          
          <div className="mt-auto p-4 border-t border-slate-800 bg-slate-950/30">
            <div className="text-xs text-slate-500 text-center">
              Joined as <strong className="text-slate-300">Guest User</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityChat;