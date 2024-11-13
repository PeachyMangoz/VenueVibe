<template>
  <div class="img-container">
  <div class="payment-page">
    <div class="container section-title" data-aos="fade-up">
      <h2>
        <div class="title-with-lines heading-montserrat">
          Payment
        </div>
      </h2>
    </div>

    <div class="payment-container">
      <div class="payment-section">
        <StripePayment @token-created="handleToken" />
      </div>

      <div class="history-section">
        <div class="container section-title" data-aos="fade-up">
          <h2>
            <div class="title-with-lines heading-montserrat">
              Transaction History
            </div>
          </h2>
        </div>

        <div class="transaction-list">
          <div class="filter-section">
            <select v-model="filterStatus" class="filter-select">
              <option value="all">All Transactions</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div class="table-container">
            <table class="transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="transaction in filteredTransactions" 
                    :key="transaction.id"
                    :class="{'status-completed': transaction.status === 'completed',
                            'status-pending': transaction.status === 'pending',
                            'status-failed': transaction.status === 'failed'}">
                  <td>{{ formatDate(transaction.date) }}</td>
                  <td>${{ transaction.amount.toFixed(2) }}</td>
                  <td>
                    <span class="status-badge" :class="transaction.status">
                      {{ transaction.status }}
                    </span>
                  </td>
                  <td>{{ transaction.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredTransactions.length === 0" class="empty-state">
            <p>No transactions found</p>
          </div>

          <div class="pagination">
            <button 
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="pagination-button"
            >
              Previous
            </button>
            <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button 
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import StripePayment from '@/components/StripePayment.vue'

export default {
  name: 'PaymentPage',
  components: {
    StripePayment
  },
  data() {
    return {
      transactions: [
        {
          id: 1,
          date: new Date('2024-03-09'),
          amount: 150.00,
          status: 'completed',
          description: 'Booth Rental - Tech and Innovations'
        },
        {
          id: 2,
          date: new Date('2024-03-08'),
          amount: 75.00,
          status: 'pending',
          description: 'Booth Rental - Arts & Craft'
        },
        {
          id: 3,
          date: new Date('2024-03-07'),
          amount: 200.00,
          status: 'failed',
          description: 'Event Registration'
        },
      ],
      filterStatus: 'all',
      currentPage: 1,
      itemsPerPage: 5
    }
  },
  computed: {
    filteredTransactions() {
      let filtered = this.transactions
      if (this.filterStatus !== 'all') {
        filtered = this.transactions.filter(t => t.status === this.filterStatus)
      }
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return filtered.slice(start, end)
    },
    totalPages() {
      const filtered = this.filterStatus === 'all' 
        ? this.transactions 
        : this.transactions.filter(t => t.status === this.filterStatus)
      return Math.ceil(filtered.length / this.itemsPerPage)
    }
  },
  methods: {
    async handleToken(token) {
      try {
        console.log('Payment token received:', token)
        
        // Add the transaction to the list
        const newTransaction = {
          id: this.transactions.length + 1,
          date: new Date(),
          amount: 100.00, // Replace with actual amount from your payment process
          status: 'pending',
          description: 'Payment Processing'
        }
        
        this.transactions.unshift(newTransaction)
        
        // Here you would typically make an API call to your backend
        // to process the payment with the token
        
        // Show success message
        this.$nextTick(() => {
          alert('Payment is being processed')
        })
        
        // Optional: Update the transaction status after backend confirms
        setTimeout(() => {
          newTransaction.status = 'completed'
        }, 2000)

      } catch (error) {
        console.error('Payment processing error:', error)
        
        // Add failed transaction to the list
        this.transactions.unshift({
          id: this.transactions.length + 1,
          date: new Date(),
          amount: 100.00,
          status: 'failed',
          description: 'Payment Failed'
        })
        
        alert('Payment processing failed: ' + error.message)
      }
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    }
  },
  watch: {
    filterStatus() {
      // Reset to first page when filter changes
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
.img-container{
  background-image: url('@/images/img12.jpg');
  background-size: cover
}
.payment-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.payment-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Section Title Styles */
.section-title {
  text-align: center;
  padding: 30px 0;
  position: relative;
}

.section-title h2 {
  font-size: 50px;
  font-weight: 700;
  color: #333;
}

/* Title with lines style */
.title-with-lines {
  position: relative;
  display: inline-block;
  padding: 0 20px;
}

.title-with-lines::before,
.title-with-lines::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 60px;
  height: 2px;
  background-color: #36b598;
}

.title-with-lines::before {
  right: 100%;
}

.title-with-lines::after {
  left: 100%;
}

/* Transaction History Styles */
.history-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 1rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  width: 200px;
  background-color: white;
}

.table-container {
  overflow-x: auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.transaction-table th,
.transaction-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e6e6e6;
}

.transaction-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.transaction-table tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
}

.status-badge.completed {
  background-color: #dcf5dc;
  color: #0a5d0a;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.failed {
  background-color: #f8d7da;
  color: #721c24;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem 0;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #495057;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #ddd;
}

.pagination-button:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.7;
}

.page-info {
  color: #6c757d;
  font-size: 0.875rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .payment-page {
    padding: 1rem;
  }
  
  .section-title h2 {
    font-size: 36px;
  }
  
  .transaction-table {
    font-size: 0.875rem;
  }
  
  .status-badge {
    font-size: 0.75rem;
  }
  
  .title-with-lines::before,
  .title-with-lines::after {
    width: 30px;
  }
  
  .filter-select {
    width: 100%;
  }
}
</style>