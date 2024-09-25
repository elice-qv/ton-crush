"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface GameState {
  multiplier: number
  isRunning: boolean
  crashPoint: number | null
  timeToNextGame: number
}

const GameStateContext = createContext<GameState | null>(null)

export const useGameState = () => {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}

export default function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    multiplier: 1,
    isRunning: false,
    crashPoint: null,
    timeToNextGame: 5,
  })

  useEffect(() => {
    const fetchGameState = async () => {
      const response = await fetch('/api/game-state')
      const data = await response.json()
      setGameState(data)
    }

    fetchGameState()
    const interval = setInterval(fetchGameState, 100) // Update every 100ms

    return () => clearInterval(interval)
  }, [])

  return (
    <GameStateContext.Provider value={gameState}>
      {children}
    </GameStateContext.Provider>
  )
}