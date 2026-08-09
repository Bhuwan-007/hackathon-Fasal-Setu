export interface WeatherData {
  temp: number;
  conditionEn: string;
  conditionHi: string;
  forecast: {
    dayEn: string;
    dayHi: string;
    tempMax: number;
    tempMin: number;
  }[];
}

export async function fetchWeather(location: string): Promise<WeatherData | null> {
  if (!location) return null;
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
    if (!geoRes.ok) return null;
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) return null;
    
    const { latitude: lat, longitude: lon } = geoData.results[0];

    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`);
    if (!res.ok) return null;
    const data = await res.json();
    
    const code = data.current.weather_code;
    let conditionEn = 'Clear';
    let conditionHi = 'साफ';
    
    if (code >= 1 && code <= 3) { conditionEn = 'Partly Cloudy'; conditionHi = 'आंशिक बादल'; }
    else if (code >= 45 && code <= 48) { conditionEn = 'Foggy'; conditionHi = 'कोहरा'; }
    else if (code >= 51 && code <= 67) { conditionEn = 'Rainy'; conditionHi = 'बारिश'; }
    else if (code >= 71 && code <= 77) { conditionEn = 'Snow'; conditionHi = 'बर्फबारी'; }
    else if (code >= 95) { conditionEn = 'Thunderstorm'; conditionHi = 'आंधी-तूफान'; }

    const forecast = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(data.daily.time[i]);
      const dayEn = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayMapHi: Record<number, string> = { 0: 'रवि', 1: 'सोम', 2: 'मंगल', 3: 'बुध', 4: 'गुरु', 5: 'शुक्र', 6: 'शनि' };
      const dayHi = dayMapHi[date.getDay()];
      
      forecast.push({
        dayEn,
        dayHi,
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
      });
    }

    return {
      temp: Math.round(data.current.temperature_2m),
      conditionEn,
      conditionHi,
      forecast
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
