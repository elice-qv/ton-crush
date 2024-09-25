import CrashGame from '@/app/crash-game'
import GameStateProvider from '@/components/GameStateProvider'
import { Suspense } from 'react'

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameStateProvider>
        <CrashGame />
      </GameStateProvider>
    </Suspense>
  )
}