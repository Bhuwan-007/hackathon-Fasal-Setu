"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppProvider";
import { cropPrices } from "@/data/mockData";
import { TrendingUp, TrendingDown, Minus, Flame, IndianRupee, Search, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function Prices() {
  const { language, location } = useAppContext();
  const initialPrices = cropPrices[location] || cropPrices['Default'] || [];
  const [pricesState, setPricesState] = useState<any[]>(initialPrices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    const base = cropPrices[location] || cropPrices['Default'] || [];
    const cached = localStorage.getItem(`aiCrops_${location}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPricesState([...parsed, ...base]);
      } catch (e) {
        setPricesState(base);
      }
    } else {
      setPricesState(base);
    }
  }, [location]);
  
  const filteredPrices = pricesState.filter(p => 
    p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.nameHi.includes(searchQuery)
  );
  
  const handleAISearch = async (queryToSearch: string = searchQuery) => {
    if (!queryToSearch.trim()) return;
    if (filteredPrices.length > 0) return;

    setIsSearching(true);
    try {
      const res = await fetch('/api/prices/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, crop: queryToSearch, language })
      });
      if (res.ok) {
        const data = await res.json();
        const newState = [data, ...pricesState];
        setPricesState(newState);
        
        // Save to localStorage
        const cached = localStorage.getItem(`aiCrops_${location}`);
        const parsedCached = cached ? JSON.parse(cached) : [];
        localStorage.setItem(`aiCrops_${location}`, JSON.stringify([data, ...parsedCached]));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() && filteredPrices.length === 0 && !isSearching) {
        handleAISearch(searchQuery);
      }
    }, 1200);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filteredPrices.length, isSearching]);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAISearch(searchQuery);
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      
      <div className="sky-glass-card p-5 flex items-center justify-between border-l-4 border-l-amber-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-black shadow-sm">
            <IndianRupee size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {language === 'en' ? `Mandi Prices • ${location}` : `मंडी भाव • ${location}`}
            </h1>
            <p className="text-xs text-slate-600 font-bold">
              {language === 'en' ? 'Live Market Board' : 'लाइव मार्केट बोर्ड'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onFormSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-emerald-200" />
        </div>
        <input 
          type="text"
          placeholder={language === 'en' ? 'Search crop...' : 'फसल खोजें...'}
          className="w-full bg-emerald-600/90 text-white placeholder-emerald-200 border-2 border-emerald-400 rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm pl-10 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-300 shadow-lg appearance-none leaf-trigger"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="flex flex-col gap-3">
        {filteredPrices.length === 0 ? (
          <div className="sky-glass-card p-6 text-center text-slate-500 font-bold flex flex-col items-center justify-center">
             {isSearching ? (
               <>
                 <Loader2 className="animate-spin text-amber-500 mb-2" size={24} />
                 {language === 'en' ? 'AI is estimating price...' : 'AI मूल्य का अनुमान लगा रहा है...'}
               </>
             ) : (
               language === 'en' ? 'Crop not found.' : 'फसल नहीं मिली।'
             )}
          </div>
        ) : (
          filteredPrices.map(crop => (
            <div key={crop.id} className="sky-glass-card p-4 flex items-center justify-between hover:-translate-y-1 transition-transform">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {language === 'en' ? crop.nameEn : crop.nameHi}
                  </h3>
                  {crop.demandSignal === 'high' && (
                    <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider font-black text-orange-700 bg-orange-100 px-2 py-0.5 rounded-lg border border-orange-300 shadow-sm">
                      <Flame size={10} className="text-orange-600" />
                      {language === 'en' ? 'Trending' : 'ट्रेंडिंग'}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                  {language === 'en' ? 'Price per Quintal' : 'भाव प्रति क्विंटल'}
                </p>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <p className="font-black text-slate-900 text-xl">
                  ₹{crop.pricePerQ.toLocaleString('en-IN')}
                </p>
                <div className={clsx(
                  "text-[10px] font-black uppercase tracking-wider flex items-center gap-1 mt-1 px-2 py-0.5 rounded-lg border",
                  crop.trend === 'up' ? 'text-emerald-800 bg-emerald-100 border-emerald-300' : 
                  crop.trend === 'down' ? 'text-red-800 bg-red-100 border-red-300' : 'text-slate-600 bg-slate-100 border-slate-300'
                )}>
                  {crop.trend === 'up' && <TrendingUp size={12} strokeWidth={3} />}
                  {crop.trend === 'down' && <TrendingDown size={12} strokeWidth={3} />}
                  {crop.trend === 'stable' && <Minus size={12} strokeWidth={3} />}
                  {crop.changeAmount > 0 ? `₹${crop.changeAmount}` : (language === 'en' ? 'Stable' : 'स्थिर')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
