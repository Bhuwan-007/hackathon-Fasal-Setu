"use client";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppProvider";
import { cropPrices } from "@/data/mockData";
import { MessageSquareQuote, Bot, Loader2, Sprout, BadgeIndianRupee, History } from "lucide-react";

export default function Advisory() {
  const { language, location } = useAppContext();
  const prices = cropPrices[location] || cropPrices['Default'] || [];
  
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const selectedCropData = prices.find((p: any) => p.id === selectedCrop);
  
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState<{plantAdvice: string, sellAdvice: string} | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('advisory-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleAskAI = async () => {
    setLoading(true);
    setAdvisory(null);
    try {
      const res = await fetch('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, crop: selectedCrop, language })
      });
      const data = await res.json();
      if (res.ok) {
        setAdvisory(data);
        
        // Save to history
        const newEntry = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          location,
          crop: selectedCrop,
          data
        };
        const newHistory = [newEntry, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('advisory-history', JSON.stringify(newHistory));
      } else {
        alert(data.error || 'Failed to fetch advisory');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-5 h-full animate-in fade-in duration-500">
      <div className="sky-glass-card p-5 flex items-center justify-between border-l-4 border-l-violet-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center text-lg font-black shadow-sm">
            <MessageSquareQuote size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'AI Advisory' : 'कृषि सलाह (AI)'}
            </h1>
            <p className="text-xs text-slate-600 font-bold">
              {language === 'en' ? 'Powered by Groq LLaMA3' : 'ग्रोक (Groq) द्वारा संचालित'}
            </p>
          </div>
        </div>
      </div>

      {!advisory && !loading && (
        <div className="sky-glass-card flex flex-col justify-center items-center text-center p-8 relative overflow-hidden bg-gradient-to-b from-white/40 to-violet-50/20">
          <Bot size={48} className="text-violet-500 mb-6 drop-shadow-md" />
          <p className="text-slate-700 font-bold text-sm mb-4 leading-relaxed max-w-xs">
            {language === 'en' 
              ? 'Ask the Copilot for hyper-local plant and sell recommendations.' 
              : 'अपने क्षेत्र के लिए हाइपर-लोकल फसल और बिक्री की सलाह मांगें।'}
          </p>
          
          <div className="w-full max-w-[220px] mb-4 flex flex-col gap-3">
            <select 
              className="w-full bg-emerald-600/90 text-white border-2 border-emerald-400 rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-300 shadow-lg appearance-none cursor-pointer leaf-trigger text-center"
              value={prices.find((p: any) => p.id === selectedCrop) ? selectedCrop : ''}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="" className="bg-slate-800 text-white">{language === 'en' ? 'General (What to plant?)' : 'सामान्य (क्या बोना है?)'}</option>
              {prices.map((c: any) => (
                <option key={c.id} value={c.id} className="bg-slate-800 text-white">{language === 'en' ? c.nameEn : c.nameHi}</option>
              ))}
            </select>

            <input 
              type="text"
              placeholder={language === 'en' ? 'Or type any crop...' : 'या कोई भी फसल टाइप करें...'}
              className="w-full bg-emerald-600/90 text-white placeholder-emerald-200 border-2 border-emerald-400 rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-emerald-300 shadow-lg appearance-none leaf-trigger text-center"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            />
          </div>

          <button 
            type="button"
            onClick={handleAskAI}
            className="px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-black text-xs shadow-lg transition-colors flex items-center gap-2 uppercase tracking-wider"
          >
            <MessageSquareQuote size={16} />
            {language === 'en' ? 'Generate Advisory' : 'सलाह प्राप्त करें'}
          </button>
        </div>
      )}

      {!advisory && !loading && (
        <>
          {selectedCropData ? (
            <div className="sky-glass-card p-4 mx-auto max-w-sm w-full bg-amber-50/50 border-t-4 border-t-amber-400 border-x-0 border-b-0 shadow-md">
              <h3 className="text-xs font-black uppercase text-amber-800 mb-1">
                {language === 'en' ? 'Quick Sell Target' : 'त्वरित बिक्री लक्ष्य'}
              </h3>
              <p className="text-sm font-bold text-amber-900 leading-snug">
                {language === 'en' 
                  ? `Today's Price: ₹${selectedCropData.pricePerQ}/q. Ask for at least ₹${selectedCropData.pricePerQ + 50} at the Mandi.`
                  : `आज का भाव: ₹${selectedCropData.pricePerQ}/क्विंटल। मंडी में कम से कम ₹${selectedCropData.pricePerQ + 50} की मांग करें।`
                }
              </p>
            </div>
          ) : (
            <div className="sky-glass-card p-4 mx-auto max-w-sm w-full bg-white/40 border-t-4 border-t-violet-400 border-x-0 border-b-0 shadow-md">
              <h3 className="text-[10px] font-black uppercase text-violet-800 mb-2 border-b border-violet-200 pb-1">
                {language === 'en' ? 'Latest Selling Price' : 'नवीनतम बिक्री मूल्य'}
              </h3>
              <div className="flex flex-col gap-2">
                {prices.slice(0, 4).map((p: any) => (
                  <div key={p.id} className="flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>{language === 'en' ? p.nameEn : p.nameHi}</span>
                    <span className="text-emerald-700">₹{p.pricePerQ}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {loading && (
        <div className="sky-glass-card flex-1 flex flex-col justify-center items-center py-16 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-violet-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-violet-700">
            {language === 'en' ? 'Analyzing Weather & Market...' : 'डेटा का विश्लेषण किया जा रहा है...'}
          </p>
        </div>
      )}

      {advisory && !loading && (
        <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-4">
          <div className="sky-glass-card p-5 border-2 border-emerald-300 shadow-md bg-gradient-to-b from-emerald-50/50 to-white/60">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                <Sprout size={18} strokeWidth={2.5} />
              </div>
              <h2 className="text-sm font-black text-emerald-900 uppercase tracking-widest">
                {language === 'en' ? 'Plant Advice' : 'बुवाई सलाह'}
              </h2>
            </div>
            <p className="text-slate-800 font-bold leading-relaxed text-sm">
              {advisory.plantAdvice}
            </p>
          </div>

          <div className="sky-glass-card p-5 border-2 border-amber-300 shadow-md bg-gradient-to-b from-amber-50/50 to-white/60">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-amber-100 text-amber-700 p-1.5 rounded-lg">
                <BadgeIndianRupee size={18} strokeWidth={2.5} />
              </div>
              <h2 className="text-sm font-black text-amber-900 uppercase tracking-widest">
                {language === 'en' ? 'Sell Advice' : 'बिक्री सलाह'}
              </h2>
            </div>
            <p className="text-slate-800 font-bold leading-relaxed text-sm">
              {advisory.sellAdvice}
            </p>
          </div>

          <button 
            type="button"
            onClick={() => setAdvisory(null)}
            className="mt-2 text-center text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest"
          >
            {language === 'en' ? '← Ask Another Question' : '← दूसरा प्रश्न पूछें'}
          </button>
        </div>
      )}

      {/* History Section */}
      {!loading && !advisory && history.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest px-1">
            <History size={14} />
            {language === 'en' ? 'Recent Advisories' : 'हाल की सलाह'}
          </h2>
          {history.map((h, i) => (
            <div key={h.id} className="sky-glass-card p-4 space-y-2 opacity-80 hover:opacity-100">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                <span className="text-[10px] font-bold text-slate-400">{h.date} • {h.location}</span>
                <span className="text-[10px] font-black text-violet-700 bg-violet-100 px-2 py-0.5 rounded-lg">
                  {h.crop || 'General'}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 line-clamp-2">
                <span className="text-emerald-700">Plant:</span> {h.data.plantAdvice}
              </p>
              <p className="text-xs font-semibold text-slate-700 line-clamp-2">
                <span className="text-amber-700">Sell:</span> {h.data.sellAdvice}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
