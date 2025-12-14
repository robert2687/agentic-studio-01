import { NextRequest, NextResponse } from 'next/server';
import { Settings } from '@/types/settings';

// Dočasné úložisko (nahradíš DB)
let currentSettings: Settings = {
  theme: 'light',
  notificationsEnabled: true,
  language: 'en'
};

export async function GET() {
  return NextResponse.json(currentSettings);
}

export async function POST(request: NextRequest) {
  try {
    const newSettings: Settings = await request.json();
    currentSettings = newSettings;
    return NextResponse.json(currentSettings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400 }
    );
  }
}