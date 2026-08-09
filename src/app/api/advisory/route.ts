import { NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather';
import { cropPrices } from '@/data/mockData';

export async function POST(req: Request) {
  try {
    const { location, crop, language } = await req.json();

    if (!location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    const weather = await fetchWeather(location as any);
    const prices = cropPrices[location] || [];
    
    let cropDetails = 'None selected';
    if (crop) {
       const matched = prices.find(p => p.id === crop);
       if (matched) {
         cropDetails = `${matched.nameEn} (₹${matched.pricePerQ}/q, Trend: ${matched.trend})`;
       } else {
         cropDetails = crop;
       }
    }

    const prompt = `
You are an expert agricultural advisor for Indian farmers. 
Provide plain, direct, and highly specific advice in ${language === 'en' ? 'English' : 'Hindi'}.
Keep it short, concrete, and prioritize numbers over abstraction. Do not use markdown, just plain text.

CURRENT CONTEXT:
Location: ${location}
Weather: ${weather ? `${weather.temp}°C, ${weather.conditionEn}. Forecast: ${weather.forecast.map(f => `${f.dayEn} max ${f.tempMax}°C`).join(', ')}` : 'Unknown'}
Market Prices & Demand:
${prices.map(p => `- ${p.nameEn}: ₹${p.pricePerQ}/q (Trend: ${p.trend}, Demand: ${p.demandSignal})`).join('\n')}

Farmer's Current Crop Focus: ${cropDetails}

OUTPUT FORMAT (Return valid JSON with two fields ONLY):
{
  "plantAdvice": "Best 1-2 crops to plant right now based on the weather and market demand, and briefly why.",
  "sellAdvice": "For the farmer's current crop focus (or the highest priced crop if none selected), state today's price, how it compares, and give a clear 'ask for at least ₹X' number."
}
`;

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.log('No GROQ_API_KEY found, returning mock response.');
      return NextResponse.json({
        plantAdvice: language === 'en' 
          ? "Based on the upcoming sunny weather and high market demand, consider planting Tomato or Soybean."
          : "आगामी धूप वाले मौसम और बाजार की उच्च मांग को देखते हुए, टमाटर या सोयाबीन बोने पर विचार करें।",
        sellAdvice: language === 'en'
          ? `Today's price for ${crop || 'your crop'} is solid. The trend is upward. Ask for at least ₹2,200 per quintal.`
          : `आपकी फसल का आज का भाव मजबूत है। कम से कम ₹2,200 प्रति क्विंटल की मांग करें।`
      });
    }

    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;
    
    if (resultText) {
      const parsed = JSON.parse(resultText);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({ error: 'Failed to generate advisory' }, { status: 500 });
  } catch (error) {
    console.error('Advisory API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
