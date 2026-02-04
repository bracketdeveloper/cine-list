<script>
import {
  getMoviesOrTvShow,
  getGenre,
  getMoviesWatchListByUserId,
  getTvShowsWatchListByUserId
} from "@/functions";

export default {
  name: "HomeComponent",
  data() {
    return {
      featuredItem: null,
      popularMovies: [],
      topRatedMovies: [],
      upcomingMovies: [],
      nowPlayingMovies: [],
      popularTvShows: [],
      topRatedTvShows: [],
      airingTodayTvShows: [],
      onAirTvShows: [],
      genresMovie: [],
      genresTv: [],
      userId: "",
      watchListMovies: [],
      watchListTvShows: [],
      loading: true
    };
  },
  async mounted() {
    // Get userId if logged in
    if (localStorage.getItem("user-data")) {
      this.userId = JSON.parse(localStorage.getItem("user-data"))[0].id;
      const movieWL = await getMoviesWatchListByUserId(this.userId);
      const tvWL = await getTvShowsWatchListByUserId(this.userId);
      this.watchListMovies = movieWL.movie_id || [];
      this.watchListTvShows = tvWL.tv_show_id || [];
    }

    // Fetch movies
    this.popularMovies = await getMoviesOrTvShow('https://api.themoviedb.org/3/movie/popular');
    this.topRatedMovies = await getMoviesOrTvShow('https://api.themoviedb.org/3/movie/top_rated');
    this.upcomingMovies = await getMoviesOrTvShow('https://api.themoviedb.org/3/movie/upcoming');
    this.nowPlayingMovies = await getMoviesOrTvShow('https://api.themoviedb.org/3/movie/now_playing');

    // Fetch TV shows
    this.popularTvShows = await getMoviesOrTvShow('https://api.themoviedb.org/3/tv/popular');
    this.topRatedTvShows = await getMoviesOrTvShow('https://api.themoviedb.org/3/tv/top_rated');
    this.airingTodayTvShows = await getMoviesOrTvShow('https://api.themoviedb.org/3/tv/airing_today');
    this.onAirTvShows = await getMoviesOrTvShow('https://api.themoviedb.org/3/tv/on_the_air');

    // Fetch genres
    this.genresMovie = await getGenre('https://api.themoviedb.org/3/genre/movie/list');
    this.genresTv = await getGenre('https://api.themoviedb.org/3/genre/tv/list');

    // Set featured item (first trending movie or TV show)
    this.featuredItem = this.popularMovies[0] || this.popularTvShows[0];

    this.loading = false;
  },
  methods: {
    isInWatchList(itemId, type) {
      if (type === "movie") return this.watchListMovies.includes(itemId);
      if (type === "tv") return this.watchListTvShows.includes(itemId);
      return false;
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 py-8">
    <!-- Loading -->
    <div v-if="loading" class="text-center mt-40 text-xl text-slate-600">
      Loading content...
    </div>

    <div v-else>
      <!-- Hero / Featured Section -->
      <div v-if="featuredItem" class="relative max-w-6xl mx-auto mb-12">
        <img :src="`https://image.tmdb.org/t/p/original${featuredItem.backdrop_path || featuredItem.poster_path}`"
             class="w-full h-96 object-cover rounded-lg shadow-lg"/>
        <div class="absolute bottom-8 left-8 text-white bg-black/50 p-4 rounded">
          <h1 class="text-3xl font-bold">{{ featuredItem.title || featuredItem.name }}</h1>
          <p class="mt-2 line-clamp-3">{{ featuredItem.overview }}</p>
        </div>
      </div>

      <!-- Categories -->
      <div class="max-w-6xl mx-auto mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-slate-800">Movies</h2>
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div v-for="movie in popularMovies.slice(0, 6)" :key="movie.id" class="w-48 flex-shrink-0">
            <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                 class="w-full h-64 object-cover rounded"/>
            <h3 class="mt-2 font-medium text-slate-900 text-sm">{{ movie.title }}</h3>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-slate-800">TV Shows</h2>
        <div class="flex gap-4 overflow-x-auto pb-4">
          <div v-for="tv in popularTvShows.slice(0, 6)" :key="tv.id" class="w-48 flex-shrink-0">
            <img :src="`https://image.tmdb.org/t/p/w500${tv.poster_path}`"
                 class="w-full h-64 object-cover rounded"/>
            <h3 class="mt-2 font-medium text-slate-900 text-sm">{{ tv.name }}</h3>
          </div>
        </div>
      </div>

      <!-- Watchlist Preview -->
      <div v-if="watchListMovies.length || watchListTvShows.length" class="max-w-6xl mx-auto mb-12">
        <h2 class="text-2xl font-semibold mb-4 text-slate-800">Your Watchlist</h2>
        <div class="flex gap-4 overflow-x-auto pb-4">
          <!-- Movies -->
          <div v-for="movie in popularMovies.filter(m => watchListMovies.includes(m.id))" :key="movie.id" class="w-48 flex-shrink-0">
            <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                 class="w-full h-64 object-cover rounded"/>
            <h3 class="mt-2 font-medium text-slate-900 text-sm">{{ movie.title }}</h3>
          </div>
          <!-- TV Shows -->
          <div v-for="tv in popularTvShows.filter(t => watchListTvShows.includes(t.id))" :key="tv.id" class="w-48 flex-shrink-0">
            <img :src="`https://image.tmdb.org/t/p/w500${tv.poster_path}`"
                 class="w-full h-64 object-cover rounded"/>
            <h3 class="mt-2 font-medium text-slate-900 text-sm">{{ tv.name }}</h3>
          </div>
        </div>
      </div>

      <!-- Genre Section -->
      <div class="max-w-6xl mx-auto mb-12">
        <h2 class="text-2xl font-semibold mb-4 text-slate-800">Genres</h2>
        <div class="flex gap-2 flex-wrap">
          <span v-for="genre in genresMovie" :key="genre.id"
                class="px-3 py-1 bg-blue-600 text-white rounded text-sm">{{ genre.name }}</span>
          <span v-for="genre in genresTv" :key="genre.id"
                class="px-3 py-1 bg-green-600 text-white rounded text-sm">{{ genre.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide horizontal scrollbar in WebKit */
.flex::-webkit-scrollbar {
  display: none;
}
.flex {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
