import React, { useState } from 'react';
import { Bot, Send, Search } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'google' | 'chatgpt'>('google');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simuler une recherche Google ou une réponse ChatGPT
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: searchMode === 'google' 
            ? `Résultats de recherche pour "${input}"...`
            : "Je suis là pour vous aider avec vos questions de développement."
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">Assistant IA</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSearchMode('google')}
            className={`px-3 py-1 rounded-md ${
              searchMode === 'google'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Search className="h-5 w-5 inline-block mr-1" />
            Google
          </button>
          <button
            onClick={() => setSearchMode('chatgpt')}
            className={`px-3 py-1 rounded-md ${
              searchMode === 'chatgpt'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bot className="h-5 w-5 inline-block mr-1" />
            ChatGPT
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'justify-end' : ''
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  {searchMode === 'google' ? (
                    <Search className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Bot className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
              </div>
            )}
            <div
              className={`rounded-lg px-4 py-2 max-w-sm ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-indigo-600 animate-pulse" />
            <span className="text-gray-500">L'assistant réfléchit...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={searchMode === 'google' ? 'Rechercher sur le web...' : 'Posez votre question...'}
            className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}