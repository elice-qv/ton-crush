"use client"

import { useGameState } from '@/components/GameStateProvider'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js'
import { AnimatePresence, motion } from 'framer-motion'
import { Coins, History } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const TonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50Z" fill="#0098EA"/>
    <path d="M34.8397 13.4102H15.1603L11.9141 24.3829H38.0859L34.8397 13.4102Z" fill="white"/>
    <path d="M15.1603 13.4102L24.9987 36.5898L38.0859 24.3829L34.8397 13.4102H15.1603Z" fill="white"/>
    <path d="M11.9141 24.3829L24.9987 36.5898L15.1603 13.4102L11.9141 24.3829Z" fill="white"/>
  </svg>
)

const translations = {
  en: {
    title: "TON Crash",
    readyToLaunch: "Ready to Launch",
    crashed: "CRASHED AT",
    betAmount: "Bet Amount",
    balance: "Balance:",
    cashOut: "Cash Out",
    gameHistory: "Game History",
    insufficientBalance: "Insufficient balance!",
    youWon: "You Won!",
    userBetHistory: "Your Bet History",
    nextGameIn: "Next game in",
    seconds: "seconds",
    placeBet: "Place Bet",
  },
  ru: {
    title: "TON Крэш",
    readyToLaunch: "Готов к запуску",
    crashed: "РАЗБИЛСЯ НА",
    betAmount: "Сумма ставки",
    balance: "Баланс:",
    cashOut: "Вывести",
    gameHistory: "История игр",
    insufficientBalance: "Недостаточный баланс!",
    youWon: "Вы выиграли!",
    userBetHistory: "История ваших ставок",
    nextGameIn: "Следующая игра через",
    seconds: "секунд",
    placeBet: "Поставить",
  },
}

type Language = 'en' | 'ru'
type TranslationKey = keyof typeof translations.en & keyof typeof translations.ru

interface BetHistory {
  multiplier: number
  amount: number
  won: boolean
}

export default function CrashGame() {
  const [language, setLanguage] = useState<Language>('ru')
  const [bet, setBet] = useState(10)
  const [balance, setBalance] = useState(1000)
  const [isBetPlaced, setIsBetPlaced] = useState(false)
  const [showWinAnimation, setShowWinAnimation] = useState(false)
  const [userBetHistory, setUserBetHistory] = useState<BetHistory[]>([])
  const [chartData, setChartData] = useState<number[]>([])

  const gameState = useGameState()

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key]
  }, [language])

  const placeBet = useCallback(() => {
    if (balance < bet) {
      alert(t('insufficientBalance'))
      return
    }
    setIsBetPlaced(true)
    setBalance(prev => prev - bet)
    // Send bet to server
    fetch('/api/place-bet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: bet }),
    })
  }, [balance, bet, t])

  const cashOut = useCallback(() => {
    if (gameState.isRunning && isBetPlaced) {
      const winAmount = bet * gameState.multiplier
      setBalance(prev => prev + winAmount)
      setIsBetPlaced(false)
      setShowWinAnimation(true)
      setUserBetHistory(prev => [{ multiplier: gameState.multiplier, amount: bet, won: true }, ...prev].slice(0, 10))
      // Send cashout to server
      fetch('/api/cash-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: bet, multiplier: gameState.multiplier }),
      })
    }
  }, [gameState.isRunning, gameState.multiplier, isBetPlaced, bet])

  React.useEffect(() => {
    if (gameState.isRunning) {
      setChartData(prev => [...prev, gameState.multiplier])
    } else {
      setChartData([])
    }
  }, [gameState.isRunning, gameState.multiplier])

  const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	animation: {
	  duration: 0, // Отключаем анимацию с помощью правильного объекта
	},
	scales: {
	  x: {
		type: 'linear' as const,
		display: false,
	  },
	  y: {
		type: 'linear' as const,
		display: true,
		position: 'left' as const,
		max: 1000,
	  },
	},
	plugins: {
	  legend: {
		display: false,
	  },
	},
	elements: {
	  point: {
		radius: 0,
	  },
	},
  }
  
  const data = {
    labels: chartData.map((_, index) => index),
    datasets: [
      {
        data: chartData,
        borderColor: '#0098EA',
        borderWidth: 2,
        fill: false,
      },
    ],
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-[#00609A] to-[#003366] text-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold flex items-center">
            <TonIcon />
            <span className="ml-2">{t('title')}</span>
          </CardTitle>
          <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
            <SelectTrigger className="w-[100px] bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative h-64 bg-black/20 rounded-lg overflow-hidden">
          <div className="absolute inset-0">
            <Line options={chartOptions} data={data} />
          </div>
          <div className="absolute top-2 left-2 text-2xl font-bold">
            {gameState.multiplier.toFixed(2)}x
          </div>
          {!gameState.isRunning && (
            <div className="absolute bottom-2 right-2 text-lg font-semibold">
              {t('nextGameIn')}: {gameState.timeToNextGame} {t('seconds')}
            </div>
          )}
          <AnimatePresence>
            {showWinAnimation && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-green-500"
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {t('youWon')}
              </motion.div>
            )}
          </AnimatePresence>
          {gameState.crashPoint && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500 text-4xl font-bold bg-black/50 p-4 rounded-lg">
                {t('crashed')} {gameState.crashPoint.toFixed(2)}x
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <label htmlFor="bet" className="block text-sm font-medium">{t('betAmount')}</label>
            <Input
              id="bet"
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="w-32 bg-white/10 border-white/20 text-white"
              disabled={gameState.isRunning || isBetPlaced}
            />
          </div>
          <div className="text-lg font-semibold flex items-center">
            <Coins className="mr-2" />
            {t('balance')} {balance.toFixed(2)} TON
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={placeBet} 
            disabled={gameState.isRunning || isBetPlaced}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {t('placeBet')}
          </Button>
          <Button 
            onClick={cashOut} 
            disabled={!gameState.isRunning || !isBetPlaced}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {t('cashOut')}
          </Button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <History className="mr-2" /> {t('userBetHistory')}
          </h3>
          <div className="space-y-2">
            {userBetHistory.map((bet, index) => (
              <div key={index} className={`px-2 py-1 rounded-md text-sm ${bet.won ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {bet.amount.toFixed(2)} TON @ {bet.multiplier.toFixed(2)}x - {bet.won ? 'Won' : 'Lost'}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}