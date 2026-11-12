'use client'

import { useState, useEffect } from 'react'

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setIsExpired(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (isExpired) return null

  return (
    <div className="flex gap-2 justify-center items-center font-bold">
      {timeLeft.days > 0 && (
        <div className="bg-black/30 px-2 py-1 rounded">
          {timeLeft.days}<span className="text-xs">d</span>
        </div>
      )}
      <div className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2,'0')}<span className="text-xs">h</span></div>
      <div className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2,'0')}<span className="text-xs">m</span></div>
      <div className="bg-black/30 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2,'0')}<span className="text-xs">s</span></div>
    </div>
  )
}