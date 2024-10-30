<template>
  <div >
           <!-- Section Title -->
    <div class="container section-title" data-aos="fade-up">
    <h2>Event Reviews</h2></div>
    <div class="row mb-4">
      <div class="col-md-1"></div>
      <div class="col-md-5">
        <div class="card h-100">
          <div class="card-body">
            <h2>Search Reviews</h2>
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
      <div class="col-md-5">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="card-title">Submit Your Review</h2>
            <button class="btn green-btn" @click="openReviewModal">
              Open Review Form
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="searchEventId && filteredReviews.length > 0" class="row mb-4 m-3">

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

    <section id="reviews" class="reviews-section section">
      <div>
        <p v-if="filteredReviews.length === 0" class="text-muted">
          No reviews found for this event.
        </p>
      </div>

      <div class="container">
        <div class="row gy-4">
          <!-- Review Card -->
          <div v-for="(review, index) in filteredReviews" 
              :key="index" 
              class="col-xl-4 col-md-6" 
              data-aos="fade-up" 
              :data-aos-delay="100 * (index + 1)">
            <article class="card h-100">
              <!-- Review Image -->
              <div class="post-img">
                <img v-if="review.imageFile" 
                    :src="review.imageFile" 
                    class="img-fluid w-100" 
                    alt="Review Image" 
                    style="height: 250px; object-fit: cover;">
                <video v-if="review.videoFile" 
                      :src="review.videoFile" 
                      class="img-fluid w-100" 
                      controls></video>
              </div>

              <!-- Category -->
              <div class="card-body">
                <p class="post-category d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shop me-2" viewBox="0 0 16 16">
                    <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z"/>
                  </svg>
                  {{ review.category }}
                </p>

                <!-- Title/Description -->
                <h2 class="title">
                  <a href="#" class="text-decoration-none">Event {{ review.eventId }}</a>
                </h2>
                <p class="card-text mb-4 text-center">" {{ review.description }} "</p>

                <!-- Author Info -->
                <div class="d-flex align-items-center">
                  <img src="https://via.placeholder.com/50" alt="" class="rounded-circle me-3" style="width: 50px; height: 50px;">
                  <div class="post-meta">
                    <p class="post-author mb-0">{{ review.username }}</p>
                    <p class="post-date mb-0 text-muted">
                      Rating: {{ review.rating }}/5
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>


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
                <label for="category" class="form-label">Category:</label>
                <select id="category" v-model="newReview.category" class="form-select" required>
                  <option value="" disabled selected>Select a category</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                  <option value="Artist, Creator, Crafts">Artist, Creator, Crafts</option>
                  <option value="Jewellery & Accessories">Jewellery & Accessories</option>
                  <option value="Fashion, Apparel & Clothing">Fashion, Apparel & Clothing</option>
                  <option value="Family & Pets">Family & Pets</option>
                  <option value="Others">Others</option>
                </select>
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
      category: "",
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
    const categories = {
        "Food & Beverages": 0,
        "Artist, Creator, Crafts": 0,
        "Jewellery & Accessories": 0,
        "Fashion, Apparel & Clothing": 0,
        "Family & Pets":0,
        "Others": 0
    };

    filteredReviews.value.forEach((review) => {
        const category = review.category; // Now using the category directly instead of parsing as int
        
        // Using direct string comparison since we're working with string values from dropdown
        if (categories.hasOwnProperty(category)) {
            categories[category]++;
        } else {
            categories["Others"]++;
        }
    });

    return categories;
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
        category: "",
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
        { eventId: "001", username: "User1", rating: 4, description: "Great event!", category: "Food & Beverages", imageFile: "https://picsum.photos/600/400?random=1"},
        { eventId: "002", username: "User2", rating: 5, description: "Awesome experience!", category: "Artist, Creator, Crafts", imageFile: "https://picsum.photos/600/400?random=2" },
        { eventId: "001", username: "User3", rating: 3, description: "Good, but could be better.", category: "Jewellery & Accessories", imageFile: "https://picsum.photos/600/400?random=3" },
        { eventId: "001", username: "User4", rating: 5, description: "Loved it!", category: "Fashion, Apparel & Clothing",imageFile: "https://picsum.photos/600/400?random=4" },
        { eventId: "002", username: "User5", rating: 4, description: "Very enjoyable.", category: "Food & Beverages", imageFile: "https://picsum.photos/600/400?random=5" },
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

.card {
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

h2{
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  gap: 20px;
  color: #545252;
}

.reviews-section {
  padding: 60px 0;
  background-color: #f6f6f6;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #333;
}

.section-title h2::before,
.section-title h2::after {
  content: '';
  flex: 0 0 70px; /* Fixed width for lines */
  height: 3px;
  background: #36b598;
  display: inline-block;
}

.post-category {
  font-size: 14px;
  color: #36b598;
  margin-bottom: 10px;
  font-weight: 500;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.title a {
  color: #333;
  transition: 0.3s;
}

.title a:hover {
  color: #36b598;
}

.post-author {
  font-weight: 600;
  font-size: 16px;
}

.post-date {
  font-size: 14px;
}

.card {
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}


</style>