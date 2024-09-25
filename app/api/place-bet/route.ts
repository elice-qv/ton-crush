// app/api/place-bet/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { amount } = await request.json()
  // Process the bet (e.g., update database)
  return NextResponse.json({ success: true })
}