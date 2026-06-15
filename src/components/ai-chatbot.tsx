'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'नमस्ते! Welcome to Vgram AI Assistant. I can help you with product queries, organic farming recommendations, and fair pricing suggestions in English & Hindi. How can I help you today? \n\nमैं आपकी क्या सहायता कर सकता हूँ?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    if (!textToSend) {
      setInput('');
    }

    // Add user message
    const userMsgId = 'user_' + Date.now();
    const newMessages = [...messages, { id: userMsgId, role: 'user', content: query } as Message];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Attempt to post to Vercel AI SDK route /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });

      if (response.ok) {
        // If API key is present and response streams, parse it
        // Note: For simplicity, we handle standard JSON response or text stream
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: 'assistant_' + Date.now(),
          role: 'assistant',
          content: data.content || data.text || 'Sorry, I couldn\'t process that.'
        }]);
      } else {
        throw new Error('API key not configured or endpoint error. Falling back to local smart assistant.');
      }
    } catch (err) {
      console.warn('AI Chatbot using smart local fallback:', err);
      // Smart offline fallback responses based on keywords (English/Hindi)
      let reply = 'I am here to support you. Vgram connects farmers directly with buyers to ensure fresh produce at fair prices. Could you elaborate on your query?';
      
      const q = query.toLowerCase();
      if (q.includes('price') || q.includes('daam') || q.includes('दाम') || q.includes('रेट') || q.includes('rate')) {
        reply = '🌾 **Pricing Suggestions (दाम का सुझाव):** \n- We recommend setting wheat prices between ₹40-60/kg depending on quality. \n- Organic apples are currently trading between ₹160-200/kg. \n- Vgram eliminates middlemen, adding up to 30% more earnings directly to producers. \n\n*हिंदी:* वीग्राम पर बिचौलियों के न होने से किसानों को 30% तक अधिक मुनाफा मिलता है। आप अपनी उपज का मूल्य बाजार दर से थोड़ा कम रखकर अधिक खरीदार आकर्षित कर सकते हैं।';
      } else if (q.includes('organic') || q.includes('fresh') || q.includes('स्वास्थ्य') || q.includes('ताजा') || q.includes('खाद')) {
        reply = '🌱 **Organic & Fresh Recommendations:** \n- Organic Turmeric and Honey are great for immunity. \n- Fresh seasonal fruits like Shimla Apples and green vegetables are harvested daily. \n- For organic farming, utilize vermicompost (केंचुआ खाद) to boost soil organic carbon. \n\n*हिंदी:* जैविक खेती के लिए गोबर खाद या वर्मीकम्पोस्ट का प्रयोग करें। हमारे उत्पादकों के जैविक सेब और हल्दी इम्यूनिटी बढ़ाने के लिए बेहतरीन हैं।';
      } else if (q.includes('recommend') || q.includes('buy') || q.includes('खरीद') || q.includes('बेस्ट') || q.includes('best')) {
        reply = '🛍️ **Best Sellers on Vgram:** \n1. **Organic Sharbati Wheat** from Rajesh Kumar (Punjab) - ₹65/kg\n2. **Royal Delicious Apples** from Sunita Devi (Himachal) - ₹180/kg\n3. **Aromatic Arabica Coffee** from Lakshmi Rao (Karnataka) - ₹450/500g\n\nYou can add these items to your Cart directly from the Products page!';
      } else if (q.includes('hindi') || q.includes('नमस्ते') || q.includes('हैलो') || q.includes('hello')) {
        reply = 'नमस्ते! मैं वीग्राम का एआई सहायक हूँ। आप मुझसे जैविक खेती, फसलों के सही दाम, ताज़ा फल-सब्जियों और वीग्राम ऐप के उपयोग के बारे में पूछ सकते हैं। आप क्या जानना चाहते हैं?';
      } else if (q.includes('location') || q.includes('map') || q.includes('नक्शा') || q.includes('दूरी') || q.includes('distance')) {
        reply = '🗺️ **Map & Distance View:** \nProducers set their exact farm location using the Google Maps picker in their Profile. Buyers can view the Map page to find nearby products and see the exact distance in kilometers. This helps support local farms!';
      }

      // Simulate a small delay for the typing effect
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, {
        id: 'assistant_' + Date.now(),
        role: 'assistant',
        content: reply
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestionChips = [
    { text: 'Suggest organic products', icon: Sparkles },
    { text: 'फसलों के सही दाम (Pricing)', icon: HelpCircle },
    { text: 'How does map location work?', icon: Bot },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-green-500 animate-bounce"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-green-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-green-200" />
              <div>
                <h3 className="font-bold text-sm tracking-wide">Vgram AI Assistant</h3>
                <span className="text-[10px] text-green-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-lime-400 rounded-full inline-block animate-ping"></span>
                  Online (English & Hindi)
                </span>
              </div>
            </div>
            <button onClick={toggleChat} className="text-green-100 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                    msg.role === 'user'
                      ? 'bg-amber-100 border-amber-200 text-amber-800'
                      : 'bg-green-100 border-green-200 text-green-800'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Content Bubble */}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line shadow-sm border ${
                    msg.role === 'user'
                      ? 'bg-amber-50 border-amber-100 text-stone-800 rounded-tr-none'
                      : 'bg-white border-green-50 text-stone-800 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-green-100 border border-green-200 text-green-800 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-green-50 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-stone-500 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-stone-50 flex flex-wrap gap-1.5 border-t border-gray-100">
              {suggestionChips.map((chip, i) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSend(chip.text)}
                    className="flex items-center gap-1 bg-white hover:bg-green-50 border border-green-100 text-xs text-green-800 px-2.5 py-1.5 rounded-full shadow-sm hover:border-green-300 transition-all font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 text-green-600" />
                    <span>{chip.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-green-100 flex items-center gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything (e.g., pricing, recommendations)..."
              className="flex-1 bg-stone-50 text-stone-800 placeholder-stone-400 rounded-xl px-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-green-600 resize-none h-9 max-h-20"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-stone-200 disabled:text-stone-400 text-white p-2.5 rounded-xl transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
