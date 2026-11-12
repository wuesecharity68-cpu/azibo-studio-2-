'use client'

import { Video, Sparkles } from 'lucide-react'

export default function WhyAzibo() {
return (
<section className="py-20 px-4 bg-card/50">
<div className="max-w-5xl mx-auto text-center">
<div className="flex justify-center mb-6">
<div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/20">
<Video className="h-8 w-8 text-primary" />
</div>
</div>

    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 text-balance">
      Create Amazing AI Videos with Ease
    </h2>

    <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto mb-10">
      Bring your imagination to life with one powerful AI video
      generator. Simply describe what you want, customize your
      video settings, and let AZIBO STUDIO do the rest.
    </p>

    <div className="max-w-2xl mx-auto rounded-2xl border border-primary/20 bg-card p-8 md:p-10">
      <div className="flex justify-center mb-5">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-4">
        One Generator. Endless Possibilities.
      </h3>

      <p className="text-muted-foreground leading-relaxed">
        Turn simple text descriptions into stunning AI-generated
        videos. Choose your preferred duration, resolution, and
        aspect ratio, then generate, preview, and download your
        video in one place.
      </p>
    </div>
  </div>
</section>

)
}