<template>
    <div class="payment-container">
      <div class="payment-form">
        <h2 class="payment-title">Payment Details</h2>
        <div class="card-element">
          <stripe-element-card
            v-if="publishableKey"
            ref="elementRef"
            :pk="publishableKey"
            @token="tokenCreated"
            :options="stripeOptions"
          />
        </div>
        <button 
          class="payment-button"
          @click="submit"
          :disabled="!publishableKey"
        >
          Generate token
        </button>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { StripeElementCard } from '@vue-stripe/vue-stripe'
  
  export default defineComponent({
    name: 'StripePayment',
    components: {
      StripeElementCard,
    },
    data() {
      return {
        publishableKey: '',
        token: null,
        error: null,
        stripeOptions: {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        },
      }
    },
    created() {
      this.publishableKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
      if (!this.publishableKey) {
        this.error = 'Payment system configuration error. Please try again later.'
        console.error('Stripe publishable key is not set')
      }
    },
    methods: {
      submit() {
        this.error = null
        if (this.$refs.elementRef) {
          this.$refs.elementRef.submit()
        } else {
          this.error = 'Payment form not loaded properly. Please refresh the page.'
        }
      },
      tokenCreated(token) {
        console.log('Token created:', token)
        this.token = token
        this.$emit('token-created', token)
      },
    },
  })
  </script>
  
  <style scoped>
  .payment-container {
    width: 100%;
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
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
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .card-element {
    padding: 1rem;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    background: #f8f9fa;
    margin-bottom: 1.5rem;
  }
  
  .payment-button {
    width: 100%;
    padding: 12px;
    background-color: #635BFF;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .payment-button:hover {
    background-color: #5851DB;
  }
  
  .payment-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #dc3545;
    margin-top: 1rem;
    text-align: center;
    font-size: 14px;
  }
  
  /* Responsive styling */
  @media (max-width: 600px) {
    .payment-container {
      padding: 1rem;
      margin: 1rem auto;
    }
  
    .payment-form {
      padding: 1rem;
    }
  }
  </style>