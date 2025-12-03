import React, { useState } from 'react';
import { EssayResult as EssayResultType } from '../types';
import { X, Copy, Check, FileText, Maximize2, Calendar, BookOpen } from 'lucide-react';

interface EssayResultProps {
  result: EssayResultType | null;
}

const EssayResult: React.FC<EssayResultProps> = ({ result }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-10 text-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-dashed border-gray-200 dark:border-slate-700 transition-all duration-500 animate-fade-in group">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 p-8 rounded-full mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
          <FileText className="w-20 h-20 text-gray-300 dark:text-slate-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Không gian sáng tạo</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed text-base">
          Kết quả bài văn sẽ hiển thị tại đây. Hãy bắt đầu bằng việc nhập chủ đề bên trái.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Result Card Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 transition-all duration-500 animate-slide-in-right flex flex-col ring-1 ring-gray-900/5 dark:ring-white/10 group min-h-[500px]">
        
        {/* Card Header */}
        <div className="p-6 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex justify-between items-start z-10 relative shadow-sm">
          <div className="flex-1 pr-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider rounded-md mb-3">
              <BookOpen className="w-3 h-3" />
              Hoàn tất
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2" title={result.title}>
              {result.title}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-900 py-1.5 px-3 rounded-full border border-gray-100 dark:border-slate-700 whitespace-nowrap">
              <Calendar className="w-3 h-3 mr-1.5" />
              {result.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        </div>
        
        {/* Card Body (Paper effect) */}
        <div className="relative flex-grow bg-[#fcfcfc] dark:bg-[#1e293b] flex flex-col overflow-hidden">
          {/* Subtle paper texture/gradient */}
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10"></div>
          
          {/* Content Area - Fills space, no truncation characters, uses mask */}
          <div className="flex-grow p-8 overflow-hidden relative">
             <div className="prose dark:prose-invert prose-lg max-w-none text-gray-700 dark:text-slate-300 font-serif leading-loose whitespace-pre-wrap text-justify h-full text-fade-mask">
                {result.content}
             </div>
             
             {/* Read More Indicator (Visual only, as mask handles the fade) */}
             <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#fcfcfc] dark:from-[#1e293b] to-transparent pointer-events-none z-10"></div>
          </div>

          {/* Action Bar */}
          <div className="p-6 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex gap-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 group flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95 active:shadow-sm"
            >
              <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Đọc toàn bộ
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-3.5 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-gray-300 shadow-sm"
              title="Sao chép nội dung"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 animate-fade-in">
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] shadow-2xl flex flex-col transform transition-all scale-100 animate-[fadeInUp_0.3s_ease-out] border border-gray-200 dark:border-slate-700"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 rounded-t-2xl z-20 shadow-sm">
              <div className="flex-1 pr-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {result.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                   <BookOpen className="w-3 h-3" />
                   Bản xem đầy đủ
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content - Paper view */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfcfc] dark:bg-[#0f172a]">
              <div className="max-w-4xl mx-auto px-8 py-12 sm:px-12">
                <article className="prose dark:prose-invert prose-xl max-w-none text-gray-800 dark:text-gray-200 leading-loose whitespace-pre-wrap font-serif text-justify">
                  {result.content}
                </article>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 rounded-b-2xl z-20">
              <span className="text-sm text-gray-400 hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                AI Writer Pro Generated
              </span>
              <div className="flex gap-4 ml-auto">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-6 py-3 border rounded-xl transition-all font-semibold shadow-sm ${copied 
                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                >
                   {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                   {copied ? 'Đã sao chép' : 'Sao chép'}
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 bg-gray-900 dark:bg-indigo-600 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-bold active:scale-95"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EssayResult;