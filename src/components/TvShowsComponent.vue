<script>
import {
  getMoviesOrTvShow,
  getGenre,
  getTvShowsWatchListByUserId,
  addTvShowWatchListByUserId,
  removeTvShowWatchListByUserId
} from "@/functions";

export default {
  name: "TvShowsComponent",

  data() {
    return {
      tvShowsData: [],
      allTvShowsData: [],
      genres: [],
      selectedGenre: "",
      tvShowType: "Popular TV Shows",

      userId: "",
      watchListTvShows: [],

      isLoading: true
    };
  },

  async mounted() {
    if (localStorage.getItem("user-data")) {
      this.userId = JSON.parse(localStorage.getItem("user-data"))[0].id;
    }

    this.allTvShowsData = await getMoviesOrTvShow(
        "https://api.themoviedb.org/3/tv/popular"
    );
    this.tvShowsData = [...this.allTvShowsData];

    this.genres = await getGenre("https://api.themoviedb.org/3/genre/tv/list");

    if (this.userId) {
      const res = await getTvShowsWatchListByUserId(this.userId);
      this.watchListTvShows = res?.tv_show_id || [];
    }

    this.isLoading = false;
  },

  methods: {
    async filterPopularTvShows() {
      this.selectedGenre = "";
      this.isLoading = true;

      this.allTvShowsData = await getMoviesOrTvShow(
          "https://api.themoviedb.org/3/tv/popular"
      );
      this.tvShowsData = [...this.allTvShowsData];
      this.tvShowType = "Popular TV Shows";

      this.isLoading = false;
    },

    async filterTopRatedTvShows() {
      this.selectedGenre = "";
      this.isLoading = true;

      this.allTvShowsData = await getMoviesOrTvShow(
          "https://api.themoviedb.org/3/tv/top_rated"
      );
      this.tvShowsData = [...this.allTvShowsData];
      this.tvShowType = "Top Rated TV Shows";

      this.isLoading = false;
    },

    async filterAiringTodayTvShows() {
      this.selectedGenre = "";
      this.isLoading = true;

      this.allTvShowsData = await getMoviesOrTvShow(
          "https://api.themoviedb.org/3/tv/airing_today"
      );
      this.tvShowsData = [...this.allTvShowsData];
      this.tvShowType = "Airing Today TV Shows";

      this.isLoading = false;
    },

    async filterOnTheAirTvShows() {
      this.selectedGenre = "";
      this.isLoading = true;

      this.allTvShowsData = await getMoviesOrTvShow(
          "https://api.themoviedb.org/3/tv/on_the_air"
      );
      this.tvShowsData = [...this.allTvShowsData];
      this.tvShowType = "On The Air TV Shows";

      this.isLoading = false;
    },

    filterByGenre() {
      if (!this.selectedGenre) {
        this.tvShowsData = [...this.allTvShowsData];
        return;
      }
      const genreId = Number(this.selectedGenre);
      this.tvShowsData = this.allTvShowsData.filter(tvShow =>
          tvShow.genre_ids.includes(genreId)
      );
    },

    isInWatchList(tvShowId) {
      return this.watchListTvShows.includes(tvShowId);
    },

    async toggleWatchList(tvShowId) {
      if (!this.userId) {
        alert("Need to login first");
        return;
      }

      if (this.isInWatchList(tvShowId)) {
        this.watchListTvShows = this.watchListTvShows.filter(id => id !== tvShowId);
        await removeTvShowWatchListByUserId(this.userId, tvShowId);
      } else {
        this.watchListTvShows.push(tvShowId);
        await addTvShowWatchListByUserId(this.userId, tvShowId);
      }
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 pt-8 pb-8 flex flex-col items-center">

    <h1 class="text-4xl font-bold mb-6">
      {{ tvShowType }}
    </h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6 justify-center">
      <button @click="filterPopularTvShows" class="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">Popular
      </button>
      <button @click="filterTopRatedTvShows" class="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">Top
        Rated
      </button>
      <button @click="filterAiringTodayTvShows" class="px-4 py-2 bg-purple-600 text-white rounded cursor-pointer">Airing
        Today
      </button>
      <button @click="filterOnTheAirTvShows" class="px-4 py-2 bg-orange-600 text-white rounded cursor-pointer">On The
        Air
      </button>

      <select v-model="selectedGenre" @change="filterByGenre" class="px-4 py-2 border rounded">
        <option value="">All Genres</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
      </select>
    </div>

    <!-- Loading -->
    <p v-if="isLoading">Loading TV Shows...</p>

    <!-- Empty -->
    <p v-else-if="tvShowsData.length === 0">No TV Shows found</p>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="tvShow in tvShowsData" :key="tvShow.id" class="bg-white rounded shadow w-72">
        <img :src="`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`" class="w-full h-72 object-cover"/>
        <div class="p-4">
          <h2 class="font-bold">{{ tvShow.name }}</h2>
          <p class="text-xs text-slate-500 mt-1"> Fist Air Date:
            {{ tvShow.first_air_date ? new Date(tvShow.first_air_date).toLocaleDateString('en-GB') : 'N/A' }} </p>
          <p class="text-sm text-slate-600 mt-2 line-clamp-3">{{ tvShow.overview }}</p>
          <div class="flex items-center justify-between mt-4"><span class="text-sm text-slate-700">⭐ {{
              tvShow.vote_average.toFixed(1)
            }} ({{ tvShow.vote_count.toLocaleString() }})</span>
            <button :title="isInWatchList(tvShow.id) ? 'Already in watchlist' : 'Add to watchlist'"
                    class="flex items-center gap-2 px-2 py-1 font-medium rounded transition-colors"
                    :class="isInWatchList(tvShow.id) ? 'text-blue-600 cursor-pointer' : 'text-blue-600 hover:text-blue-800 cursor-pointer'"
                    @click="toggleWatchList(tvShow.id)">
              <svg v-if="!isInWatchList(tvShow.id)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 5v14l7-7 7 7V5H5z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 3a2 2 0 0 0-2 2v16l9-6 9 6V5a2 2 0 0 0-2-2H5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
