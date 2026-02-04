<script>
import {
  addMovieWatchListByUserId,
  addTvShowWatchListByUserId,
  checkUserAuth,
  getAllWatchListsByUserId,
  getMoviesById,
  getMoviesWatchListByUserId,
  getTvShowById,
  removeMovieWatchListByUserId,
  removeTvShowWatchListByUserId
} from "@/functions";

export default {
  name: "WatchlistComponent",

  data() {
    return {
      activeTab: "movie",

      isLogin: false,
      isLoadingMovies: true,
      isLoadingTvShows: true,

      userId: "",

      watchListMovies: [],
      watchListTvShows: [],

      moviesData: [],
      tvShowsData: []
    };
  },

  async mounted() {
    try {
      this.isLogin = await checkUserAuth();

      if (!this.isLogin || !localStorage.getItem("user-data")) {
        return;
      }

      this.userId = JSON.parse(localStorage.getItem("user-data"))[0].id;

      const movieWatchList = await getMoviesWatchListByUserId(this.userId);
      this.watchListMovies = movieWatchList.movie_id || [];

      const allWatchList = await getAllWatchListsByUserId(this.userId);
      this.watchListTvShows = allWatchList.tv_show_id || [];

      await Promise.all(
          this.watchListMovies.map(async id => {
            const movie = await getMoviesById(id);
            this.moviesData.push(movie);
          })
      );

      await Promise.all(
          this.watchListTvShows.map(async id => {
            const tvShow = await getTvShowById(id);
            this.tvShowsData.push(tvShow);
          })
      );
    } catch (err) {
      console.error(err);
    } finally {
      this.isLoadingMovies = false;
      this.isLoadingTvShows = false;
    }
  },

  methods: {
    async toggleMovieWatchList(movieId) {
      if (!this.userId) return;

      const exists = this.watchListMovies.includes(movieId);

      if (exists) {
        this.watchListMovies = this.watchListMovies.filter(id => id !== movieId);
        this.moviesData = this.moviesData.filter(m => m.id !== movieId);
        await removeMovieWatchListByUserId(this.userId, movieId);
      } else {
        this.watchListMovies.push(movieId);
        const movie = await getMoviesById(movieId);
        this.moviesData.push(movie);
        await addMovieWatchListByUserId(this.userId, movieId);
      }
    },

    async toggleTvShowWatchList(tvShowId) {
      if (!this.userId) return;

      const exists = this.watchListTvShows.includes(tvShowId);

      if (exists) {
        this.watchListTvShows = this.watchListTvShows.filter(id => id !== tvShowId);
        this.tvShowsData = this.tvShowsData.filter(s => s.id !== tvShowId);
        await removeTvShowWatchListByUserId(this.userId, tvShowId);
      } else {
        this.watchListTvShows.push(tvShowId);
        const tvShow = await getTvShowById(tvShowId);
        this.tvShowsData.push(tvShow);
        await addTvShowWatchListByUserId(this.userId, tvShowId);
      }
    }
  }
};
</script>
<template>
  <div class="min-h-screen bg-slate-100 py-10">

    <div v-if="isLogin" class="max-w-6xl mx-auto">

      <div class="flex justify-center gap-4 mb-8">
        <button @click="activeTab = 'movie'" class="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
          Movies Watch List
        </button>
        <button @click="activeTab = 'tv'" class="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">
          TV Shows Watch List
        </button>
      </div>

      <!-- MOVIES -->
      <div v-if="activeTab === 'movie'">
        <p v-if="isLoadingMovies" class="text-center">
          Loading movies
        </p>

        <p v-else-if="moviesData.length === 0" class="text-center">
          Your movie watch list is empty
        </p>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="movie in moviesData" :key="movie.id" class="bg-white rounded shadow">
            <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" class="h-72 w-full object-cover" />
            <div class="p-4">
              <h2 class="text-lg font-bold">{{ movie.title }}</h2>
              <button class="mt-4 text-blue-600" @click="toggleMovieWatchList(movie.id)">
                Remove from watchlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TV SHOWS -->
      <div v-if="activeTab === 'tv'">
        <p v-if="isLoadingTvShows" class="text-center">
          Loading TV shows
        </p>

        <p v-else-if="tvShowsData.length === 0" class="text-center">
          Your TV shows watch list is empty
        </p>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="tvShow in tvShowsData" :key="tvShow.id" class="bg-white rounded shadow">
            <img :src="`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`" class="h-72 w-full object-cover" />
            <div class="p-4">
              <h2 class="text-lg font-bold">{{ tvShow.name }}</h2>
              <button class="mt-4 text-blue-600" @click="toggleTvShowWatchList(tvShow.id)">
                Remove from watchlist
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="text-center mt-20">
      <h1 class="text-3xl mb-4">Login Required</h1>
      <router-link to="/login" class="text-blue-600">Login</router-link>
    </div>

  </div>
</template>
 cursor-pointer