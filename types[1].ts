export type VideoDuration = 5 | 10 | 15

export type VideoResolution =
  | '720p'
  | '1080p'

export type VideoAspectRatio =
  | '16:9'
  | '9:16'
  | '1:1'

export type VideoType =
  | 'animal'
  | 'realisticHuman'
  | '3dAnime'

export type VideoGenerationRequest = {
  prompt: string
  duration?: VideoDuration
  resolution?: VideoResolution
  aspectRatio?: VideoAspectRatio
  videoType?: VideoType
}

export type VideoGenerationTask = {
  taskId: string
  provider: string
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
  videoUrl?: string
  error?: string
}

export interface VideoGeneratorProvider {
  id: string
  name: string

  createVideo(
    request: VideoGenerationRequest
  ): Promise<VideoGenerationTask>

  getVideoStatus(
    taskId: string
  ): Promise<VideoGenerationTask>
}