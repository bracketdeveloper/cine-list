<script>
import {
  getMoviesOrTvShow,
  getGenre
} from "@/functions";

export default {
  name: "TvShowsComponent",
  data() {
    return {
      tvShowsData: [], // currently displayed tvShows
      allTvShowsData: [], // full list of tvShows from API
      genres: [],
      selectedGenre: '',
      tvShowType: 'Popular TV Shows',
    }
  },
  async mounted() {
    this.allTvShowsData = await getMoviesOrTvShow('https://api.themoviedb.org/3/tv/popular');
    this.tvShowsData = [...this.allTvShowsData];
    this.genres = await getGenre('https://api.themoviedb.org/3/genre/tv/list');
  },
  methods: {
    async filterPopularTvShows() {
      this.selectedGenre = '';
      this.allTvShowsData = await getMoviesOrTvShow('https://api.themoviedb.org/3/tv/popular');
      this.tvShowsData = [...this.allTvShowsData];
      this.tvShowType = "Popular TV Shows";
    },


    async filterTopRatedTvShows() {
      this.selectedGenre = '';
      this.allTvShowsData = await getMoviesOrTvShow('https://api.themoviedb.org/3/tv/top_rated');
      this.tvShowsData = [...this.allTvShowsData];
      this.tvShowType = "Top Rated TV Shows";
    },


    async filterAiringTodayTvShows() {
      this.selectedGenre = '';
      this.allTvShowsData = await getMoviesOrTvShow('https://api.themoviedb.org/3/tv/airing_today');
      this.tvShowsData = [...this.allTvShowsData];
      this.tvShowType = "Upcoming TV Shows";
    },


    async filterOnTheAirTvShows() {
      this.selectedGenre = '';
      this.allTvShowsData = await getMoviesOrTvShow('https://api.themoviedb.org/3/tv/on_the_air');
      this.tvShowsData = [...this.allTvShowsData];
      this.tvShowType = "Now Playing TV Shows";
    },


    filterByGenre() {
      if (!this.selectedGenre) {
// no genre selected, show all tvShows
        this.tvShowsData = [...this.allTvShowsData];
      } else {
        const genreId = Number(this.selectedGenre);
        this.tvShowsData = this.allTvShowsData.filter(tvShow =>
            tvShow.genre_ids.includes(genreId)
        );
      }
    }
  }
}
</script>

<template>
  <div v-if="tvShowsData"
       class="mt-8 mb-8 pt-4 pb-4 min-h-screen flex flex-col items-center justify-center bg-slate-100">

    <h1 class="text-4xl font-extra-bold text-slate-900 mb-6 tracking-wide border-b-4 border-blue-600 pb-2">
      {{ tvShowType }}
    </h1>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6 justify-center">
      <button @click="filterPopularTvShows" class="px-4 py-2 text-sm text-white bg-blue-600 rounded cursor-pointer">
        Popular
      </button>
      <button @click="filterTopRatedTvShows" class="px-4 py-2 text-sm text-white bg-green-600 rounded cursor-pointer">Top
        Rated
      </button>
      <button @click="filterAiringTodayTvShows" class="px-4 py-2 text-sm text-white bg-purple-600 rounded cursor-pointer">
        Airing Today
      </button>
      <button @click="filterOnTheAirTvShows" class="px-4 py-2 text-sm text-white bg-orange-600 rounded cursor-pointer">
        Now Playing
      </button>

      <!-- Genre Dropdown -->
      <div class="relative">
        <select v-model="selectedGenre" @change="filterByGenre"
                class="px-4 py-2 text-sm text-slate-700 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600">
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Check if tvShowsData is empty -->
    <div v-if="tvShowsData.length === 0" class="text-center mt-16">
      <h2 class="text-2xl font-semibold text-slate-800 mb-2">No tvShows found for this genre</h2>
      <p class="text-slate-600">Try selecting another genre or category to see more Tv Shows.</p>
    </div>

    <!-- TV Shows Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="tvShow in tvShowsData" :key="tvShow.id"
           class="w-72 bg-white border rounded-lg shadow-sm overflow-hidden">
        <img :src="`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`"
             :alt="tvShow.name"
             class="w-full h-72 object-cover"/>
        <div class="p-4">
          <h2 class="text-lg font-bold text-slate-900">{{ tvShow.name }}</h2>
          <p class="text-xs text-slate-500 mt-1">
            Fist Air Date: {{ tvShow.first_air_date ? new Date(tvShow.first_air_date).toLocaleDateString('en-GB') : 'N/A' }}
          </p>
          <p class="text-sm text-slate-600 mt-2 line-clamp-3">{{ tvShow.overview }}</p>
          <div class="flex items-center justify-between mt-4">
            <span class="text-sm text-slate-700">⭐ {{
                tvShow.vote_average.toFixed(1)
              }} ({{ tvShow.vote_count.toLocaleString() }})</span>
            <button
                class="flex items-center gap-2 px-2 py-1 text-blue-600 font-medium cursor-pointer rounded hover:text-blue-800 transition-colors"
                title="Add to watchlist">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 5v14l7-7 7 7V5H5z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="mt-8 mb-8 pt-4 pb-4 min-h-screen flex flex-col items-center justify-center bg-slate-100">
    <div class="flex gap-4 mb-8">
      <button @click="filterPopularTvShows" class="px-4 py-2 text-sm text-white bg-blue-600 rounded cursor-pointer">
        Popular
      </button>

      <button @click="filterTopRatedTvShows" class="px-4 py-2 text-sm text-white bg-green-600 rounded cursor-pointer">
        Top Rated
      </button>

      <button @click="filterAiringTodayTvShows" class="px-4 py-2 text-sm text-white bg-purple-600 rounded cursor-pointer">
        Airing Today
      </button>

      <button @click="filterOnTheAirTvShows" class="px-4 py-2 text-sm text-white bg-orange-600 rounded cursor-pointer">
        On The Air
      </button>
    </div>
    <h1 className="text-3xl font-bold text-slate-900 mb-6">
      No Tv Show Found
    </h1>


    <p className="text-slate-600 mb-12">
      The API did not return any Tv Shows. Try again later or adjust your request.
    </p>


    <div className="flex justify-center space-x-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border w-40">
        <h3 className="font-semibold text-slate-900 mb-2">
          Check API Key
        </h3>
        <p className="text-sm text-slate-600">
          Make sure your TMDB key is valid.
        </p>
      </div>


      <div className="p-6 bg-white rounded-lg shadow-sm border w-40">
        <h3 className="font-semibold text-slate-900 mb-2">
          Network Status
        </h3>
        <p className="text-sm text-slate-600">
          Verify your internet connection.
        </p>
      </div>


      <div className="p-6 bg-white rounded-lg shadow-sm border w-40">
        <h3 className="font-semibold text-slate-900 mb-2">
          API Limits
        </h3>
        <p className="text-sm text-slate-600">
          You may have hit the request limit.
        </p>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>