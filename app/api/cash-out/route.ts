// app/api/cash-out/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { amount, multiplier } = await request.json()
  // Process the cashout (e.g., update database)
  return NextResponse.json({ success: true })
}