'use client'

export default function Savings() {
return (
<section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
<div className="max-w-4xl mx-auto text-center">
<div className="inline-block mb-4 px-4 py-2 bg-primary/20 rounded-full">
<span className="text-primary font-semibold text-sm">
Create More With AZIBO
</span>
</div>

    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
      Powerful AI Video Creation in One Place
    </h2>

    <p className="text-xl text-muted-foreground mb-12 text-balance max-w-2xl mx-auto">
      Create engaging AI videos without juggling multiple video
      generation platforms. AZIBO STUDIO brings everything together
      in one simple text-to-video workspace.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="p-6 bg-card/80 border border-border rounded-lg text-left">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Multiple AI Tools
        </h3>

        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-muted-foreground">
            <span className="text-red-500">✕</span>
            Multiple video platforms to manage
          </li>

          <li className="flex items-center gap-3 text-muted-foreground">
            <span className="text-red-500">✕</span>
            Separate subscriptions and billing
          </li>

          <li className="flex items-center gap-3 text-muted-foreground">
            <span className="text-red-500">✕</span>
            Different interfaces and workflows
          </li>

          <li className="flex items-center gap-3 text-muted-foreground">
            <span className="text-red-500">✕</span>
            More time switching between platforms
          </li>

          <li className="flex items-center gap-2 text-lg font-bold text-foreground mt-4 pt-4 border-t border-border">
            <span className="text-red-500">+</span>
            More tools to manage
          </li>
        </ul>
      </div>

      <div className="p-6 bg-card border-2 border-primary rounded-lg text-left">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          AZIBO STUDIO
        </h3>

        <ul className="space-y-3">
          <li className="flex items-center gap-3 text-foreground">
            <span className="text-primary">✓</span>
            One universal text-to-video generator
          </li>

          <li className="flex items-center gap-3 text-foreground">
            <span className="text-primary">✓</span>
            Create videos from simple text prompts
          </li>

          <li className="flex items-center gap-3 text-foreground">
            <span className="text-primary">✓</span>
            5–15 second video generation
          </li>

          <li className="flex items-center gap-3 text-foreground">
            <span className="text-primary">✓</span>
            720p and 1080p output options
          </li>

          <li className="flex items-center gap-2 text-lg font-bold text-primary mt-4 pt-4 border-t border-border">
            <span className="text-primary">✓</span>
            Plans from ₦72k/month
          </li>
        </ul>
      </div>
    </div>

    <p className="text-sm text-muted-foreground">
      One simple platform for creating, previewing, and downloading
      AI-generated videos with flexible plans designed for creators.
    </p>
  </div>
</section>

)
}