import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin.server'

export const runtime = 'nodejs'

interface TrackVisitBody {
  path?: string
  referrer?: string
  visitorId?: string
  sessionId?: string
}

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || null
  }

  return request.headers.get('x-real-ip')
}

function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  const ua = userAgent.toLowerCase()

  if (/tablet|ipad|playbook|silk/.test(ua)) {
    return 'tablet'
  }

  if (
    /mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile/.test(
      ua,
    )
  ) {
    return 'mobile'
  }

  if (ua) {
    return 'desktop'
  }

  return 'unknown'
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase()

  if (ua.includes('edg/')) return 'Edge'
  if (ua.includes('opr/') || ua.includes('opera')) return 'Opera'
  if (ua.includes('chrome/') && !ua.includes('edg/')) return 'Chrome'
  if (ua.includes('firefox/')) return 'Firefox'
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari'

  return 'Other'
}

function getOperatingSystem(userAgent: string): string {
  const ua = userAgent.toLowerCase()

  if (ua.includes('android')) return 'Android'
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) {
    return 'iOS'
  }
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('mac os')) return 'macOS'
  if (ua.includes('linux')) return 'Linux'

  return 'Other'
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackVisitBody

    const path =
      typeof body.path === 'string' && body.path.trim()
        ? body.path.trim().slice(0, 500)
        : '/'

    const referrer =
      typeof body.referrer === 'string'
        ? body.referrer.trim().slice(0, 1000)
        : ''

    const visitorId =
      typeof body.visitorId === 'string'
        ? body.visitorId.trim().slice(0, 200)
        : ''

    const sessionId =
      typeof body.sessionId === 'string'
        ? body.sessionId.trim().slice(0, 200)
        : ''

    const userAgent = request.headers.get('user-agent') || 'unknown'

    let userId: string | null = null
    let userEmail: string | null = null

    // Authentication is optional.
    // Anonymous visitors can still be tracked.
    const authorization = request.headers.get('authorization')

    if (authorization?.startsWith('Bearer ')) {
      const token = authorization.slice(7).trim()

      if (token) {
        try {
          const auth = getAdminAuth()
          const decodedToken = await auth.verifyIdToken(token)

          userId = decodedToken.uid
          userEmail = decodedToken.email ?? null
        } catch {
          // Invalid/expired tokens do not stop anonymous visitor tracking.
          userId = null
          userEmail = null
        }
      }
    }

    const db = getAdminDb()
    const visitRef = db.collection('site_visits').doc()

    await visitRef.set({
      visitorId: visitorId || null,
      sessionId: sessionId || null,

      userId,
      userEmail,

      path,
      referrer: referrer || null,

      device: getDeviceType(userAgent),
      browser: getBrowser(userAgent),
      operatingSystem: getOperatingSystem(userAgent),

      userAgent: userAgent.slice(0, 1000),

      // Kept for analytics/debugging only.
      // We do not permanently store the visitor's raw IP.
      ipPresent: Boolean(getClientIp(request)),

      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Visitor tracking error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Unable to record visit',
      },
      { status: 500 },
    )
  }
}