"use client";
import { useAppContext } from "@/context/AppProvider";
import { cropPrices } from "@/data/mockData";
import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { language, location } = useAppContext();
  const topCrop = cropPrices[location]?.[0];
  
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
      
      {/* Today's Tip Card */}
      <div className="sky-glass-card p-6 relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 opacity-20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          {language === 'en' ? 'Today\'s Advisory' : 'आज की सलाह'}
        </p>
        <p className="font-extrabold text-[1.05rem] leading-snug text-slate-800 relative z-10">
          {language === 'en' 
            ? 'Optimal soil moisture detected in your region for early sowing.' 
            : 'आपके क्षेत्र में जल्दी बुवाई के लिए मिट्टी की नमी का स्तर अनुकूल है।'}
        </p>
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
