import React from 'react';
import { EssayResult } from '../types';
import { History, Clock, ChevronRight, FileText } from 'lucide-react';

interface HistoryListProps {
  history: EssayResult[];
  onSelect: (essay: EssayResult) => void;
  currentId?: string;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, currentId }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Lịch sử bài viết</h3>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-full">
            {history.length} bài
        </span>
      </div>
      
      <div className="grid gap-3">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between relative overflow-hidden
              ${currentId === item.id 
                ? 'bg-white dark:bg-slate-800 border-indigo-500 dark:border-indigo-400 shadow-md ring-1 ring-indigo-500/20' 
                : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
              }`}
          >
            {/* Active Indicator Line */}
            {currentId === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
            )}

            <div className="flex-1 min-w-0 pr-4 pl-2">
              <h4 className={`font-semibold text-sm truncate mb-1.5 ${currentId === item.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'}`}>
                {item.title}
              </h4>
              <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 gap-2">
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {item.timestamp.toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className={`p-2 rounded-full transition-all duration-300 ${currentId === item.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-gray-50 dark:bg-slate-700/50 text-gray-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500'}`}>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;