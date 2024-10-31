# EventReview.vue
<template>
  <div class="event-review-container">
    <LoadingOverlay v-if="loading" />
    
    <!-- Error Alert -->
    <div 
      v-if="error" 
      class="alert alert-danger alert-dismissible fade show m-3" 
      role="alert"
    >
      {{ error }}
      <button 
        type="button" 
        class="btn-close" 
        @click="error = null" 
        aria-label="Close"
      ></button>
    </div>

    <!-- Page Title -->
    <div class="container section-title" data-aos="fade-up">
      <h2>Event Reviews</h2>
    </div>

    <div class="row mb-4 mx-3">
      <ReviewSearch 
        v-model:searchId="searchEventId"
        :loading="loading"
        @search="searchReviews"
      />
      
      <div class="col-md-6">
        <ReviewFormButton 
          :loading="loading"
          @click="openReviewModal"
        />
      </div>
    </div>

    <!-- Charts Section -->
    <div v-if="searchEventId && filteredReviews.length > 0" class="row mb-4 mx-3">
      <RatingChart 
        :reviews="filteredReviews"
        :event-id="searchEventId"
      />
      <DemographicsChart 
        :reviews="filteredReviews"
        :event-id="searchEventId"
      />
    </div>

    <!-- Reviews Section -->
    <section id="reviews" class="reviews-section section">
      <div class="container" v-if="filteredReviews.length === 0">
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          No reviews found for this event.
        </div>
      </div>

      <div class="container" v-else>
        <div class="row gy-4">
          <div 
            v-for="(review, index) in filteredReviews" 
            :key="review.id" 
            class="col-xl-4 col-md-6" 
            data-aos="fade-up" 
            :data-aos-delay="100 * (index + 1)"
          >
            <ReviewCard 
              :review="review"
              @image-error="handleImageError"
            />
          </div>
        </div>
      </div>
    </section>

    <ReviewForm 
      ref="reviewFormRef"
      @submit="handleReviewSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useReviews } from '@/composables/useReviews';
import ReviewCard from '@/components/review/ReviewCard.vue';
import ReviewForm from '@/components/review/ReviewForm.vue';
import ReviewSearch from '@/components/review/ReviewSearch.vue';
import ReviewFormButton from '@/components/review/ReviewFormButton.vue';
import RatingChart from '@/components/review/ReviewCharts/RatingChart.vue';
import DemographicsChart from '@/components/review/ReviewCharts/DemographicsChart.vue';
// import LoadingOverlay from '@/components/review/LoadingOverlay.vue';

const reviewFormRef = ref(null);
const {
  reviews,
  filteredReviews,
  loading,
  error,
  searchEventId,
  fetchReviews,
  searchReviews,
  submitReview,
  setupRealtimeUpdates
} = useReviews();

const openReviewModal = () => {
  reviewFormRef.value?.openModal();
};

const handleReviewSubmit = async (reviewData) => {
  const success = await submitReview(reviewData);
  if (success) {
    reviewFormRef.value?.closeModal();
  }
};

const handleImageError = () => {
  error.value = 'Failed to load one or more images';
};

let unsubscribe;

onMounted(async () => {
  await fetchReviews();
  unsubscribe = setupRealtimeUpdates();
});

onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style src="@/styles/review.css" scoped />