import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { location, crop, language } = await req.json();

    if (!location || !crop) {
      return NextResponse.json({ error: 'Location and crop are required' }, { status: 400 });
    }

    const prompt = `
You are an expert agricultural market analyzer for Indian farmers. 
Provide a highly realistic CURRENT market estimate for the crop "${crop}" in the region "${location}". 
Return ONLY a valid JSON object matching this exact structure (translate name to Hindi if requested language is 'hi', but keep 'nameEn' English):

{
  "id": "generated_id",
  "nameEn": "English Name",
  "nameHi": "Hindi Name",
  "pricePerQ": 0, // Number representing price per quintal in INR (e.g. 2400)
  "trend": "up" | "down" | "stable",
  "demandSignal": "high" | "normal",
  "changeAmount": 0 // Number representing recent price change (e.g. 50)
}

Requested output language reference: ${language === 'en' ? 'English' : 'Hindi'}. 
Do not return anything except the JSON. Ensure numbers are realistic based on standard Indian Mandi prices.
`;

    const mockResponse = {
      id: crop.toLowerCase().replace(/\s+/g, '-'),
      nameEn: crop,
      nameHi: crop + ' (Mock)',
      pricePerQ: 3200,
      trend: 'up',
      demandSignal: 'high',
      changeAmount: 150
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
    console.error('Price API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
