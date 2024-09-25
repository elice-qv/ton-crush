// app/api/admin/settings/route.ts
import { NextResponse } from 'next/server'

let gameSettings = {
  speedFactor: 0.005,
  maxCoefficient: 1000,
  probabilityRanges: [
    { min: 1, max: 2, probability: 0.01 },
    { min: 2, max: 10, probability: 0.005 },
    { min: 10, max: 1000, probability: 0.001 },
  ]
}

export async function GET() {
  return NextResponse.json(gameSettings)
}

export async function POST(request: Request) {
  const newSettings = await request.json()
  gameSettings = { ...gameSettings, ...newSettings }
  return NextResponse.json({ success: true })
}