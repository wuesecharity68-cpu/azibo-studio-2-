'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'
import DemoModal from '@/components/DemoModal'

export default function Hero() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-background via-background to-card/20">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-20" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Launch Offer Badge */}
          <div className="inline-block mb-6 px-4 py-2 bg-secondary/20 rounded-full border border-secondary/40">
            <span className="text-secondary font-semibold text-sm">
              🚀 LAUNCH OFFER – LIMITED TIME PRICING
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Create Viral AI Videos
            <span className="block text-primary">In Seconds</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
            Turn simple text prompts into engaging AI videos for social media,
            stories, and creative projects. Create animal, realistic human,
            3D, and anime videos in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-base"
            >
              🔥 Get Launch Price
            </Link>

            <Link
              href="/create"
              className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors text-base"
            >
              Start Creating Free
            </Link>

            <button
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary/10 transition-colors text-base"
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full" />
              100 free signup credits
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full" />
              No credit card required
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full" />
              5–15 second videos
            </div>
          </div>
        </div>
      </section>

      <DemoModal open={showDemo} onOpenChange={setShowDemo} />
    </>
  )
}