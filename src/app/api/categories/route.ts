import { NextResponse } from 'next/server';
import { INITIAL_CATEGORIES, INITIAL_TAGS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    categories: INITIAL_CATEGORIES,
    tags: INITIAL_TAGS,
  });
}
