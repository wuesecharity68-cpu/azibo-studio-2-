'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="inline-block text-2xl font-bold text-primary mb-4"
            >
              AZIBO STUDIO
            </Link>

            <p className="text-muted-foreground max-w-md leading-relaxed">
              Create engaging AI videos from simple text prompts. Generate
              animal, realistic human, 3D, and anime videos in one creative
              workspace.
            </p>

            <div className="flex items-center gap-2 mt-5 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span>We&apos;re here to help</span>
            </div>
          </div>

          {/* Create */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Create
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                href="/create"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Create Videos
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              AZIBO
            </h3>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                href="/pricing"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </Link>

              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Dashboard
              </Link>

              <Link
                href="/support"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Support
              </Link>

              <Link
                href="/auth/signup"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AZIBO STUDIO. All rights reserved.
          </p>

          <p className="text-sm text-muted-foreground text-center sm:text-right">
            AI video creation made simple.
          </p>
        </div>
      </div>
    </footer>
  )
}