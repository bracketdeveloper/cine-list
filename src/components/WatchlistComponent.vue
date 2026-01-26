<script>
import {checkUserAuth} from "@/functions";

export default {
  name: "WatchlistComponent",
  data() {
    return {
      isLogin: null
    }
  },
  mounted() {
    this.isLogin = checkUserAuth();
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-20 text-center">


    <!-- Logged-in state -->
    <div v-if="isLogin">
      <h1 class="text-3xl font-bold text-slate-900 mb-6">
        Work in Progress
      </h1>


      <p class="text-slate-600 mb-12">
        Some features of this project are not completed yet. Stay tuned for updates.
      </p>


      <div class="flex justify-center space-x-6">
        <div class="p-6 bg-white rounded-lg shadow-sm border w-40">
          <h3 class="font-semibold text-slate-900 mb-2">
            Movie Search
          </h3>
          <p class="text-sm text-slate-600">
            Add search functionality using TMDB API.
          </p>
        </div>


        <div class="p-6 bg-white rounded-lg shadow-sm border w-40">
          <h3 class="font-semibold text-slate-900 mb-2">
            User Profiles
          </h3>
          <p class="text-sm text-slate-600">
            Enable multiple users to save watchlists.
          </p>
        </div>


        <div class="p-6 bg-white rounded-lg shadow-sm border w-40">
          <h3 class="font-semibold text-slate-900 mb-2">
            Movie Ratings
          </h3>
          <p class="text-sm text-slate-600">
            Add rating system for each movie.
          </p>
        </div>
      </div>
    </div>


    <!-- Logged-out state -->
    <div v-else>
      <h1 class="text-3xl font-bold text-slate-900 mb-6">
        Login Required
      </h1>


      <p class="text-slate-600 mb-12">
        You need to log in to access your watchlist.
      </p>


      <div class="flex justify-center space-x-6">
        <router-link
            to="/login"
            class="px-6 py-3 bg-slate-900 text-white rounded-lg border"
        >
          Login
        </router-link>


        <router-link
            to="/register"
            class="px-6 py-3 bg-white text-slate-900 rounded-lg border"
        >
          Register
        </router-link>
      </div>
    </div>


  </div>

</template>

<style scoped>

</style>