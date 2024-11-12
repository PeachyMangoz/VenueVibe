<template>
  <div class="payment-container">
    <div class="payment-form">
      <h2 class="payment-title">Payment Details</h2>
      
      <!-- Card element container -->
      <div class="stripe-card-container">
        <div ref="cardElement" class="card-element"></div>
      </div>

      <!-- Error display -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Submit button -->
      <button 
        class="payment-button"
        @click="handleSubmit"
        :disabled="!isReady || isProcessing"
      >
        {{ isProcessing ? 'Processing...' : 'Pay Now' }}
      </button>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js'

export default {
  name: 'StripePayment',
  
  data() {
    return {
      stripe: null,
      card: null,
      error: null,
      isProcessing: false,
      isReady: false
    }
  },

  async mounted() {
    try {
      // Initialize Stripe
      const stripeKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
      this.stripe = await loadStripe(stripeKey)

      // Create the card element
      const elements = this.stripe.elements()
      this.card = elements.create('card', {
        style: {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      })

      // Mount the card element
      this.card.mount(this.$refs.cardElement)

      // Handle real-time validation errors
      this.card.on('change', (event) => {
        this.error = event.error ? event.error.message : ''
        this.isReady = event.complete
      })

    } catch (err) {
      console.error('Stripe setup error:', err)
      this.error = 'Failed to load payment system'
    }
  },

  methods: {
    async handleSubmit() {
      if (!this.stripe || !this.card) {
        this.error = 'Payment system is not initialized'
        return
      }

      try {
        this.isProcessing = true
        this.error = null

        // Create payment method
        const { token, error } = await this.stripe.createToken(this.card)

        if (error) {
          throw error
        }

        // Emit the token
        this.$emit('token-created', token)
        
        // Clear form
        this.card.clear()

      } catch (err) {
        this.error = err.message || 'Payment processing failed'
      } finally {
        this.isProcessing = false
      }
    }
  },

  beforeUnmount() {
    if (this.card) {
      this.card.unmount()
    }
  }
}
</script>

<style scoped>
.payment-container {
  width: 100%;
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
}

.payment-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.payment-title {
  color: #32325d;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
}

.stripe-card-container {
  margin-bottom: 1.5rem;
}

.card-element {
  padding: 1rem;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: white;
  min-height: 40px;
}

.error-message {
  color: #fa755a;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #fff8f6;
  border-radius: 4px;
  text-align: center;
  font-size: 0.875rem;
}

.payment-button {
  width: 100%;
  padding: 0.75rem;
  background: #5469d4;
  color: white;
  border: 0;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.payment-button:hover {
  background: #4a5ec4;
}

.payment-button:disabled {
  background: #a3acca;
  cursor: not-allowed;
}
</style>