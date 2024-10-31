# ReviewCard.vue
<template>
  <article class="card h-100 shadow-sm">
    <!-- Review Image -->
    <div class="post-img">
      <img 
        v-if="review.imageFile" 
        :src="review.imageFile" 
        class="img-fluid w-100" 
        alt="Review Image" 
        style="height: 250px; object-fit: cover;"
        @error="$emit('image-error')"
      />
      <div 
        v-else 
        class="no-image-placeholder d-flex align-items-center justify-content-center"
        style="height: 250px; background-color: #f8f9fa;"
      >
        <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
      </div>
    </div>

    <!-- Review Content -->
    <div class="card-body">
      <p class="post-category d-flex align-items-center">
        <i class="bi bi-shop me-2"></i>
        {{ review.category }}
      </p>

      <h2 class="title">
        <span class="event-title">{{ review.eventId }}</span>
      </h2>

      <p class="description text-center">
        "{{ review.description }}"
      </p>

      <!-- Author Info -->
      <div class="d-flex align-items-center mt-auto">
        <div class="user-avatar">
          <img src="../../images/img2.png" alt="User avatar">
        </div>
        <div class="post-meta">
          <p class="post-author mb-0">{{ review.username }}</p>
          <div class="rating text-warning">
            <i 
              v-for="star in 5" 
              :key="star"
              class="bi" 
              :class="star <= review.rating ? 'bi-star-fill' : 'bi-star'"
            ></i>
            <span class="ms-2 text-muted">{{ review.rating }}/5</span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  review: {
    type: Object,
    required: true
  }
});

defineEmits(['image-error']);
</script>

<style scoped>
.event-title {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.event-title:hover {
  color: #666;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: left;  /* Changed from center to left */
}

.description {
  margin-bottom: 1.5rem;
  text-align: center;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-category {
  font-size: 14px;
  color: #36b598;
  margin-bottom: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-meta {
  flex: 1;
}

.post-author {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 0.25rem;
  color: #333;
}

.rating {
  color: #ffd700;
  font-size: 0.9rem;
}

.rating i {
  margin-right: 2px;
}
</style>