"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useEffect, useState } from 'react'

interface ProbabilityRange {
  min: number;
  max: number;
  probability: number;
}

export default function AdminPanel() {
  const [speedFactor, setSpeedFactor] = useState(0.005)
  const [maxCoefficient, setMaxCoefficient] = useState(1000)
  const [probabilityRanges, setProbabilityRanges] = useState<ProbabilityRange[]>([])

  useEffect(() => {
    // Fetch current settings from server
    fetch('/api/admin/settings')
      .then(response => response.json())
      .then(data => {
        setSpeedFactor(data.speedFactor)
        setMaxCoefficient(data.maxCoefficient)
        setProbabilityRanges(data.probabilityRanges)
      })
  }, [])

  const handleProbabilityChange = (index: number, value: number) => {
    const newRanges = [...probabilityRanges]
    newRanges[index].probability = value
    setProbabilityRanges(newRanges)
  }

  const handleSave = () => {
    // Save settings to server
    fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        speedFactor,
        maxCoefficient,
        probabilityRanges
      })
    }).then(() => {
      alert('Settings saved!')
    })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="speed-factor">Speed Factor (lower is slower)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="speed-factor"
                min={0.001}
                max={0.01}
                step={0.001}
                value={[speedFactor]}
                onValueChange={(value) => setSpeedFactor(value[0])}
              />
              <Input
                type="number"
                value={speedFactor}
                onChange={(e) => setSpeedFactor(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="max-coefficient">Max Coefficient</Label>
            <Input
              id="max-coefficient"
              type="number"
              value={maxCoefficient}
              onChange={(e) => setMaxCoefficient(Number(e.target.value))}
              className="w-32"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Probability Ranges</h3>
            {probabilityRanges.map((range, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="w-32">{range.min.toFixed(2)} - {range.max.toFixed(2)}</span>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.001}
                  value={range.probability}
                  onChange={(e) => handleProbabilityChange(index, Number(e.target.value))}
                  className="w-20"
                />
                <span>probability</span>
              </div>
            ))}
          </div>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  )
}