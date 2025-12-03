import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EssayForm from './components/EssayForm';
import EssayResult from './components/EssayResult';
import ChatWidget from './components/ChatWidget';
import HistoryList from './components/HistoryList';
import { EssayRequest, EssayResult as EssayResultType, Theme } from './types';
import { generateEssay } from './services/geminiService';

const App: React.FC = () => {
  // Theme Management
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
    }
    return Theme.LIGHT;
  });

  // Essay State
  const [result, setResult] = useState<EssayResultType | null>(null);
  const [history, setHistory] = useState<EssayResultType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Apply theme class to html
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  const handleEssaySubmit = async (data: EssayRequest) => {
    setIsLoading(true);
    setResult(null); // Clear previous result to show loading state better

    // Determine word count number
    let count = 500;
    if (data.wordCountType === 'custom' && data.customWordCount) {
      count = data.customWordCount;
    } else if (data.wordCountType !== 'custom') {
      count = parseInt(data.wordCountType);
    }

    try {
      const content = await generateEssay(data.topic, data.outline, count, data.language);
      
      const newResult: EssayResultType = {
        id: Date.now().toString(),
        title: data.topic,
        content: content,
        timestamp: new Date()
      };

      setResult(newResult);
      setHistory(prev => [newResult, ...prev]);
    } catch (error) {
      console.error("Failed to generate essay", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="flex flex-col">
            <EssayForm onSubmit={handleEssaySubmit} isLoading={isLoading} />
            
            {/* Guide Section */}
            <div className="mt-8 bg-blue-50 dark:bg-slate-800/50 p-4 rounded-lg border border-blue-100 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">Mẹo viết hay:</h4>
              <ul className="text-sm text-blue-900 dark:text-slate-300 space-y-1 list-disc list-inside">
                <li>Cung cấp chủ đề càng chi tiết, bài văn càng sát ý.</li>
                <li>Sử dụng phần dàn ý để định hướng AI viết đúng trọng tâm.</li>
                <li>Chat với trợ lý văn học để tìm ý tưởng trước khi viết.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Result & History */}
          <div className="flex flex-col gap-6">
            <EssayResult result={result} />
            <HistoryList history={history} onSelect={setResult} currentId={result?.id} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-slate-500 border-t border-gray-200 dark:border-slate-800 mt-auto">
        <p>Powered by ThanhDam</p>
      </footer>

      {/* Chat Bubble */}
      <ChatWidget />
    </div>
  );
};

export default App;