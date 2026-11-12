'use client'

import { useState } from 'react'
import {
  Download,
  Share2,
} from 'lucide-react'
import { useToast } from '@/lib/hooks/useToast'

interface VideoPlayerProps {
  videoUrl: string
  videoId: string
  onDownload?: () => void | Promise<void>
  userRole?: 'user' | 'owner'
  subscriptionPlan?:
    | 'free'
    | 'starter'
    | 'creator'
    | 'professional'
  fileSizeMB?: string
  watermarkRequired?: boolean
}

export function VideoPlayer({
  videoUrl,
  videoId,
  onDownload,
  userRole = 'user',
  subscriptionPlan = 'free',
  fileSizeMB = '',
  watermarkRequired,
}: VideoPlayerProps) {
  const [downloading, setDownloading] =
    useState(false)

  const { success, error } = useToast()

  const isOwner = userRole === 'owner'

  const isPaidSubscriber =
    subscriptionPlan === 'starter' ||
    subscriptionPlan === 'creator' ||
    subscriptionPlan === 'professional'

  const shouldHaveWatermark =
    watermarkRequired ??
    (isOwner || !isPaidSubscriber)

  const handleDownload = async () => {
    try {
      setDownloading(true)

      if (onDownload) {
        await onDownload()
        success('Video downloaded successfully')
        return
      }

      const response = await fetch(videoUrl)

      if (!response.ok) {
        throw new Error('Failed to fetch video')
      }

      const blob = await response.blob()

      const blobUrl =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement('a')

      link.href = blobUrl
      link.download =
        `azibo-video-${videoId}.mp4`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      window.URL.revokeObjectURL(blobUrl)

      success('Video downloaded successfully')
    } catch (err) {
      console.error(
        '[AZIBO] Download error:',
        err
      )

      error('Failed to download video')
    } finally {
      setDownloading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title:
            'Check out my AI video from AZIBO STUDIO',
          text:
            'I created this video using AZIBO STUDIO.',
          url: window.location.href,
        })

        success('Video shared successfully')
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        )

        success('Link copied to clipboard')
      }
    } catch (err) {
      console.error(
        '[AZIBO] Share error:',
        err
      )
    }
  }

  const downloadLabel = fileSizeMB
    ? `Download (${fileSizeMB})`
    : 'Download'

  return (
    <div className="space-y-6">
      <div className="relative w-full bg-background border border-border rounded-lg overflow-hidden">
        <video
          src={videoUrl}
          controls
          playsInline
          className="w-full aspect-video bg-black"
        />
      </div>

      <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <p className="text-sm text-foreground text-center">
          <span className="font-semibold text-primary">
            Watch your video before downloading.
          </span>{' '}
          Please review the generated video above
          before saving it.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="h-4 w-4" />

          {downloading
            ? 'Downloading...'
            : downloadLabel}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      {shouldHaveWatermark && (
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">
              AZIBO STUDIO Watermark:
            </span>{' '}
            This video includes the
            &quot;Made with AZIBO STUDIO&quot;
            watermark.
          </p>
        </div>
      )}

      {!shouldHaveWatermark && (
        <div className="p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">
            Your paid plan includes videos without
            the AZIBO STUDIO watermark.
          </p>
        </div>
      )}
    </div>
  )
}