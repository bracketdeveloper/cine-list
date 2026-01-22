<script>
export default {
  name: "AboutComponent",
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-16">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold text-slate-900">About Cine List</h1>
      <p class="mt-4 text-slate-600 text-sm max-w-2xl mx-auto">
        A personal project built to track movies, manage watchlists, and practice real-world frontend skills.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-8 mb-16">
      <div class="p-6 bg-white rounded-lg shadow-sm border">
        <h3 class="text-lg font-semibold text-slate-900 mb-2">What It Does</h3>
        <ul class="text-sm text-slate-600 space-y-2">
          <li>Add movies to your watchlist</li>
          <li>Update or remove saved movies</li>
          <li>Browse popular titles</li>
        </ul>
      </div>

      <div class="p-6 bg-white rounded-lg shadow-sm border">
        <h3 class="text-lg font-semibold text-slate-900 mb-2">API Used</h3>
        <ul class="text-sm text-slate-600 space-y-2">
          <li>TMDB public API</li>
          <li>GET movies data</li>
          <li>POST, PUT, DELETE watchlist items</li>
        </ul>
      </div>

      <div class="p-6 bg-white rounded-lg shadow-sm border">
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Tech Stack</h3>
        <ul class="text-sm text-slate-600 space-y-2">
          <li>Vue.js</li>
          <li>Vue Router</li>
          <li>Axios</li>
          <li>Tailwind CSS</li>
        </ul>
      </div>
    </div>

    <div class="bg-slate-900 text-white rounded-lg p-8 text-center">
      <h2 class="text-xl font-semibold mb-3">Why This Project</h2>
      <p class="text-sm max-w-3xl mx-auto text-slate-200">
        Built after completing a restaurant management app to apply CRUD operations, routing, and API handling in a new domain.
      </p>
    </div>
  </div>

</template>

<style scoped>

</style>