'use client'

import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LaunchOfferCTA() {
  const LAUNCH_END_DATE = '2026-11-27T23:59:59+01:00'

  const calculateTimeLeft = () => {
    const difference = new Date(LAUNCH_END_DATE).getTime() - Date.now()

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/15 border-y border-primary/30 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">

        {/* Limited Time Offer */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/20 rounded-full border border-primary/50">
          <Zap size={18} className="text-primary" />
          <span className="text-primary font-semibold text-sm">
            LIMITED TIME OFFER
          </span>
        </div>

        {/* Countdown */}
        <div className="flex justify-center gap-3 sm:gap-5 mb-8">
          <div className="bg-card border border-border rounded-lg px-4 py-3 min-w-[70px]">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {timeLeft.days}
            </div>
            <div className="text-xs text-muted-foreground">
              Days
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg px-4 py-3 min-w-[70px]">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {timeLeft.hours}
            </div>
            <div className="text-xs text-muted-foreground">
              Hours
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg px-4 py-3 min-w-[70px]">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {timeLeft.minutes}
            </div>
            <div className="text-xs text-muted-foreground">
              Minutes
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg px-4 py-3 min-w-[70px]">
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {timeLeft.seconds}
            </div>
            <div className="text-xs text-muted-foreground">
              Seconds
            </div>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Lock in Our Exclusive Launch Prices Before They Increase
        </h2>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of creators and secure our launch pricing forever.
          Once this promotion ends, all plans will return to their regular
          prices. Don&apos;t miss out.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">

          <div className="bg-background/40 backdrop-blur border border-border rounded-lg p-4">
            <div className="text-3xl mb-2">💰</div>
            <p className="font-semibold text-foreground">
              Save Up to 20%
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Get our best pricing locked in forever
            </p>
          </div>

          <div className="bg-background/40 backdrop-blur border border-border rounded-lg p-4">
            <div className="text-3xl mb-2">⏳</div>
            <p className="font-semibold text-foreground">
              Early Adopter Benefit
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Be part of our founding user community
            </p>
          </div>

          <div className="bg-background/40 backdrop-blur border border-border rounded-lg p-4">
            <div className="text-3xl mb-2">🔒</div>
            <p className="font-semibold text-foreground">
              Price Lock Guarantee
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Your rate never increases after launch
            </p>
          </div>

        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            🚀 Get Launch Price Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
          >
            Try Free First
          </Link>

        </div>

        {/* Sub-text */}
        <p className="text-xs text-muted-foreground mt-8">
          No credit card required. Start creating in seconds.
        </p>

      </div>
    </section>
  )
}