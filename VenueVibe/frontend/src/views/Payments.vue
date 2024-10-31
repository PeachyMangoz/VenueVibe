<template>
  <div class="container section-title" data-aos="fade-up">
    <h2>
      <div class="title-with-lines">
        <span class="line"></span>
        Payments
        <span class="line"></span>
      </div>
    </h2>
  </div>
  <div class="payments-page">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div class="payments-container">
      <div class="header">
        <button
          @click="showPaymentModal = true"
          class="add-payment-btn"
          :disabled="loading"
        >
          + Add Payment Method
        </button>
      </div>

      <div class="section">
        <h2 class="section-title">Payment Methods</h2>
        <div v-if="paymentMethods.length === 0" class="empty-state">
          <p>No payment methods added yet</p>
        </div>
        <div v-else class="payment-methods">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            class="payment-method-card"
          >
            <div class="card-content">
              <div class="card-icon" :class="method.brand">
                <span v-if="method.brand === 'visa'">Visa</span>
                <span v-else-if="method.brand === 'mastercard'"
                  >Mastercard</span
                >
                <span v-else>Card</span>
              </div>
              <div class="card-details">
                <p class="card-number">•••• •••• •••• {{ method.last4 }}</p>
                <p class="card-expiry">
                  Expires {{ method.expMonth }}/{{ method.expYear }}
                </p>
              </div>
            </div>
            <div class="card-actions">
              <button
                v-if="!method.isDefault"
                @click="setDefaultPaymentMethod(method.id)"
                class="set-default-btn"
              >
                Set as Default
              </button>
              <span v-else class="default-badge">Default</span>
              <button
                @click="removePaymentMethod(method.id)"
                class="remove-btn"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Transaction History</h2>
        <div class="transaction-filters">
          <select v-model="filterStatus" class="filter-select">
            <option value="all">All Transactions</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <input type="month" v-model="filterMonth" class="filter-month" />
        </div>

        <div v-if="filteredTransactions.length === 0" class="empty-state">
          <p>No transactions found</p>
        </div>
        <div v-else class="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in filteredTransactions"
                :key="transaction.id"
              >
                <td>{{ formatDate(transaction.date) }}</td>
                <td>{{ transaction.description }}</td>
                <td>{{ formatAmount(transaction.amount) }}</td>
                <td>
                  <span
                    :class="['status-badge', transaction.status.toLowerCase()]"
                  >
                    {{ transaction.status }}
                  </span>
                </td>
                <td>•••• {{ transaction.last4 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showPaymentModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Add Payment Method</h3>
          <button @click="closePaymentModal" class="close-btn">✕</button>
        </div>
        <div class="modal-content">
          <div id="stripe-elements"></div>
          <div v-if="cardError" class="error-message">
            {{ cardError }}
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="closePaymentModal"
            class="cancel-btn"
            :disabled="processing"
          >
            Cancel
          </button>
          <button
            @click="submitPaymentMethod"
            class="submit-btn"
            :disabled="processing"
          >
            {{ processing ? "Processing..." : "Add Payment Method" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="notification" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { db } from '../firebase'
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc 
} from 'firebase/firestore'

export default {
  name: 'Payments',
  setup() {
    const stripe = ref(null)
    const elements = ref(null)
    const card = ref(null)
    const loading = ref(false)
    const processing = ref(false)
    const showPaymentModal = ref(false)
    const cardError = ref(null)
    const notification = ref(null)
    const userId = ref(null)
    const paymentMethods = ref([])
    const transactions = ref([])
    const filterStatus = ref('all')
    const filterMonth = ref('')
    const clientSecret = ref(null)

    // Initialize Stripe and create setup intent
    const initializeStripe = async () => {
      try {
        stripe.value = await loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY)
        
        // Get the setup intent from our backend
        const token = await getAuth().currentUser.getIdToken()
        const response = await fetch('/api/create-setup-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId.value
          })
        })
        
        const { clientSecret: secret } = await response.json()
        clientSecret.value = secret
        
        // Create and mount the card element
        elements.value = stripe.value.elements()
        card.value = elements.value.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#9e2146'
            }
          }
        })
        
        card.value.mount('#stripe-elements')
        
        card.value.addEventListener('change', (event) => {
          cardError.value = event.error ? event.error.message : null
        })
      } catch (error) {
        console.error('Error initializing Stripe:', error)
        showNotification('Failed to initialize payment form', 'error')
      }
    }


    onUnmounted(() => {
      if (card.value) {
        card.value.unmount()
      }
    })

    // Notification handler
    const showNotification = (message, type = 'success') => {
      notification.value = { message, type }
      setTimeout(() => {
        notification.value = null
      }, 3000)
    }

    // Fetch payment methods from Firestore
    const fetchPaymentMethods = async () => {
      loading.value = true
      try {
        const q = query(collection(db, 'paymentMethods'), where('userId', '==', userId.value))
        const querySnapshot = await getDocs(q)
        paymentMethods.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error fetching payment methods:', error)
        showNotification('Failed to load payment methods', 'error')
      } finally {
        loading.value = false
      }
    }

    // Fetch transactions from Firestore
    const fetchTransactions = async () => {
      loading.value = true
      try {
        const q = query(collection(db, 'transactions'), where('userId', '==', userId.value))
        const querySnapshot = await getDocs(q)
        transactions.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error fetching transactions:', error)
        showNotification('Failed to load transactions', 'error')
      } finally {
        loading.value = false
      }
    }

    // Submit new payment method
    const submitPaymentMethod = async () => {
      processing.value = true
      try {
        const result = await stripe.value.confirmCardSetup(clientSecret.value, {
          payment_method: {
            card: card.value,
            billing_details: {
              // You can add billing details here if needed
            }
          }
        })

        if (result.error) {
          throw result.error
        }

        // Get the payment method details from Stripe
        const paymentMethod = await stripe.value.paymentMethods.retrieve(result.setupIntent.payment_method)

        // Save payment method to Firestore
        await addDoc(collection(db, 'paymentMethods'), {
          userId: userId.value,
          paymentMethodId: result.setupIntent.payment_method,
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year,
          isDefault: paymentMethods.value.length === 0
        })

        showNotification('Payment method added successfully')
        closePaymentModal()
        fetchPaymentMethods()
      } catch (error) {
        console.error('Error adding payment method:', error)
        cardError.value = error.message
      } finally {
        processing.value = false
      }
    }

    // Set default payment method
    const setDefaultPaymentMethod = async (methodId) => {
      loading.value = true
      try {
        const token = await getAuth().currentUser.getIdToken()
        const response = await fetch('/api/set-default-payment-method', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId.value,
            paymentMethodId: methodId
          })
        })

        if (!response.ok) {
          throw new Error('Failed to set default payment method')
        }

        // Update Firestore documents
        const currentDefault = paymentMethods.value.find(method => method.isDefault)
        if (currentDefault) {
          await updateDoc(doc(db, 'paymentMethods', currentDefault.id), {
            isDefault: false
          })
        }

        await updateDoc(doc(db, 'paymentMethods', methodId), {
          isDefault: true
        })

        showNotification('Default payment method updated')
        fetchPaymentMethods()
      } catch (error) {
        console.error('Error setting default payment method:', error)
        showNotification('Failed to update default payment method', 'error')
      } finally {
        loading.value = false
      }
    }

    // Remove payment method
    const removePaymentMethod = async (methodId) => {
      if (!confirm('Are you sure you want to remove this payment method?')) return

      loading.value = true
      try {
        const token = await getAuth().currentUser.getIdToken()
        const response = await fetch(`/api/payment-methods/${methodId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userId.value
          })
        })

        if (!response.ok) {
          throw new Error('Failed to remove payment method')
        }

        showNotification('Payment method removed')
        fetchPaymentMethods()
      } catch (error) {
        console.error('Error removing payment method:', error)
        showNotification('Failed to remove payment method', 'error')
      } finally {
        loading.value = false
      }
    }

    // Modal handlers
    const closePaymentModal = () => {
      showPaymentModal.value = false
      cardError.value = null
      if (card.value) {
        card.value.clear()
      }
    }

    // Utility functions
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount / 100)
    }

    // Computed properties
    const filteredTransactions = computed(() => {
      return transactions.value.filter(transaction => {
        const matchesStatus = filterStatus.value === 'all' || 
                          transaction.status.toLowerCase() === filterStatus.value
        
        const matchesMonth = !filterMonth.value || 
                         transaction.date.startsWith(filterMonth.value)
        
        return matchesStatus && matchesMonth
      })
    })

    return {
      loading,
      processing,
      showPaymentModal,
      cardError,
      notification,
      paymentMethods,
      transactions,
      filteredTransactions,
      filterStatus,
      filterMonth,
      submitPaymentMethod,
      setDefaultPaymentMethod,
      removePaymentMethod,
      closePaymentModal,
      formatDate,
      formatAmount
    }
  }
}
</script>

<style scoped>
.payments-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.add-payment-btn {
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-payment-btn:hover {
  background: #45a049;
}

.add-payment-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.payment-methods {
  display: grid;
  gap: 16px;
}

.payment-method-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  transition: box-shadow 0.2s;
}

.payment-method-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 60px;
  height: 40px;
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.card-icon.visa {
  color: #1a1f71;
}

.card-icon.mastercard {
  color: #eb001b;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-number {
  font-weight: 500;
  color: #333;
}

.card-expiry {
  font-size: 14px;
  color: #666;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.set-default-btn {
  padding: 6px 12px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.set-default-btn:hover {
  background: #1976d2;
}

.remove-btn {
  padding: 6px 12px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background: #cc0000;
}

.default-badge {
  padding: 4px 8px;
  background: #e8f5e9;
  color: #388e3c;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.transaction-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-select,
.filter-month {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  min-width: 150px;
  font-size: 14px;
  color: #333;
}

.filter-select:focus,
.filter-month:focus {
  outline: none;
  border-color: #2196f3;
}

.transactions-table {
  overflow-x: auto;
  border: 1px solid #eee;
  border-radius: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #444;
  white-space: nowrap;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background: #f8f9fa;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-badge.successful {
  background: #e8f5e9;
  color: #388e3c;
}

.status-badge.pending {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.failed {
  background: #ffebee;
  color: #d32f2f;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

.modal-content {
  padding: 24px;
}

#stripe-elements {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 8px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.submit-btn {
  padding: 8px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background: #45a049;
}

.submit-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: #4caf50;
}

.notification.error {
  background: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .payments-page {
    padding: 16px;
  }

  .header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .add-payment-btn {
    width: 100%;
  }

  .transaction-filters {
    flex-direction: column;
  }

  .payment-method-card {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .card-content {
    flex-direction: column;
  }

  .card-actions {
    width: 100%;
    justify-content: center;
  }

  .modal {
    width: 95%;
    margin: 0 10px;
  }

  .transactions-table {
    margin: 0 -16px;
    width: calc(100% + 32px);
    border-radius: 0;
  }

  th,
  td {
    padding: 8px 12px;
  }

  .filter-select,
  .filter-month {
    width: 100%;
  }
}

.section-title {
  text-align: center;
  margin-bottom: 50px;
  padding: 30px 0;
}

.section-title h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.title-with-lines {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.line {
  width: 70px;
  height: 3px;
  background: #36b598;
  display: inline-block;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  animation: fadeIn 1.5s;
}
</style>
