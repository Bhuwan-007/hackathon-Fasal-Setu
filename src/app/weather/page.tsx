"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppProvider";
import { fetchWeather, WeatherData } from "@/lib/weather";
import { CloudSun, Loader2, Thermometer } from "lucide-react";

export default function Weather() {
  const { language, location } = useAppContext();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<{crop: string, reason: string}[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    let mounted = true;
    const weatherCacheKey = `weatherData_${location}`;
    const recsCacheKey = `weatherRecs_${location}_${language}`;
    
    const cachedWeather = sessionStorage.getItem(weatherCacheKey);
    const cachedRecs = sessionStorage.getItem(recsCacheKey);

    if (cachedWeather) {
      try {
        const parsedWeather = JSON.parse(cachedWeather);
        setData(parsedWeather);
        setLoading(false);
        
        if (cachedRecs) {
          setRecommendations(JSON.parse(cachedRecs));
        } else if (parsedWeather) {
          fetchRecs(parsedWeather, recsCacheKey);
        }
        return;
      } catch (e) {}
    }

    setLoading(true);
    fetchWeather(location).then((res) => {
      if (mounted) {
        setData(res);
        setLoading(false);
        if (res) {
          sessionStorage.setItem(weatherCacheKey, JSON.stringify(res));
          fetchRecs(res, recsCacheKey);
        }
      }
    });

    function fetchRecs(weatherData: any, cacheKey: string) {
      setLoadingRecs(true);
      fetch('/api/weather-crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, weather: weatherData, language })
      })
      .then(r => r.json())
      .then(d => {
        if (mounted && d.recommendations) {
          setRecommendations(d.recommendations);
          sessionStorage.setItem(cacheKey, JSON.stringify(d.recommendations));
        }
        setLoadingRecs(false);
      })
      .catch(() => setLoadingRecs(false));
    }

    return () => { mounted = false; };
  }, [location, language]);

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      
      <div className="sky-glass-card p-5 flex items-center justify-between border-l-4 border-l-sky-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-lg font-black">
            <CloudSun size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {language === 'en' ? `Weather • ${location}` : `मौसम • ${location}`}
            </h1>
            <p className="text-xs text-slate-600 font-bold">
              {language === 'en' ? 'Live Atmospheric Data' : 'लाइव वायुमंडलीय डेटा'}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="sky-glass-card flex flex-col items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-sky-500" />
          <p className="text-xs font-bold uppercase tracking-widest">{language === 'en' ? 'Fetching live telemetry...' : 'डेटा लोड हो रहा है...'}</p>
        </div>
      ) : data ? (
        <>
          <div className="sky-glass-card p-8 text-center flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-sky-50/50 to-white/30">
            <CloudSun className="w-16 h-16 text-amber-500 mb-4 drop-shadow-md" strokeWidth={1.5} />
            <div className="text-6xl font-black text-slate-900 tracking-tighter mb-4">
              {data.temp}°<span className="text-4xl text-slate-400">C</span>
            </div>
            <p className="text-xs font-extrabold text-sky-900 bg-sky-100/80 px-4 py-2 rounded-xl border border-sky-200">
              {language === 'en' ? data.conditionEn : data.conditionHi}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">
              {language === 'en' ? '3-Day Forecast' : '3-दिन का पूर्वानुमान'}
            </h2>
            <div className="sky-glass-card p-4 space-y-4">
              {data.forecast.map((day, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800 w-16 text-sm">
                    {language === 'en' ? day.dayEn : day.dayHi}
                  </span>
                  <div className="flex items-center gap-4 font-bold">
                    <span className="text-slate-500 text-xs">{day.tempMin}°</span>
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                      <div className="bg-gradient-to-r from-sky-400 to-amber-400 h-full w-full rounded-full opacity-80"></div>
                    </div>
                    <span className="text-slate-800 text-sm">{day.tempMax}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 mt-2">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">
              {language === 'en' ? 'AI Weather Crops' : 'मौसम आधारित फसलें'}
            </h2>
            {loadingRecs ? (
              <div className="sky-glass-card p-4 flex justify-center items-center">
                <Loader2 className="animate-spin text-sky-500" size={20} />
              </div>
            ) : recommendations.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="sky-glass-card p-4 border-l-2 border-emerald-400 shadow-sm">
                    <h3 className="font-black text-slate-800 text-sm">{rec.crop}</h3>
                    <p className="text-xs text-slate-600 font-bold mt-1 leading-snug">{rec.reason}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <div className="sky-glass-card p-6 bg-red-50 text-red-600 text-center text-sm font-bold border-red-200">
          {language === 'en' ? 'Telemetry fetch failed.' : 'डेटा लोड करने में विफल।'}
        </div>
      )}
    </div>
  );
}
