"use client";

import { useAppContext, Language } from '@/context/AppProvider';
import { MapPin } from 'lucide-react';
import { useState, FormEvent } from 'react';

export function TopBar() {
  const { language, setLanguage, location, setLocation } = useAppContext();
  const [locInput, setLocInput] = useState(location);

  const handleLocationSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (locInput.trim()) {
      setLocation(locInput.trim());
    }
  };

  return (
    <header className="relative z-40 w-full px-4 pt-4">
      <div className="sky-glass-card p-3 max-w-md mx-auto flex items-center justify-between">
        <form onSubmit={handleLocationSubmit} className="flex items-center gap-2 bg-emerald-600/90 text-white px-3 py-1.5 rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm border-2 border-emerald-400 shadow-md">
          <MapPin size={16} className="text-white drop-shadow-sm" />
          <input 
            type="text"
            value={locInput}
            onChange={(e) => setLocInput(e.target.value)}
            onBlur={handleLocationSubmit}
            placeholder={language === 'en' ? 'Type location...' : 'शहर दर्ज करें...'}
            className="bg-transparent text-white placeholder-emerald-200 font-bold text-xs focus:outline-none w-28 appearance-none leaf-trigger"
          />
        </form>
        
        <div className="flex items-center bg-slate-900 rounded-xl p-1 shadow">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-colors ${
              language === 'en' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-colors ${
              language === 'hi' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            हि
          </button>
        </div>
      </div>
    </header>
  );
}
