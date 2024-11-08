  <template>
  <div class="container section-title" data-aos="fade-up">
    <h2>
      <div class="title-with-lines">
        <span class="line"></span>
        Event Applications
        <span class="line"></span>
      </div>
    </h2>
  </div>

  <div class="container py-4">
    <div
      v-if="loading"
      class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
      style="z-index: 1000"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <button
            @click="createNewApplication"
            class="btn btn-success"
            :disabled="loading"
          >
            + View Available Booths
          </button>
        </div>

        <div
          v-if="applications.length === 0 && !loading"
          class="text-center py-5 text-muted"
        >
          <p class="mb-0">
            No applications found. Start by applying for an event!
          </p>
        </div>

        <div v-else class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="application in sortedApplications"
                :key="application.id"
              >
                <td>{{ application.eventName }}</td>
                <td>{{ formatDate(application.date) }}</td>
                <td>
                  <span :class="getBadgeClass(application.status)">
                    {{ application.status }}
                  </span>
                </td>
                <td>{{ formatDate(application.updatedAt) }}</td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      @click="viewApplication(application)"
                      class="btn btn-primary"
                      :disabled="loading"
                    >
                      View
                    </button>
                    <button
                      @click="editApplication(application)"
                      class="btn btn-warning"
                      :disabled="loading || !isEditable(application)"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Application Details Modal -->
    <div
      v-if="selectedApplication"
      class="modal fade show d-block"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedApplication.eventName }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <strong class="text-muted">Status:</strong>
              <span
                :class="getBadgeClass(selectedApplication.status)"
                class="ms-2"
              >
                {{ selectedApplication.status }}
              </span>
            </div>
            <div class="mb-3">
              <strong class="text-muted">Date:</strong>
              <span class="ms-2">{{
                formatDate(selectedApplication.date)
              }}</span>
            </div>
            <div class="mb-3">
              <strong class="text-muted">Submitted:</strong>
              <span class="ms-2">{{
                formatDate(selectedApplication.createdAt)
              }}</span>
            </div>
            <div class="mb-3">
              <strong class="text-muted">Last Updated:</strong>
              <span class="ms-2">{{
                formatDate(selectedApplication.updatedAt)
              }}</span>
            </div>
            <div>
              <strong class="text-muted">Notes:</strong>
              <p class="mb-0 mt-1">
                {{ selectedApplication.notes || "No notes available" }}
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              v-if="isEditable(selectedApplication)"
              @click="editApplication(selectedApplication)"
              class="btn btn-warning"
            >
              Edit Application
            </button>
            <button @click="closeModal" class="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="notification"
      class="position-fixed bottom-0 end-0 p-3"
      style="z-index: 1100"
    >
      <div
        :class="[
          'toast show',
          {
            'bg-success': notification.type === 'success',
            'bg-danger': notification.type === 'error',
          },
        ]"
        role="alert"
      >
        <div class="toast-body text-white">
          {{ notification.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useRouter } from "vue-router";

export default {
  name: "EventApplications",
  setup() {
    const router = useRouter();
    const applications = ref([]);
    const loading = ref(false);
    const userId = ref(null);
    const selectedApplication = ref(null);
    const notification = ref(null);

    const sortedApplications = computed(() => {
      return [...applications.value].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    });

    const getBadgeClass = (status) => {
      const baseClass = "badge ";
      switch (status.toLowerCase()) {
        case "draft":
          return baseClass + "bg-info";
        case "pending":
          return baseClass + "bg-warning text-dark";
        case "approved":
          return baseClass + "bg-success";
        case "rejected":
          return baseClass + "bg-danger";
        default:
          return baseClass + "bg-secondary";
      }
    };

    const showNotification = (message, type = "success") => {
      notification.value = { message, type };
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    };

    const fetchApplications = async () => {
      loading.value = true;
      try {
        const q = query(
          collection(db, "eventApplications"),
          where("userId", "==", userId.value),
          orderBy("updatedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        applications.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching applications:", error);
        showNotification("Failed to load applications", "error");
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (date) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const isEditable = (application) => {
      return ["DRAFT", "PENDING"].includes(application.status);
    };

    const viewApplication = (application) => {
      selectedApplication.value = application;
    };

    const editApplication = (application) => {
      if (!isEditable(application)) {
        showNotification("This application cannot be edited", "error");
        return;
      }
      router.push(`/applications/${application.id}/edit`);
    };

    const createNewApplication = () => {
      router.push("/booths"); 
    };

    const closeModal = () => {
      selectedApplication.value = null;
    };

    onMounted(async () => {
      await fetchApplications();
    });

    return {
      applications,
      sortedApplications,
      loading,
      selectedApplication,
      notification,
      formatDate,
      viewApplication,
      editApplication,
      createNewApplication,
      closeModal,
      isEditable,
      getBadgeClass,
    };
  },
};
</script>

<style scoped>
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