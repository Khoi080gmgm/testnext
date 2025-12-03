export interface EssayRequest {
  topic: string;
  outline: string;
  wordCountType: '100' | '500' | '700' | '1000' | 'custom';
  customWordCount?: number;
  language: 'vi' | 'en' | 'zh' | 'ru' | 'ja' | 'fr';
}

export interface EssayResult {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}