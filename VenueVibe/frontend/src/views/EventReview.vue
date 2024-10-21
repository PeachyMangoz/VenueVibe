<template>
    <div class="container py-4">
      <h1 class="mb-4">Event Review System</h1>
  
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">Search Reviews</h2>
              <form @submit.prevent="searchReviews">
                <div class="input-group mb-3">
                  <input
                    type="text"
                    v-model="searchEventId"
                    class="form-control"
                    placeholder="Enter Event ID"
                    required
                  />
                  <button class="btn green-btn" type="submit">Search</button>
                </div>
                <p class="button-info">Click search button or enter to view data charts</p>
              </form>
            </div>
          </div>
        </div>
  
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">Submit Your Review</h2>
              <button class="btn green-btn" @click="openReviewModal">
                Open Review Form
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-if="searchEventId && filteredReviews.length > 0" class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">Rating Distribution for Event {{ searchEventId }}</h2>
              <div class="chart-container">
                <canvas ref="ratingChart"></canvas>
              </div>
            </div>
          </div>
        </div>
  
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">Demographics for Event {{ searchEventId }}</h2>
              <div class="chart-container">
                <canvas ref="demographicsChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="card mb-4">
        <div class="card-body" style="background-color: #36b598;">
          <h2 class="card-title green-btn">Event Reviews</h2>
          <div id="reviews-container">
            <div v-if="filteredReviews.length === 0" class="green-btn">
              No reviews found for this event.
            </div>
            <div
              v-for="(review, index) in filteredReviews"
              :key="index"
              class="card mb-3"
            >
              <div class="card-body">
                <h5 class="card-title">Event {{ review.eventId }}</h5>
                <h6 class="card-subtitle mb-2">Rating: {{ review.rating }}/5</h6>
                <h6 class="card-subtitle mb-2 text-muted">By: {{ review.username }}</h6>
                <p class="card-text">{{ review.description }}</p>
                <img
                  v-if="review.imageFile"
                  :src="review.imageFile"
                  class="review-media mb-2"
                  alt="Review Image"
                />
                <video
                  v-if="review.videoFile"
                  :src="review.videoFile"
                  class="review-media mb-2"
                  controls
                ></video>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Review Modal -->
      <div
        class="modal fade"
        id="reviewModal"
        tabindex="-1"
        aria-labelledby="reviewModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="reviewModalLabel">Submit Your Review</h5>
              <button
                type="button"
                class="btn-close"
                @click="closeReviewModal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitReview">
                <div class="mb-3">
                  <label for="eventId" class="form-label">Event ID:</label>
                  <input
                    type="text"
                    id="eventId"
                    v-model="newReview.eventId"
                    class="form-control"
                    required
                  />
                </div>
                <!-- Add more form fields here as needed -->
                <button type="submit" class="btn btn-primary">Submit Review</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
    name: 'EventReview',
    setup() {
      const newReview = ref({
        eventId: '',
        username: '',
        rating: '',
        description: '',
        imageFile: null,
        videoFile: null,
      });
  
      const reviews = ref([]);
      const searchEventId = ref('');
      const ratingChart = ref(null);
      const demographicsChart = ref(null);
  
      const filteredReviews = computed(() => {
        return searchEventId.value
          ? reviews.value.filter((review) => review.eventId === searchEventId.value)
          : reviews.value;
      });
  
      const openReviewModal = () => {
        const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
        modal.show();
      };
  
      const closeReviewModal = () => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
        modal.hide();
      };
  
      const submitReview = () => {
        reviews.value.push({ ...newReview.value });
        resetNewReview();
        updateCharts();
        closeReviewModal();
      };
  
      const searchReviews = () => {
        updateCharts();
      };
  
      const resetNewReview = () => {
        newReview.value = {
          eventId: '',
          username: '',
          rating: '',
          description: '',
          imageFile: null,
          videoFile: null,
        };
      };
  
      const updateCharts = () => {
        // Add logic to update charts (Rating & Demographics) using Chart.js
      };
  
      onMounted(() => {
        // Initial mock data
        reviews.value = [
          { eventId: '001', username: 'User1', rating: 4, description: 'Great event!' },
          { eventId: '002', username: 'User2', rating: 5, description: 'Awesome experience!' },
        ];
      });
  
      return {
        newReview,
        reviews,
        searchEventId,
        filteredReviews,
        openReviewModal,
        submitReview,
        searchReviews,
        updateCharts,
      };
    },
  };
  </script>
  
  <style scoped>
  .review-media {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
  }
  
  .green-btn {
    background-color: #36b598;
    color: white;
  }
  
  .chart-container {
    position: relative;
    height: 300px;
  }
  
  .button-info {
    color: grey;
    font-size: 0.75em;
    text-align: right;
  }
  
  .fade-in {
    animation: fadeIn 1.5s;
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  </style>
  