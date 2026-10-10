import { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants'

const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js'
let razorpayScriptPromise

const loadRazorpayCheckout = () => {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = RAZORPAY_CHECKOUT_URL
      script.async = true
      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay)
        } else {
          razorpayScriptPromise = null
          reject(new Error('Payment checkout could not be initialized. Please try again.'))
        }
      }
      script.onerror = () => {
        razorpayScriptPromise = null
        reject(new Error('Unable to load secure checkout. Check your connection and try again.'))
      }
      document.body.appendChild(script)
    })
  }

  return razorpayScriptPromise
}

const plans = [
  {
    name: 'Silver',
    duration: '3 months',
    connections: '100 connections',
    description: 'A focused boost for growing your developer network.',
    featured: false,
    benefits: ['Chat with your connections', 'Connect with up to 100 people', 'Verified blue tick'],
  },
  {
    name: 'Gold',
    duration: '6 months',
    connections: '500 connections',
    description: 'More time and room to build meaningful connections.',
    featured: true,
    benefits: ['Chat with your connections', 'Connect with up to 500 people', 'Verified blue tick'],
  },
]

const Premium = () => {
  const user = useSelector((store) => store.user)
  const [checkoutStatus, setCheckoutStatus] = useState('')
  const [feedback, setFeedback] = useState(null)

  const handlePurchase = async (membershipType) => {
    setCheckoutStatus('creating')
    setFeedback(null)

    try {
      const Razorpay = await loadRazorpayCheckout()
      const { data: order } = await axios.post(
        `${BASE_URL}/payment/create`,
        { memberShiptype: membershipType },
        { withCredentials: true }
      )

      const orderId = order?.orderId || order?.id
      if (!order?.keyId || !orderId || !order?.amount || !order?.currency) {
        throw new Error('The payment order is missing checkout details. Please try again.')
      }

      const checkout = new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'DevSphere',
        description: `${membershipType} membership`,
        order_id: orderId,
        prefill: {
          name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
        },
        theme: { color: membershipType === 'Gold' ? '#d97706' : '#0891b2' },
        handler: async (payment) => {
          setCheckoutStatus('verifying')
          try {
            await axios.post(`${BASE_URL}/payment/verify`, payment, { withCredentials: true })
            setCheckoutStatus('success')
            setFeedback({
              type: 'success',
              message: 'Payment verified. Your membership is now active.',
            })
          } catch (error) {
            console.error('Payment verification failed:', error)
            setCheckoutStatus('')
            setFeedback({
              type: 'error',
              message: error.response?.data?.message || 'Payment was received, but verification failed. Please contact support.',
            })
          }
        },
        modal: {
          ondismiss: () => {
            setCheckoutStatus('')
            setFeedback({ type: 'info', message: 'Checkout was closed. You can try again whenever you’re ready.' })
          },
        },
      })

      checkout.on('payment.failed', (event) => {
        setCheckoutStatus('')
        setFeedback({
          type: 'error',
          message: event.error?.description || 'Payment could not be completed. Please try again.',
        })
      })
      checkout.open()
    } catch (error) {
      console.error('Unable to start membership checkout:', error)
      setCheckoutStatus('')
      setFeedback({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Unable to start checkout. Please try again.',
      })
    }
  }

  const isBusy = checkoutStatus === 'creating' || checkoutStatus === 'verifying'

  return (
    <div className="network-page premium-page px-4 py-10 sm:px-6">
      <main className="mx-auto max-w-6xl">
        <header className="premium-header mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">DevSphere membership</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Make more meaningful connections</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base-content/70">
            Choose a plan to unlock more ways to connect, chat, and grow your developer network.
          </p>
        </header>

        {feedback && (
          <div
            className={`alert premium-feedback mx-auto mb-6 max-w-3xl ${
              feedback.type === 'error'
                ? 'alert-error'
                : feedback.type === 'success'
                  ? 'alert-success'
                  : 'alert-info'
            }`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            <span>{feedback.message}</span>
          </div>
        )}

        {isBusy && (
          <p className="mb-6 text-center text-sm font-medium text-base-content/75" role="status">
            {checkoutStatus === 'verifying' ? 'Verifying your payment…' : 'Preparing secure checkout…'}
          </p>
        )}

        <section aria-label="Membership plans" className="premium-plans">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`premium-plan network-card relative flex flex-col rounded-3xl p-6 sm:p-8 ${
                plan.featured ? 'premium-plan-featured' : ''
              }`}
            >
              {plan.featured && (
                <span className="premium-plan-badge badge badge-primary self-start">Most popular</span>
              )}
              <div className="mt-3 flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${plan.featured ? 'text-amber-700' : 'text-cyan-700'}`}>
                    {plan.duration}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">{plan.name}</h2>
                </div>
                <span className={`premium-plan-mark ${plan.featured ? 'premium-plan-mark-gold' : ''}`} aria-hidden="true">
                  {plan.featured ? 'G' : 'S'}
                </span>
              </div>
              <p className="mt-3 min-h-12 leading-relaxed text-base-content/70">{plan.description}</p>
              <ul className="premium-benefits mt-6 space-y-3" aria-label={`${plan.name} membership benefits`}>
                {plan.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className={`premium-benefit-check ${plan.featured ? 'premium-benefit-check-gold' : ''}`} aria-hidden="true">
                      ✓
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="premium-plan-footer mt-7">
                <p className="text-sm font-medium text-base-content/60">{plan.connections} · {plan.duration}</p>
                <p className="mt-1 text-xs text-base-content/55">Price and currency confirmed in secure checkout</p>
                <button
                  type="button"
                  className={`btn mt-5 w-full ${plan.featured ? 'btn-primary' : 'btn-outline btn-secondary'}`}
                  onClick={() => handlePurchase(plan.name)}
                  disabled={isBusy || checkoutStatus === 'success'}
                >
                  {checkoutStatus === 'success'
                    ? 'Membership active'
                    : isBusy
                      ? 'Please wait…'
                      : `Choose ${plan.name}`}
                </button>
              </div>
            </article>
          ))}
        </section>

        <p className="mt-7 text-center text-sm text-base-content/65">
          Secure payment powered by Razorpay. Your membership is activated after payment verification.
        </p>
      </main>
    </div>
  )
}

export default Premium
