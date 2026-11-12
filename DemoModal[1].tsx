'use client'

import { X, Play } from 'lucide-react'

interface DemoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DemoModal({
  open,
  onOpenChange,
}: DemoModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="AZIBO STUDIO demo"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute -top-10 right-0 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close demo"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative w-full aspect-video bg-card border border-border rounded-lg overflow-hidden flex items-center justify-center">
          <div className="text-center px-6">
            <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Play className="h-8 w-8 text-primary ml-1" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              AZIBO STUDIO Demo
            </h2>

            <p className="text-muted-foreground max-w-md mx-auto">
              See how AZIBO STUDIO turns simple text prompts into engaging
              AI videos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}