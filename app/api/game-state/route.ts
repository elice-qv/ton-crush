import { NextResponse } from 'next/server'

type GameState = {
  multiplier: number,
  isRunning: boolean,
  crashPoint: number | null,  // Обновляем тип
  timeToNextGame: number,
}

let gameState: GameState = {
  multiplier: 1,
  isRunning: false,
  crashPoint: null,
  timeToNextGame: 5,
}

let lastUpdateTime = Date.now()
const SPEED_FACTOR = 0.005 // 10 times slower
const MAX_MULTIPLIER = 1000

function updateGameState() {
  const now = Date.now()
  const deltaTime = (now - lastUpdateTime) / 1000 // Convert to seconds

  if (gameState.isRunning) {
    gameState.multiplier += SPEED_FACTOR * deltaTime
    if (gameState.multiplier >= MAX_MULTIPLIER || Math.random() < 0.001 * deltaTime) {
      gameState.isRunning = false
      gameState.crashPoint = gameState.multiplier
      gameState.timeToNextGame = 5
    }
  } else {
    gameState.timeToNextGame -= deltaTime
    if (gameState.timeToNextGame <= 0) {
      gameState.isRunning = true
      gameState.multiplier = 1
      gameState.crashPoint = null
    }
  }

  lastUpdateTime = now
}

export async function GET() {
  updateGameState()
  return NextResponse.json(gameState)
}
