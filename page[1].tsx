'use client'

import { ToastDisplay } from '@/components/ToastDisplay'
import Hero from '@/components/sections/Hero'
import WhyAzibo from '@/components/sections/WhyAzibo'
import Savings from '@/components/sections/Savings'
import Testimonials from '@/components/sections/Testimonials'
import LaunchOfferCTA from '@/components/sections/LaunchOfferCTA'
import Footer from '@/components/sections/Footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <ToastDisplay />

      {/* Launch offer and countdown shown immediately at the top */}
      <LaunchOfferCTA />

      <Hero />
      <WhyAzibo />
      <Savings />
      <Testimonials />
      <Footer />
    </main>
  )
}