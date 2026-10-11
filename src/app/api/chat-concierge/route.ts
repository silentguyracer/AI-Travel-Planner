import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getUserSettings } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const { destination, question, tripContext, customApiKey } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const apiKey = customApiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Intelligent mock concierge responses if no OpenAI key is set
      const qLower = question.toLowerCase();
      let answer = `For ${destination}, we recommend checking official transport passes (like 24h/72h city passes) which save significant money. Most attractions are best visited early in the morning before 10 AM to avoid peak queues.`;

      if (qLower.includes('food') || qLower.includes('eat') || qLower.includes('restaurant') || qLower.includes('vegetarian')) {
        answer = `In ${destination}, local dining options are plentiful. For authentic meals away from tourist markups, venture 1-2 blocks off the main plazas. If you have dietary preferences like vegetarian or halal, look for places with local organic menus or dedicated herbivore markings!`;
      } else if (qLower.includes('transit') || qLower.includes('train') || qLower.includes('bus') || qLower.includes('taxi') || qLower.includes('airport')) {
        answer = `Transit in ${destination} is best navigated using public express trains or metro lines. Grab a rechargeable transit card or use contactless credit/debit card tap-to-pay at ticket turnstiles. For late nights, authorized ride-shares or official taxi ranks are safe and reliable.`;
      } else if (qLower.includes('weather') || qLower.includes('wear') || qLower.includes('pack')) {
        answer = `Expect changing conditions throughout the day in ${destination}. Layering is key: bring breathable garments for walking during the daytime, a comfortable pair of walking shoes, and a light windbreaker or jacket for crisp evenings.`;
      } else if (qLower.includes('tip') || qLower.includes('tipping') || qLower.includes('cost') || qLower.includes('cash')) {
        answer = `Tipping customs in ${destination} generally suggest rounding up or leaving 5-10% for exceptional sit-down service. While credit cards are widely accepted, carrying a small amount of cash is handy for local markets and small vendors.`;
      }

      return NextResponse.json({
        reply: answer,
        source: 'curated-concierge',
      });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert local concierge and personal travel guide for travelers visiting ${destination}. 
You provide insider, friendly, actionable, and safety-conscious recommendations.
Keep answers clear, helpful, and concise (under 3-4 sentences whenever possible).
Trip context: ${tripContext || 'General personalized itinerary'}`,
        },
        {
          role: 'user',
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 350,
    });

    const reply = completion.choices[0]?.message?.content || 'I could not find an answer. Please try again.';

    return NextResponse.json({ reply, source: 'openai' });
  } catch (err: unknown) {
    console.error('Concierge API error:', err);
    return NextResponse.json(
      {
        reply: 'Public transit, morning museum visits, and hand-picked neighborhood eateries are always your best bet. Safe travels!',
        source: 'fallback',
      },
      { status: 200 }
    );
  }
}
