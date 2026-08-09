import { NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather';
import { cropPrices } from '@/data/mockData';

export async function POST(req: Request) {
  try {
    const { location, language } = await req.json();

    if (!location) {
      return NextResponse.json({ error: 'Location required' }, { status: 400 });
    }

    const weather = await fetchWeather(location);
    const prices = cropPrices[location] || cropPrices['Default'] || [];

    const prompt = `
You are an expert agricultural advisor for Indian farmers. 
Based on the current weather (${weather?.temp}°C, ${weather?.conditionEn}) and top crop prices in ${location}, 
generate exactly 3 highly actionable, very short tips (1-2 sentences each). 
Include one about weather/soil, one about pests/irrigation, and one about market timing.
Language: ${language === 'en' ? 'English' : 'Hindi'}.

Return ONLY a valid JSON object matching this exact structure:
{
  "tips": [
    "Tip 1 text",
    "Tip 2 text",
    "Tip 3 text"
  ]
}
`;

    const mockResponse = {
      tips: language === 'en' ? [
        "Optimal soil moisture detected in your region for early sowing.",
        "Check for early signs of aphids due to the recent humidity.",
        "Hold off selling wheat for 3 days; prices are trending upwards."
      ] : [
        "आपके क्षेत्र में जल्दी बुवाई के लिए मिट्टी की नमी का स्तर अनुकूल है।",
        "हाल की नमी के कारण एफिड्स के शुरुआती लक्षणों की जांच करें।",
        "गेहूं बेचने के लिए 3 दिन प्रतीक्षा करें; कीमतें बढ़ रही हैं।"
      ]
    };

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(mockResponse);
    }

    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Groq API Error:', data);
      return NextResponse.json(mockResponse); // Fallback on error
    }

    const resultText = data.choices?.[0]?.message?.content;
    if (resultText) {
      try {
        const cleaned = resultText.replace(/```json/g, '').replace(/```/g, '');
        const parsed = JSON.parse(cleaned);
        return NextResponse.json(parsed);
      } catch (e) {
        console.error('JSON Parse Error:', e);
        return NextResponse.json(mockResponse);
      }
    }

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
