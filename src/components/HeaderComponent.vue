<script>


export default {
  name: "HeaderComponent",
  data(){
    return {
      isLogin: false,
      isMenuOpen: false
    }
  },
  mounted() {

    this.isLogin = !!localStorage.getItem("user-data")
    let isStop = true
    if(isStop) {
      setInterval(() => {
        this.isLogin = !!localStorage.getItem("user-data")
      }, 500) // checks every 0.5s
    }
  },
  methods: {
    logout(){
      let con = confirm("Do you want to sign out?")
      if (con) {
        localStorage.removeItem("user-data")
        this.isLogin = false
        this.$router.push("/login")
      }
    }
  },
  watch: {
    $route() {
      this.isMenuOpen = false
    }
  }
}

</script>

<template>
  <header v-show="!userData" class='flex border-b border-gray-300 py-3 px-4 sm:px-10 bg-white min-h-[65px] tracking-wide relative z-50'>
    <div class='flex flex-wrap items-center gap-4 max-w-screen-xl mx-auto w-full'>
      <router-link to="/"><a class="max-sm:hidden"><img src="../assets/logo.png" alt="logo"
                                                        class='w-[134px]  logo-image'/>
      </a></router-link>
      <router-link to="/"><a class="hidden max-sm:block"><img src="../assets/logo.png"
                                                                    alt="logo" class=' logo-image w-20'/></a>
      </router-link>

      <div :class="[ 'lg:block max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:h-full max-lg:bg-white max-lg:shadow-md z-50', isMenuOpen ? 'block' : 'hidden' ]" >
        <button
            class="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border"
            @click="isMenuOpen = false"
        >
          ✕
        </button>

        <ul
            class='lg:flex lg:ml-14 lg:gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50'>
          <li class='max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3'>
            <router-link to="/"><a class='font-medium lg:hover:text-blue-700 text-blue-700 block text-[15px]'>Home</a>
            </router-link>
          </li>
          <li class='max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3'>
            <router-link to="/movies"><a class='font-medium lg:hover:text-blue-700 text-slate-900 block text-[15px]'>Movies</a>
            </router-link>
          </li>

          <li class='max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3'>
            <router-link to="/tv-shows"><a class='font-medium lg:hover:text-blue-700 text-slate-900 block text-[15px]'>TV Shows</a>
            </router-link>
          </li>
          <li class='max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3'>
            <router-link to="/watchlist"><a class='font-medium lg:hover:text-blue-700 text-slate-900 block text-[15px]'>Watch
              List</a></router-link>
          </li>
          <li class='max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3'>
            <router-link to="/about"><a class='font-medium lg:hover:text-blue-700 text-slate-900 block text-[15px]'>About</a>
            </router-link>
          </li>
          <li class='max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3'>
            <router-link to="/contact"><a class='font-medium lg:hover:text-blue-700 text-slate-900 block text-[15px]'>Contact</a>
            </router-link>
          </li>
        </ul>
      </div>

      <div class='flex gap-4 ml-auto'>
        <div
            class='flex max-w-xs w-full bg-gray-100 px-4 py-2.5 outline outline-transparent border border-gray-200 focus-within:border-slate-900 focus-within:bg-transparent transition-all'>
          <input type='text' placeholder='Search something...'
                 class='w-full text-sm bg-transparent outline-none pr-2'/>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
               class="cursor-pointer fill-gray-400">
            <path
                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
            </path>
          </svg>
        </div>

      </div>
      <div v-if="isLogin" class="flex items-center ml-auto space-x-6">
        <button class="font-medium text-[15px] border-0 outline-0 cursor-pointer">
          <router-link to="/login"><a @click="logout()"
                                      class="px-6 py-2.5 rounded-lg cursor-pointer text-white text-sm tracking-wider font-medium border-0 outline-0 outline-none bg-red-700 hover:bg-red-800 active:bg-red-700">
            Logout</a></router-link>
        </button>
        <button
            class="lg:hidden cursor-pointer"
            @click="isMenuOpen = true"
        >
          <svg class="w-7 h-7" fill="#000" viewBox="0 0 20 20">
            <path
                fill-rule="evenodd"
                d="M3 5h14v2H3V5zm0 5h14v2H3v-2zm0 5h14v2H3v-2z"
                clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div v-else class="flex items-center ml-auto space-x-6">
        <button class="font-medium text-[15px] border-0 outline-0 cursor-pointer">
          <router-link to="/login"><a class="text-blue-700 hover:underline">Login</a></router-link>
        </button>
        <router-link to="/register">
          <button
              class="px-4 py-2 text-sm rounded-xs font-medium text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 cursor-pointer">
            Register
          </button>
        </router-link>
        <button
            class="lg:hidden cursor-pointer"
            @click="isMenuOpen = true"
        >
          <svg class="w-7 h-7" fill="#000" viewBox="0 0 20 20">
            <path
                fill-rule="evenodd"
                d="M3 5h14v2H3V5zm0 5h14v2H3v-2zm0 5h14v2H3v-2z"
                clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>


    </div>
  </header>
</template>

<style scoped>
.logo-image{
  border-radius: 10px !important;
}
</style>