"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  location: string;
  setLocation: (loc: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [location, setLocationState] = useState<string>('Pune');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('fasal-lang') as Language;
    const savedLoc = localStorage.getItem('fasal-loc');
    if (savedLang) setLanguageState(savedLang);
    if (savedLoc) setLocationState(savedLoc);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fasal-lang', lang);
  };

  const setLocation = (loc: string) => {
    setLocationState(loc);
    localStorage.setItem('fasal-loc', loc);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, location, setLocation }}>
      {mounted ? children : <div className="invisible">{children}</div>}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
