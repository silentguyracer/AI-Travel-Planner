import { NextRequest, NextResponse } from 'next/server';
import { generateTripWithAI } from '@/lib/openai';
import { TripGenerationRequest } from '@/types/travel';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TripGenerationRequest;

    if (!body.destination || typeof body.destination !== 'string') {
      return NextResponse.json(
        { error: 'Destination is required.' },
        { status: 400 }
      );
    }

    if (!body.duration || typeof body.duration !== 'number' || body.duration < 1 || body.duration > 30) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 30 days.' },
        { status: 400 }
      );
    }

    if (!['economy', 'moderate', 'luxury'].includes(body.budget)) {
      body.budget = 'moderate';
    }

    const tripPlan = await generateTripWithAI(body);

    return NextResponse.json(tripPlan);
  } catch (error: unknown) {
    console.error('API /api/generate-trip error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate trip';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
