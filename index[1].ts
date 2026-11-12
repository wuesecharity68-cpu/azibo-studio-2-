import type {
  VideoGenerationRequest,
  VideoGenerationTask,
  VideoGeneratorProvider,
} from './types'

const PIKA_API_URL = (
  process.env.PIKA_API_URL ??
  'https://api.dev.pika.art/v1'
).replace(/\/+$/, '')

const PIKA_KLING_API_KEY = process.env.PIKA_KLING_API_KEY

function requireApiKey(): string {
  if (!PIKA_KLING_API_KEY) {
    throw new Error(
      'PIKA_KLING_API_KEY is not configured',
    )
  }

  return PIKA_KLING_API_KEY
}

function normalizeDuration(
  duration: VideoGenerationRequest['duration'],
): 5 | 10 | 15 {
  if (duration === 10) return 10
  if (duration === 15) return 15

  return 5
}

function normalizeResolution(
  resolution: VideoGenerationRequest['resolution'],
): '720p' | '1080p' {
  return resolution === '1080p'
    ? '1080p'
    : '720p'
}

function normalizeAspectRatio(
  aspectRatio: VideoGenerationRequest['aspectRatio'],
): '16:9' | '9:16' | '1:1' {
  if (aspectRatio === '9:16') return '9:16'
  if (aspectRatio === '1:1') return '1:1'

  return '16:9'
}

function normalizeProviderStatus(
  rawStatus?: string,
): VideoGenerationTask['status'] {
  const status = rawStatus?.toLowerCase().trim()

  if (
    status === 'queued' ||
    status === 'pending'
  ) {
    return 'pending'
  }

  if (
    status === 'running' ||
    status === 'processing'
  ) {
    return 'processing'
  }

  if (
    status === 'completed' ||
    status === 'complete' ||
    status === 'succeeded' ||
    status === 'success'
  ) {
    return 'completed'
  }

  if (
    status === 'failed' ||
    status === 'error' ||
    status === 'cancelled' ||
    status === 'canceled'
  ) {
    return 'failed'
  }

  /*
   * Unknown provider states are treated as processing rather
   * than failed. This prevents AZIBO from refunding a generation
   * merely because the provider introduced a new intermediate
   * status that this adapter does not yet recognize.
   */
  return 'processing'
}

async function getErrorMessage(
  response: Response,
): Promise<string> {
  const errorText = await response.text()

  if (!errorText) {
    return 'The video provider returned an empty error response.'
  }

  try {
    const parsed = JSON.parse(errorText) as {
      error?: string | {
        message?: string
      }
      message?: string
    }

    if (typeof parsed.error === 'string') {
      return parsed.error
    }

    if (
      parsed.error &&
      typeof parsed.error === 'object' &&
      typeof parsed.error.message === 'string'
    ) {
      return parsed.error.message
    }

    if (typeof parsed.message === 'string') {
      return parsed.message
    }
  } catch {
    // Response was not JSON; use the raw response below.
  }

  return errorText
}

const klingTurboProvider: VideoGeneratorProvider = {
  id: 'kling-3.0-turbo',
  name: 'Kling 3.0 Turbo',

  async createVideo(
    request: VideoGenerationRequest,
  ): Promise<VideoGenerationTask> {
    const apiKey = requireApiKey()

    const duration = normalizeDuration(
      request.duration,
    )

    const resolution = normalizeResolution(
      request.resolution,
    )

    const aspectRatio = normalizeAspectRatio(
      request.aspectRatio,
    )

    const response = await fetch(
      `${PIKA_API_URL}/media/kling/kling-3.0-turbo/text-to-video`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          duration,
          resolution,
          aspect_ratio: aspectRatio,
        }),
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      const errorMessage =
        await getErrorMessage(response)

      throw new Error(
        `Kling API request failed (${response.status}): ${errorMessage}`,
      )
    }

    const data = (await response.json()) as {
      id?: string
      status?: string
      error?: string
    }

    if (!data.id) {
      throw new Error(
        'Kling API did not return a job ID',
      )
    }

    const status = normalizeProviderStatus(
      data.status,
    )

    return {
      taskId: data.id,
      provider: 'kling-3.0-turbo',
      status,
      ...(data.error
        ? { error: data.error }
        : {}),
    }
  },

  async getVideoStatus(
    taskId: string,
  ): Promise<VideoGenerationTask> {
    const apiKey = requireApiKey()

    const response = await fetch(
      `${PIKA_API_URL}/media/jobs/${encodeURIComponent(
        taskId,
      )}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-API-Key': apiKey,
        },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      const errorMessage =
        await getErrorMessage(response)

      throw new Error(
        `Kling status request failed (${response.status}): ${errorMessage}`,
      )
    }

    const data = (await response.json()) as {
      id?: string
      status?: string
      output?: {
        media_type?: string
        video?: {
          url?: string
        }
      }
      error?: string | {
        message?: string
      }
    }

    const status = normalizeProviderStatus(
      data.status,
    )

    const videoUrl =
      data.output?.video?.url

    let providerError: string | undefined

    if (typeof data.error === 'string') {
      providerError = data.error
    } else if (
      data.error &&
      typeof data.error.message === 'string'
    ) {
      providerError = data.error.message
    }

    return {
      taskId: data.id ?? taskId,
      provider: 'kling-3.0-turbo',
      status,
      ...(videoUrl
        ? { videoUrl }
        : {}),
      ...(providerError
        ? { error: providerError }
        : {}),
    }
  },
}

export function getVideoGenerator(): VideoGeneratorProvider {
  return klingTurboProvider
}

export default klingTurboProvider