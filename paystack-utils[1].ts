import {
  createHmac,
  timingSafeEqual,
} from 'crypto'

export type PaystackPlanId =
  | 'starter'
  | 'creator'
  | 'professional'

export type PaystackBillingPeriod =
  | 'monthly'
  | 'quarterly'

export interface PaystackWebhookData {
  event: string
  data: {
    id: number
    reference: string
    amount: number
    paid_at?: string
    paidAt?: string
    customer: {
      id: number
      customer_code: string
      first_name: string
      last_name: string
      email: string
      phone?: string
    }
    metadata: {
      plan_id?: string
      user_id?: string
      plan_name?: string
      billing_period?: string
      units?: number
      [key: string]: unknown
    }
    status: string
    authorization?: {
      authorization_code: string
      bin: string
      last4: string
      exp_month: string
      exp_year: string
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
    }
  }
}

const PLAN_DETAILS = {
  starter: {
    monthly: { units: 50, amount: 72000 },
    quarterly: { units: 150, amount: 216000 },
  },
  creator: {
    monthly: { units: 150, amount: 198000 },
    quarterly: { units: 450, amount: 594000 },
  },
  professional: {
    monthly: { units: 300, amount: 398000 },
    quarterly: { units: 900, amount: 1194000 },
  },
} as const

export const verifyPaystackSignature = (
  body: string,
  signature: string,
  secret: string
): boolean => {
  if (!body || !signature || !secret) {
    return false
  }

  try {
    const expected = createHmac(
      'sha512',
      secret
    )
      .update(body)
      .digest()

    if (!/^[a-fA-F0-9]{128}$/.test(signature)) {
      return false
    }

    const received = Buffer.from(
      signature,
      'hex'
    )

    return (
      received.length === expected.length &&
      timingSafeEqual(received, expected)
    )
  } catch {
    return false
  }
}

export const processPaystackPayment = async (
  webhookData: PaystackWebhookData,
  updateUnits: (
    userId: string,
    units: number,
    planId: PaystackPlanId,
    billingPeriod: PaystackBillingPeriod
  ) => Promise<void>
) => {
  const { data } = webhookData

  if (webhookData.event !== 'charge.success') {
    throw new Error('Unsupported Paystack event.')
  }

  if (data.status !== 'success') {
    throw new Error('Payment was not successful.')
  }

  if (
    !data.reference ||
    !data.customer?.email ||
    !data.metadata
  ) {
    throw new Error('Invalid payment data.')
  }

  const userId = data.metadata.user_id
  const planId = data.metadata.plan_id
  const billingPeriod =
    data.metadata.billing_period

  if (
    typeof userId !== 'string' ||
    !userId.trim()
  ) {
    throw new Error('Invalid user ID.')
  }

  if (
    planId !== 'starter' &&
    planId !== 'creator' &&
    planId !== 'professional'
  ) {
    throw new Error('Invalid subscription plan.')
  }

  if (
    billingPeriod !== 'monthly' &&
    billingPeriod !== 'quarterly'
  ) {
    throw new Error('Invalid billing period.')
  }

  const expected =
    PLAN_DETAILS[planId][billingPeriod]

  if (
    data.amount !== expected.amount * 100
  ) {
    throw new Error(
      'Payment amount does not match the subscription plan.'
    )
  }

  if (
    data.metadata.units !== undefined &&
    data.metadata.units !== expected.units
  ) {
    throw new Error(
      'Payment units do not match the subscription plan.'
    )
  }

  await updateUnits(
    userId,
    expected.units,
    planId,
    billingPeriod
  )

  return {
    reference: data.reference,
    amount: data.amount,
    customer_email: data.customer.email,
    timestamp:
      data.paidAt ??
      data.paid_at ??
      new Date().toISOString(),
    planId,
    billingPeriod,
    units: expected.units,
  }
}