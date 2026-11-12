export type VideoJobType = 'text-to-video'

export type VideoJobStatus =
  | 'pending'
  | 'processing'
  | 'done'
  | 'failed'

export type VideoJob = {
  id: string
  userId: string
  prompt: string
  type: VideoJobType
  status: VideoJobStatus
  duration?: 5 | 10 | 15
  resolution?: '720p' | '1080p'
  generatorId?: string
  videoUrl?: string
  error?: string
  createdAt: number
  updatedAt: number
}

/**
 * Legacy compatibility exports.
 * Video generation is handled by:
 * /api/generate
 * /api/generate/status
 */

export function addToQueue(
  _job: Omit<
    VideoJob,
    'status' | 'createdAt' | 'updatedAt'
  >
): string {
  throw new Error(
    'The legacy queue is disabled. Use the video generation API.'
  )
}

export function getJobStatus(
  _id: string
): VideoJob | undefined {
  return undefined
}

export function getUserJobs(
  _userId: string
): VideoJob[] {
  return []
}

export function removeJob(
  _id: string
): boolean {
  return false
}

export function getQueueStats() {
  return {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    running: 0,
    maxConcurrent: 0,
  }
}