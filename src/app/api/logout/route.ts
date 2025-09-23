// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ message: 'Logged out' });

  res.cookies.set({
    name: 'token',
    value: '',
    maxAge: 0,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return res;
}
