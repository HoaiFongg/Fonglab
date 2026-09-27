import { NextResponse } from 'next/server';
import { INITIAL_LINKS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_LINKS,
  });
}
