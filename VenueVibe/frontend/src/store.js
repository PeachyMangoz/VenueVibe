import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: {
      loggedIn: false,
      data: null
    }
  },
  getters: {
    user(state) {
      return state.user;
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        // Check if the user data includes `username` 
        const displayName = user.username || user.displayName || "User"; // Fallback to displayName or "User"
        commit("SET_USER", {
          displayName: displayName,
          email: user.email
        });
      } else {
        commit("SET_USER", null);
      }
    }
  }
});

export default store;
