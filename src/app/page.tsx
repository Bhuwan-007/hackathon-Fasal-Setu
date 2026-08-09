"use client";
import { useAppContext } from "@/context/AppProvider";
import { cropPrices } from "@/data/mockData";
import { ArrowRight, Leaf, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { language, location } = useAppContext();
  const topCrop = cropPrices[location]?.[0];
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const cacheKey = `homeAdvisories_${location}_${language}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      setTips(JSON.parse(cached));
      setLoading(false);
      return;
    }
    
    setLoading(true);
    fetch('/api/home-advisories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, language })
    })
      .then(res => res.json())
      .then(data => {
        if (mounted && data.tips) {
          setTips(data.tips);
          sessionStorage.setItem(cacheKey, JSON.stringify(data.tips));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => { mounted = false; };
  }, [location, language]);
  
  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      
      <div className="sky-glass-card p-5 flex items-center justify-between border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-black">
            <Leaf size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Farm Dashboard' : 'फार्म डैशबोर्ड'}
            </h1>
            <p className="text-xs text-slate-600 font-bold">
              {language === 'en' ? 'Live Telemetry & Market' : 'लाइव टेलीमेट्री और मंडी'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Today's Tip Cards */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
          {language === 'en' ? 'Smart Advisories' : 'स्मार्ट सलाह'}
        </p>
        
        {loading ? (
           <div className="sky-glass-card p-6 flex justify-center items-center">
             <Loader2 className="animate-spin text-amber-500" size={24} />
           </div>
        ) : tips.map((tip, idx) => (
          <div key={idx} className="sky-glass-card p-5 relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50/50 hover:-translate-y-0.5 transition-transform">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400 opacity-20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
              {language === 'en' ? `Insight ${idx + 1}` : `सुझाव ${idx + 1}`}
            </p>
            <p className="font-extrabold text-[0.95rem] leading-snug text-slate-800 relative z-10">
              {tip}
            </p>
          </div>
        ))}
      </div>
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/weather" className="sky-glass-card p-5 flex flex-col justify-between group cursor-pointer hover:border-emerald-300">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-4">
            {language === 'en' ? 'Weather' : 'मौसम'}
          </p>
          <div className="flex items-center justify-between">
            <p className="font-black text-2xl text-slate-900">
               24°<span className="text-lg text-slate-500">C</span>
            </p>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
        </Link>
        
        <Link href="/prices" className="sky-glass-card p-5 flex flex-col justify-between group cursor-pointer hover:border-amber-300">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-4 truncate">
            {language === 'en' ? 'Top Crop' : 'प्रमुख फसल'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="font-black text-lg text-slate-900">
                 {topCrop ? `₹${topCrop.pricePerQ.toLocaleString('en-IN')}` : '---'}
              </p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">
                 {topCrop ? (language === 'en' ? topCrop.nameEn : topCrop.nameHi) : ''}
              </p>
            </div>
            <ArrowRight size={16} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  );
}
