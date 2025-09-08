// Stripe integration for subscription management
// Note: In production, most Stripe operations should be handled on the backend for security

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Up to 100 leads',
      'Basic lead scoring',
      '1 active sequence',
      'Email support'
    ],
    limits: {
      leads: 100,
      sequences: 1,
      aiRequests: 10
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      'Up to 1,000 leads',
      'Advanced AI lead scoring',
      'Unlimited sequences',
      'Email automation',
      'Analytics dashboard',
      'Priority support'
    ],
    limits: {
      leads: 1000,
      sequences: -1, // unlimited
      aiRequests: 500
    }
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    price: 199,
    priceId: 'price_business_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited leads',
      'Advanced AI features',
      'Unlimited sequences',
      'Team collaboration',
      'Custom integrations',
      'Dedicated support',
      'White-label options'
    ],
    limits: {
      leads: -1, // unlimited
      sequences: -1, // unlimited
      aiRequests: -1 // unlimited
    }
  }
}

// Initialize Stripe (client-side)
let stripe = null
if (STRIPE_PUBLISHABLE_KEY && typeof window !== 'undefined') {
  import('@stripe/stripe-js').then(({ loadStripe }) => {
    loadStripe(STRIPE_PUBLISHABLE_KEY).then(stripeInstance => {
      stripe = stripeInstance
    })
  })
}

// Check if user has reached plan limits
export function checkPlanLimits(user, resource, count) {
  const plan = SUBSCRIPTION_PLANS[user.subscriptionPlan?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
  const limit = plan.limits[resource]
  
  if (limit === -1) return { allowed: true, limit: 'unlimited' }
  
  return {
    allowed: count < limit,
    limit,
    current: count,
    remaining: Math.max(0, limit - count)
  }
}

// Get plan features and limits
export function getPlanInfo(planId) {
  return SUBSCRIPTION_PLANS[planId?.toUpperCase()] || SUBSCRIPTION_PLANS.FREE
}

// Create checkout session (this should be done on the backend in production)
export async function createCheckoutSession(priceId, userId, successUrl, cancelUrl) {
  try {
    // In production, this would be an API call to your backend
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl,
        cancelUrl
      })
    })

    const session = await response.json()
    
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      })
      
      if (error) {
        throw error
      }
    } else {
      throw new Error('Stripe not initialized')
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

// Create customer portal session (for managing subscriptions)
export async function createPortalSession(customerId, returnUrl) {
  try {
    // In production, this would be an API call to your backend
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl
      })
    })

    const session = await response.json()
    window.location.href = session.url
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw error
  }
}

// Mock functions for development (replace with real API calls in production)
export const mockStripeService = {
  async createCheckoutSession(planId, userId) {
    // Simulate checkout process
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Mock checkout for ${planId} plan initiated`
        })
      }, 1000)
    })
  },

  async cancelSubscription(userId) {
    // Simulate cancellation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Subscription cancelled successfully'
        })
      }, 1000)
    })
  },

  async updateSubscription(userId, newPlanId) {
    // Simulate plan change
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Subscription updated to ${newPlanId} plan`
        })
      }, 1000)
    })
  }
}

// Usage tracking for plan limits
export class UsageTracker {
  constructor(user) {
    this.user = user
    this.plan = getPlanInfo(user.subscriptionPlan)
  }

  canCreateLead(currentLeadCount) {
    return checkPlanLimits(this.user, 'leads', currentLeadCount)
  }

  canCreateSequence(currentSequenceCount) {
    return checkPlanLimits(this.user, 'sequences', currentSequenceCount)
  }

  canMakeAIRequest(currentAIRequestCount) {
    return checkPlanLimits(this.user, 'aiRequests', currentAIRequestCount)
  }

  getPlanFeatures() {
    return this.plan.features
  }

  getPlanLimits() {
    return this.plan.limits
  }
}
