import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { location, weather, language } = await req.json();

    if (!location || !weather) {
      return NextResponse.json({ error: 'Location and weather required' }, { status: 400 });
    }

    const prompt = `
You are an expert agricultural advisor. Based on this 3-day weather forecast for ${location}:
Current: ${weather.temp}°C, ${weather.conditionEn}.
Forecast: ${weather.forecast.map((f: any) => `${f.dayEn}: min ${f.tempMin}°C, max ${f.tempMax}°C`).join(', ')}.

Recommend exactly 3 crops that are perfect to plant or focus on right now in these specific weather conditions. 
Provide a very short 1-sentence reason for each.
Language: ${language === 'en' ? 'English' : 'Hindi'}.

Return ONLY a valid JSON object matching this structure:
{
  "recommendations": [
    { "crop": "Crop Name", "reason": "Reason text" },
    { "crop": "Crop Name", "reason": "Reason text" },
    { "crop": "Crop Name", "reason": "Reason text" }
  ]
}
`;

    const mockResponse = {
      recommendations: language === 'en' ? [
        { crop: 'Wheat', reason: 'Ideal temperature range for germination.' },
        { crop: 'Mustard', reason: 'Current dry conditions prevent early rot.' },
        { crop: 'Chickpea', reason: 'Requires less water, perfect for this forecast.' }
      ] : [
        { crop: 'गेहूं', reason: 'अंकुरण के लिए आदर्श तापमान।' },
        { crop: 'सरसों', reason: 'वर्तमान शुष्क स्थिति शुरुआती सड़न को रोकती है।' },
        { crop: 'चना', reason: 'कम पानी की आवश्यकता होती है, इस पूर्वानुमान के लिए एकदम सही है।' }
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
    console.error('Weather API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
