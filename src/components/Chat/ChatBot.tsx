'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic, X, MoreVertical, Phone, Video, Paperclip, CheckCheck, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatHistory, saveChatMessage } from '@/lib/db/indexedDB';

import { getCropCareResponse } from '@/lib/ai/gemini';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getChatHistory().then(history => {
      if (history.length > 0) {
        setMessages(history.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
      } else {
        setMessages([{
          id: '1',
          role: 'model',
          content: "Welcome to CropCare AI! 🌾\nI'm your expert farming assistant. I've been studying your fields—how can I help you optimize your harvest today?",
          timestamp: new Date()
        }]);
      }
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    saveChatMessage({ ...userMsg, timestamp: userMsg.timestamp.getTime() });
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Prepare history for Gemini
      const history = messages.slice(-5).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const result = await getCropCareResponse(currentInput, history);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: result.error ? result.message : result.text!,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
      saveChatMessage({ ...botMsg, timestamp: botMsg.timestamp.getTime() });
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const SUGGESTIONS = ["Rice fertilizer guide", "Tomato pest help", "Weather alert for Punjab"];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-32 left-8 z-[120] w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />
          <Bot size={32} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[400] bg-[#0b141a] flex flex-col md:inset-auto md:bottom-24 md:left-8 md:w-[400px] md:h-[600px] md:rounded-[32px] overflow-hidden"
          >
            {/* Header - WhatsApp Style */}
            <div className="bg-[#202c33] p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsOpen(false)} className="text-white/60 md:hidden">
                  <ChevronLeft size={24} />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Bot size={24} className="text-primary" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#202c33] rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">CropCare AI Assistant</h3>
                  <p className="text-[10px] text-[#25D366] font-bold uppercase tracking-widest">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/60">
                <Video size={20} />
                <Phone size={18} />
                <MoreVertical size={20} />
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] p-3 rounded-xl relative shadow-md
                    ${msg.role === 'user' ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-white rounded-tl-none'}
                  `}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap pb-4">{msg.content}</p>
                    <div className="absolute bottom-1 right-2 flex items-center gap-1">
                      <span className="text-[9px] text-white/50">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.role === 'user' && <CheckCheck size={12} className="text-[#53bdeb]" />}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#202c33] p-3 rounded-xl rounded-tl-none flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-[#202c33] p-3 flex flex-col gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {SUGGESTIONS.map(s => (
                  <button 
                    key={s}
                    onClick={() => setInput(s)}
                    className="shrink-0 bg-white/5 text-[10px] font-bold text-white/60 px-3 py-1.5 rounded-full border border-white/5 whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="text-white/60 p-2"><Paperclip size={20} /></button>
                <div className="flex-1 relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message"
                    className="w-full bg-[#2a3942] text-white rounded-xl py-3 px-4 focus:outline-none text-sm"
                  />
                </div>
                <button 
                  onClick={handleSend}
                  className="bg-[#00a884] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  {input.trim() ? <Send size={20} /> : <Mic size={20} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
