// useReviews.js
import { ref, computed } from 'vue';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export function useReviews() {
  const loading = ref(false);
  const error = ref(null);
  const reviews = ref([]);
  const searchEventId = ref("");

  const reviewsCollection = collection(db, 'reviewData');

  const filteredReviews = computed(() => {
    return searchEventId.value
      ? reviews.value.filter(review => review.eventId === searchEventId.value)
      : reviews.value;
  });

  const fetchReviews = async () => {
    loading.value = true;
    error.value = null;
    try {
      const querySnapshot = await getDocs(reviewsCollection);
      reviews.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        rating: parseInt(doc.data().rating)
      }));
    } catch (err) {
      console.error('Error fetching reviews:', err);
      error.value = 'Failed to load reviews';
    } finally {
      loading.value = false;
    }
  };

  const searchReviews = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (!searchEventId.value) {
        await fetchReviews();
        return;
      }

      const q = query(
        reviewsCollection, 
        where("eventId", "==", searchEventId.value)
      );
      
      const querySnapshot = await getDocs(q);
      reviews.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        rating: parseInt(doc.data().rating)
      }));
    } catch (err) {
      console.error('Error searching reviews:', err);
      error.value = 'Failed to search reviews';
    } finally {
      loading.value = false;
    }
  };

  const submitReview = async (reviewData) => {
    loading.value = true;
    error.value = null;
    try {
      await addDoc(reviewsCollection, {
        ...reviewData,
        createdAt: serverTimestamp()
      });
      await fetchReviews();
      return true;
    } catch (err) {
      console.error('Error submitting review:', err);
      error.value = err.message || 'Failed to submit review';
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Set up real-time updates
  const setupRealtimeUpdates = () => {
    return onSnapshot(reviewsCollection, (snapshot) => {
      reviews.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        rating: parseInt(doc.data().rating)
      }));
    });
  };

  return {
    reviews,
    filteredReviews,
    loading,
    error,
    searchEventId,
    fetchReviews,
    searchReviews,
    submitReview,
    setupRealtimeUpdates
  };
}