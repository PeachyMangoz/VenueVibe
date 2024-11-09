<template>
  <div class="payment-page">
    <div class="payment-grid">
      <div class="payment-section">
        <h2 class="section-title">Payment</h2>
        <StripePayment @token-created="handleToken" />
      </div>

      <div class="history-section">
        <h2 class="section-title">Transaction History</h2>
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
      return Math.ceil(this.transactions.length / this.itemsPerPage)
    }
  },
  methods: {
    handleToken(token) {
      console.log('Token received in parent:', token)
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    }
  }
}
</script>

<style scoped>
.payment-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.section-title {
  color: #32325d;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
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
}

.table-container {
  overflow-x: auto;
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
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
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
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.page-info {
  color: #6c757d;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .payment-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .payment-page {
    padding: 1rem;
  }
  
  .transaction-table {
    font-size: 0.875rem;
  }
  
  .status-badge {
    font-size: 0.75rem;
  }
}
</style>