import React, { useState } from 'react';
import { EssayRequest } from '../types';
import { Loader2, Sparkles, PenTool, AlignLeft, FileText, Globe, Type, ChevronDown } from 'lucide-react';

interface EssayFormProps {
  onSubmit: (data: EssayRequest) => void;
  isLoading: boolean;
}

const EssayForm: React.FC<EssayFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [outline, setOutline] = useState('');
  const [wordCountType, setWordCountType] = useState<EssayRequest['wordCountType']>('500');
  const [customWordCount, setCustomWordCount] = useState<number>(500);
  const [language, setLanguage] = useState<EssayRequest['language']>('vi');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      topic,
      outline,
      wordCountType,
      customWordCount: wordCountType === 'custom' ? customWordCount : undefined,
      language
    });
  };

  const sectionClass = "group relative p-5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700";
  const labelClasses = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 tracking-wide uppercase text-xs flex items-center gap-2";
  const inputBaseClasses = "w-full rounded-xl border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white shadow-inner focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-300 p-3.5 text-sm font-medium";
  const selectWrapperClasses = "relative w-full";
  const selectClasses = `${inputBaseClasses} appearance-none cursor-pointer pr-10`;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 dark:border-slate-700 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-slate-700/50">
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur opacity-40 animate-pulse"></div>
            <div className="relative p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg text-white">
            <Sparkles className="w-6 h-6" />
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">
            Thiết lập bài viết
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Nhập thông tin để AI sáng tạo nội dung</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Topic Section */}
        <div className={sectionClass}>
          <label htmlFor="topic" className={labelClasses}>
            <PenTool className="w-4 h-4 text-blue-500" />
            Chủ đề / Đề bài <span className="text-red-500">*</span>
          </label>
          <textarea
            id="topic"
            required
            rows={3}
            className={inputBaseClasses}
            placeholder="Ví dụ: Phân tích nhân vật ông Hai trong tác phẩm Làng..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Outline Section */}
        <div className={sectionClass}>
          <label htmlFor="outline" className={labelClasses}>
            <AlignLeft className="w-4 h-4 text-green-500" />
            Dàn ý gợi ý (Tùy chọn)
          </label>
          <textarea
            id="outline"
            rows={3}
            className={inputBaseClasses}
            placeholder="- Giới thiệu tác giả, tác phẩm&#10;- Phân tích diễn biến tâm trạng&#10;- Đánh giá nghệ thuật..."
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
          />
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Length Section */}
          <div className={sectionClass}>
            <label htmlFor="wordCount" className={labelClasses}>
              <Type className="w-4 h-4 text-purple-500" />
              Độ dài bài viết
            </label>
            <div className={selectWrapperClasses}>
                <select
                id="wordCount"
                className={selectClasses}
                value={wordCountType}
                onChange={(e) => setWordCountType(e.target.value as EssayRequest['wordCountType'])}
                >
                <option value="100">Khoảng 100 từ</option>
                <option value="500">Khoảng 500 từ</option>
                <option value="700">Khoảng 700 từ</option>
                <option value="1000">Khoảng 1000 từ</option>
                <option value="custom">Tự chọn số từ...</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
            
            {wordCountType === 'custom' && (
              <div className="mt-3 animate-fade-in">
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    value={customWordCount}
                    onChange={(e) => setCustomWordCount(Number(e.target.value))}
                    className={inputBaseClasses}
                    placeholder="Nhập số từ (VD: 1500)"
                />
              </div>
            )}
          </div>

          {/* Language Section */}
          <div className={sectionClass}>
            <label htmlFor="language" className={labelClasses}>
              <Globe className="w-4 h-4 text-indigo-500" />
              Ngôn ngữ trình bày
            </label>
            <div className={selectWrapperClasses}>
                <select
                id="language"
                className={selectClasses}
                value={language}
                onChange={(e) => setLanguage(e.target.value as EssayRequest['language'])}
                >
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="en">🇬🇧 English (Tiếng Anh)</option>
                <option value="zh">🇨🇳 中文 (Tiếng Trung)</option>
                <option value="ja">🇯🇵 日本語 (Tiếng Nhật)</option>
                <option value="ru">🇷🇺 Русский (Tiếng Nga)</option>
                <option value="fr">🇫🇷 Français (Tiếng Pháp)</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className={`w-full group relative overflow-hidden flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] ${
              isLoading ? 'cursor-not-allowed' : ''
            }`}
          >
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-300 ${isLoading ? 'opacity-80' : 'group-hover:scale-105'}`}></div>
            
            {/* Shimmer Effect */}
            {!isLoading && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
            )}

            <span className="relative z-20 flex items-center gap-3">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-6 w-6" />
                  Đang khởi tạo kiệt tác...
                </>
              ) : (
                <>
                  <div className="bg-white/20 p-1 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  Tạo Bài Văn Ngay
                </>
              )}
            </span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default EssayForm;