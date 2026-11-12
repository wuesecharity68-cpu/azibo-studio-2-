type ClientEnv = {
  firebase: {
    apiKey: string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
  }

  paystack: {
    publicKey: string
  }

  pricing: {
    starter: {
      monthly: number
      quarterly: number
      monthlyPlanCode: string
      quarterlyPlanCode: string
    }

    creator: {
      monthly: number
      quarterly: number
      monthlyPlanCode: string
      quarterlyPlanCode: string
    }

    pro: {
      monthly: number
      quarterly: number
      monthlyPlanCode: string
      quarterlyPlanCode: string
    }
  }
}

type ServerEnv = {
  firebaseAdmin: {
    projectId: string
    clientEmail: string
    privateKey: string
  }

  paystack: {
    secretKey: string
  }
}

const requireEnv = (
  name: string,
  value: string | undefined
): string => {
  if (!value) {
    throw new Error(`Missing ENV: ${name}`)
  }

  return value
}

const parsePrice = (
  name: string,
  value: string | undefined,
  fallback: number
): number => {
  const parsed = Number(value ?? fallback)

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    throw new Error(
      `Invalid ENV price: ${name}`
    )
  }

  return parsed
}

export const getClientEnv = (): ClientEnv => {
  const firebaseApiKey = requireEnv(
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  )

  const firebaseAuthDomain = requireEnv(
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  )

  const firebaseProjectId = requireEnv(
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  )

  const firebaseStorageBucket = requireEnv(
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  )

  const firebaseMessagingSenderId = requireEnv(
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  )

  const firebaseAppId = requireEnv(
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  )

  const paystackPublicKey = requireEnv(
    'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY',
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
  )

  const starterMonthlyPlan = requireEnv(
    'NEXT_PUBLIC_STARTER_MONTHLY_PLAN',
    process.env.NEXT_PUBLIC_STARTER_MONTHLY_PLAN
  )

  const starterQuarterlyPlan = requireEnv(
    'NEXT_PUBLIC_STARTER_QUARTERLY_PLAN',
    process.env.NEXT_PUBLIC_STARTER_QUARTERLY_PLAN
  )

  const creatorMonthlyPlan = requireEnv(
    'NEXT_PUBLIC_CREATOR_MONTHLY_PLAN',
    process.env.NEXT_PUBLIC_CREATOR_MONTHLY_PLAN
  )

  const creatorQuarterlyPlan = requireEnv(
    'NEXT_PUBLIC_CREATOR_QUARTERLY_PLAN',
    process.env.NEXT_PUBLIC_CREATOR_QUARTERLY_PLAN
  )

  const proMonthlyPlan = requireEnv(
    'NEXT_PUBLIC_PRO_MONTHLY_PLAN',
    process.env.NEXT_PUBLIC_PRO_MONTHLY_PLAN
  )

  const proQuarterlyPlan = requireEnv(
    'NEXT_PUBLIC_PRO_QUARTERLY_PLAN',
    process.env.NEXT_PUBLIC_PRO_QUARTERLY_PLAN
  )

  return {
    firebase: {
      apiKey: firebaseApiKey,
      authDomain: firebaseAuthDomain,
      projectId: firebaseProjectId,
      storageBucket: firebaseStorageBucket,
      messagingSenderId:
        firebaseMessagingSenderId,
      appId: firebaseAppId,
    },

    paystack: {
      publicKey: paystackPublicKey,
    },

    pricing: {
      starter: {
        monthly: parsePrice(
          'NEXT_PUBLIC_STARTER_MONTHLY_PRICE',
          process.env
            .NEXT_PUBLIC_STARTER_MONTHLY_PRICE,
          72000
        ),

        quarterly: parsePrice(
          'NEXT_PUBLIC_STARTER_QUARTERLY_PRICE',
          process.env
            .NEXT_PUBLIC_STARTER_QUARTERLY_PRICE,
          216000
        ),

        monthlyPlanCode:
          starterMonthlyPlan,

        quarterlyPlanCode:
          starterQuarterlyPlan,
      },

      creator: {
        monthly: parsePrice(
          'NEXT_PUBLIC_CREATOR_MONTHLY_PRICE',
          process.env
            .NEXT_PUBLIC_CREATOR_MONTHLY_PRICE,
          198000
        ),

        quarterly: parsePrice(
          'NEXT_PUBLIC_CREATOR_QUARTERLY_PRICE',
          process.env
            .NEXT_PUBLIC_CREATOR_QUARTERLY_PRICE,
          594000
        ),

        monthlyPlanCode:
          creatorMonthlyPlan,

        quarterlyPlanCode:
          creatorQuarterlyPlan,
      },

      pro: {
        monthly: parsePrice(
          'NEXT_PUBLIC_PRO_MONTHLY_PRICE',
          process.env
            .NEXT_PUBLIC_PRO_MONTHLY_PRICE,
          398000
        ),

        quarterly: parsePrice(
          'NEXT_PUBLIC_PRO_QUARTERLY_PRICE',
          process.env
            .NEXT_PUBLIC_PRO_QUARTERLY_PRICE,
          1194000
        ),

        monthlyPlanCode:
          proMonthlyPlan,

        quarterlyPlanCode:
          proQuarterlyPlan,
      },
    },
  }
}

/*
 * Server-side environment variables.
 * These values must never be exposed to client-side code.
 */
export const getServerEnv = (): ServerEnv => {
  const firebaseAdminProjectId = requireEnv(
    'FIREBASE_ADMIN_PROJECT_ID',
    process.env.FIREBASE_ADMIN_PROJECT_ID
  )

  const firebaseAdminClientEmail = requireEnv(
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  )

  const firebaseAdminPrivateKey = requireEnv(
    'FIREBASE_ADMIN_PRIVATE_KEY',
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  )

  const paystackSecretKey = requireEnv(
    'PAYSTACK_SECRET_KEY',
    process.env.PAYSTACK_SECRET_KEY
  )

  return {
    firebaseAdmin: {
      projectId: firebaseAdminProjectId,
      clientEmail:
        firebaseAdminClientEmail,
      privateKey:
        firebaseAdminPrivateKey,
    },

    paystack: {
      secretKey: paystackSecretKey,
    },
  }
}