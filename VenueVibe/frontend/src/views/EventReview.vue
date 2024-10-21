<template>
  <div>
    <h1 class="mb-4">Event Review System</h1>
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title">Search Reviews</h2>
            <form @submit.prevent="searchReviews">
              <div class="input-group mb-3">
                <input type="text" v-model="searchEventId" class="form-control" placeholder="Enter Event ID" required />
                <button class="btn green-btn" type="submit">Search</button>
              </div>
              <p class="button-info">
                Click search button or enter to view data charts
              </p>
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
            <h2 class="card-title">
              Rating Distribution for Event {{ searchEventId }}
            </h2>
            <div class="chart-container">
              <canvas id="ratingChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <!-- im going to change this to category/type of seller instead of age demogrpahic eg 
             pet supplies/ artist / food -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title">
              Demographics for Event {{ searchEventId }}
            </h2>
            <div class="chart-container">
              <canvas id="demographicsChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- let me change the style for this -->
    <div class="card mb-4">
      <div class="card-body" style="background-color: #36b598">
        <h2 class="card-title green-btn">Event Reviews</h2>
        <div id="reviews-container">
          <div v-if="filteredReviews.length === 0" class="green-btn">
            No reviews found for this event.
          </div>
          <div v-for="(review, index) in filteredReviews" :key="index" class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">Event {{ review.eventId }}</h5>
              <h6 class="card-subtitle mb-2">
                Rating: {{ review.rating }}/5
              </h6>
              <h6 class="card-subtitle mb-2 text-muted">
                By: {{ review.username }}
                <!-- (Age: {{ review.age }}) -->
              </h6>
              <p class="card-text">{{ review.description }}</p>
              <img v-if="review.imageFile" :src="review.imageFile" class="review-media mb-2" alt="Review Image" />
              <video v-if="review.videoFile" :src="review.videoFile" class="review-media mb-2" controls></video>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="reviewModalLabel">
              Submit Your Review
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitReview">
              <div class="mb-3">
                <label for="eventId" class="form-label">Event ID:</label>
                <input type="text" id="eventId" v-model="newReview.eventId" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" id="username" v-model="newReview.username" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="age" class="form-label">Age:</label>
                <input type="number" id="age" v-model="newReview.age" class="form-control" required min="18"
                  max="100" />
              </div>
              <div class="mb-3">
                <label for="rating" class="form-label">Rating:</label>
                <select id="rating" v-model="newReview.rating" class="form-select" required>
                  <option value="">Select a rating</option>
                  <option v-for="n in 5" :key="n" :value="n">
                    {{ n }} - {{ ratingLabels[n] }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description & Opinion:</label>
                <textarea id="description" v-model="newReview.description" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label for="imageFile" class="form-label">Upload Image (optional):</label>
                <input type="file" id="imageFile" @change="handleImageUpload" class="form-control" accept="image/*" />
              </div>
              <div class="mb-3">
                <label for="videoFile" class="form-label">Upload Video (optional):</label>
                <input type="file" id="videoFile" @change="handleVideoUpload" class="form-control" accept="video/*" />
              </div>
              <button type="submit" class="btn btn-primary">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { nextTick } from 'vue';
import { Modal } from 'bootstrap';

import Chart from 'chart.js/auto';

export default {
  name: "EventReview",
  setup() {
    const newReview = ref({
      eventId: "",
      username: "",
      age: "",
      rating: "",
      description: "",
      imageFile: null,
      videoFile: null,
    });

    const reviews = ref([]);
    const searchEventId = ref("");
    const ratingLabels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    let ratingChart = null;
    let demographicsChart = null;
    let reviewModal = null;

    const filteredReviews = computed(() => {
      return searchEventId.value
        ? reviews.value.filter(
          (review) => review.eventId === searchEventId.value
        )
        : reviews.value;
    });

    const eventRatings = computed(() => {
      return [1, 2, 3, 4, 5].map(
        (rating) =>
          filteredReviews.value.filter((review) => review.rating === rating)
            .length
      );
    });

    const eventDemographics = computed(() => {
      const ageGroups = { "18-24": 0, "25-34": 0, "35-44": 0, "45+": 0 };
      filteredReviews.value.forEach((review) => {
        const age = parseInt(review.age);
        if (age < 25) ageGroups["18-24"]++;
        else if (age < 35) ageGroups["25-34"]++;
        else if (age < 45) ageGroups["35-44"]++;
        else ageGroups["45+"]++;
      });
      return ageGroups;
    });

    const openReviewModal = () => {
      reviewModal.show();
    };

    const submitReview = () => {
      reviews.value.push({ ...newReview.value });
      resetNewReview();
      updateCharts();
      reviewModal.hide();
    };

    const searchReviews = () => {
      updateCharts();
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        newReview.value.imageFile = URL.createObjectURL(file);
      }
    };

    const handleVideoUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        newReview.value.videoFile = URL.createObjectURL(file);
      }
    };

    const updateCharts = async () => {
      await nextTick();
      updateRatingChart();
      updateDemographicsChart();
    };

    const updateRatingChart = () => {
      const ctx = document.getElementById("ratingChart");

      if (!ctx) {
        return;
      }

      const canvas_ctx = ctx.getContext('2d');
      if (!canvas_ctx) {
        return; // Exit if context cannot be acquired
      }

      if (ratingChart) ratingChart.destroy();  // Clean up previous chart

      ratingChart = new Chart(ctx.getContext('2d'), {  // Ensure 2D context is acquired
        type: "bar",
        data: {
          labels: Object.values(ratingLabels),
          datasets: [
            {
              label: "Number of Reviews",
              data: eventRatings.value,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        },
      });
    };

    const updateDemographicsChart = () => {
      const ctx = document.getElementById("demographicsChart");
      if (!ctx) {
        return;
      }

      const canvas_ctx = ctx.getContext('2d');
      if (!canvas_ctx) {
        return; // Exit if context cannot be acquired
      }

      if (demographicsChart) demographicsChart.destroy();
      demographicsChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(eventDemographics.value),
          datasets: [
            {
              data: Object.values(eventDemographics.value),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    };

    const resetNewReview = () => {
      newReview.value = {
        eventId: "",
        username: "",
        age: "",
        rating: "",
        description: "",
        imageFile: null,
        videoFile: null,
      };
    };

    onMounted(async () => {
      await nextTick();
      // Add some sample reviews for testing
      reviews.value = [
        { eventId: "001", username: "User1", rating: 4, description: "Great event!", age: "28" },
        { eventId: "002", username: "User2", rating: 5, description: "Awesome experience!", age: "35" },
        { eventId: "001", username: "User3", rating: 3, description: "Good, but could be better.", age: "42" },
        { eventId: "001", username: "User4", rating: 5, description: "Loved it!", age: "22" },
        { eventId: "002", username: "User5", rating: 4, description: "Very enjoyable.", age: "31" },
      ];

      const modalElement = document.getElementById('reviewModal');
      if (modalElement) {
        reviewModal = new Modal(modalElement);
      }
      updateCharts();
    });

    return {
      newReview,
      reviews,
      searchEventId,
      ratingLabels,
      filteredReviews,
      openReviewModal,
      submitReview,
      searchReviews,
      handleImageUpload,
      handleVideoUpload,
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