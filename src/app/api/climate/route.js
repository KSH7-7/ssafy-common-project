import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://70.12.246.128:8000/climate');
    if (!response.ok) throw new Error('날씨현황 불러오기 실패');
    const data = await response.json();
    return NextResponse.json(data);
  } 
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
