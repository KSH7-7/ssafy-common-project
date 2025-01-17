import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://<라즈베리파이_IP>/temperature');
    if (!response.ok) throw new Error('온도 불러오기 실패');
    const data = await response.json();
    return NextResponse.json(data);
  } 
  catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
