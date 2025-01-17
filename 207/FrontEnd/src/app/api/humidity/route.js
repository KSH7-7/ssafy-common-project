import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/climate');
    if (!response.ok) throw new Error('습도 불러오기 실패');
    const data = await response.json();
    return NextResponse.json(data);
  } 
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
