<script>
import {
  getMoviesOrTvShow,
  getGenre,
  getMoviesWatchListByUserId,
  addMovieWatchListByUserId,
  removeMovieWatchListByUserId
} from "@/functions";

export default {
  name: "MoviesComponent",

  data() {
    return {
      moviesData: [],
      allMoviesData: [],
      genres: [],
      selectedGenre: "",
      movieType: "Popular Movies",

      userId: "",
      watchListMovies: [],

      isLoading: true
    };
  },

  async mounted() {
    if (localStorage.getItem("user-data")) {
      this.userId = JSON.parse(localStorage.getItem("user-data"))[0].id;
    }

    this.allMoviesData = await getMoviesOrTvShow(
        "https://api.themoviedb.org/3/movie/popular"
    );
    this.moviesData = [...this.allMoviesData];

    this.genres = await getGenre(
        "https://api.themoviedb.org/3/genre/movie/list"
    );

    if (this.userId) {
      const res = await getMoviesWatchListByUserId(this.userId);
      this.watchListMovies = res?.movie_id || [];
    }

    this.isLoading = false;
  },

  methods: {
    async filterPopularMovies() {
      this.selectedGenre = "";
      this.isLoading = true;

      this.allMoviesData = await getMoviesOrTvShow(
          "https://api.themoviedb.org/3/movie/popular"
      );
      this.moviesData = [...this.allMoviesData];
      this.movieType = "Popular Movies";

      this.isLoading = false;
    },

    async filterTopRatedMovies() {
      this.selectedGenre = "";
      this.isLoading = true;

      this.allMoviesData = await getMoviesOrTvShow(
          "https://api.themoviedb.org/3/movie/top_rated"
      );
      this.moviesData = [...this.allMoviesData];
      this.movieType = "Top Rated Movies";

      this.isLoading = false;
    },

    async filterUpcomingMovies() {
      this.selectedGenre = "";
      this.isLoading = true;

      this.allMoviesData = await getMoviesOrTvShow(
          "https://api.themoviedb.org/3/movie/upcoming"
      );
      this.moviesData = [...this.allMoviesData];
      this.movieType = "Upcoming Movies";

      this.isLoading = false;
    },

    async filterNowPlayingMovies() {
      this.selectedGenre = "";
      this.isLoading = true;

      this.allMoviesData = await getMoviesOrTvShow(
          "https://api.themoviedb.org/3/movie/now_playing"
      );
      this.moviesData = [...this.allMoviesData];
      this.movieType = "Now Playing Movies";

      this.isLoading = false;
    },

    filterByGenre() {
      if (!this.selectedGenre) {
        this.moviesData = [...this.allMoviesData];
        return;
      }

      const genreId = Number(this.selectedGenre);
      this.moviesData = this.allMoviesData.filter(movie =>
          movie.genre_ids.includes(genreId)
      );
    },

    isInWatchList(movieId) {
      return this.watchListMovies.includes(movieId);
    },

    async toggleWatchList(movieId) {
      if (!this.userId) {
        alert("Need to login first");
        return;
      }

      if (this.isInWatchList(movieId)) {
        this.watchListMovies = this.watchListMovies.filter(id => id !== movieId);
        await removeMovieWatchListByUserId(this.userId, movieId);
      } else {
        this.watchListMovies.push(movieId);
        await addMovieWatchListByUserId(this.userId, movieId);
      }
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 pt-8 pb-8 flex flex-col items-center">

    <h1 class="text-4xl font-bold mb-6">
      {{ movieType }}
    </h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6 justify-center">
      <button @click="filterPopularMovies" class="px-4 py-2 text-sm text-white bg-blue-600 rounded cursor-pointer">
        Popular
      </button>
      <button @click="filterTopRatedMovies" class="px-4 py-2 text-sm text-white bg-green-600 rounded cursor-pointer">Top
        Rated
      </button>
      <button @click="filterUpcomingMovies" class="px-4 py-2 text-sm text-white bg-purple-600 rounded cursor-pointer">
        Upcoming
      </button>
      <button @click="filterNowPlayingMovies" class="px-4 py-2 text-sm text-white bg-orange-600 rounded cursor-pointer">
        Now Playing
      </button>

      <select v-model="selectedGenre" @change="filterByGenre">
        <option value="">All Genres</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">
          {{ genre.name }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <p v-if="isLoading">
      Loading movies...
    </p>

    <!-- Empty -->
    <p v-else-if="moviesData.length === 0">
      No movies found
    </p>

    <!-- Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="movie in moviesData"
          :key="movie.id"
          class="bg-white rounded shadow w-72"
      >
        <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            class="w-full h-72 object-cover"
        />

        <div class="p-4">
          <h2 class="font-bold">
            {{ movie.title }}
          </h2>
          <p class="text-xs text-slate-500 mt-1"> Release:
            {{ movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-GB') : 'N/A' }} </p>
          <p class="text-sm text-slate-600 mt-2 line-clamp-3">{{ movie.overview }}</p>
          <div class="flex items-center justify-between mt-4"><span
              class="text-sm text-slate-700">⭐ {{ movie.vote_average.toFixed(1) }} ({{
              movie.vote_count.toLocaleString()
            }})</span> <!-- Watchlist Button -->
            <button :title="isInWatchList(movie.id) ? 'Already in watchlist' : 'Add to watchlist'"
                    class="flex items-center gap-2 px-2 py-1 font-medium rounded transition-colors"
                    :class="isInWatchList(movie.id) ? 'text-blue-600 cursor-pointer' : 'text-blue-600 hover:text-blue-800 cursor-pointer'"
                    @click="toggleWatchList(movie.id)">
              <svg v-if="!isInWatchList(movie.id)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
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
