<template>
  <div
    class="fixed top-0 left-0 w-[100vw] h-[70px] sm:h-[80px] shadow-md lg:px-[100px] md:px-[50px] px-[20px] flex items-center justify-between z-20 bg-slate-50">
    <div class="flex text-xl items-center space-x-10 justify-between font-semibold">
      <div><a href="/">Home</a></div>
      <div><a href="/notes">Notes</a></div>
      <div><a href="/about">About</a></div>
    </div>
    <!-- <div class="hover:bg-[#FF9000] bg-slate-200 text-slate-900 transition hover:text-white font-semibold px-5 py-3 rounded-full font-poppins">Login</div> -->
    <div class="text-xl cursor-pointer">
      <a v-if="authStatus === 'loading'" href="#"></a>
      <a v-else-if="authStatus === 'authenticated'" href="/profile">
        <div v-if="picture">
          <img :src="picture" class="object-cover hover:cursor-pointer w-12 h-12 rounded-full overflow-hidden" />
        </div>
        <div v-else>
          <img src="../assets/default.webp"
            class="object-cover hover:cursor-pointer w-12 h-12 rounded-full overflow-hidden" />
        </div>
      </a>
      <a v-else-if="authStatus === 'unauthenticated'"
        class="hover:bg-[#1f1f1f] bg-slate-200 text-slate-900 transition hover:text-white font-semibold px-5 py-3 rounded-full font-poppins"
        :href="url">
        Login
      </a>
      <!-- <a href="/profile"><img src="../assets/default.webp" class="object-cover hover:cursor-pointer" /></a> -->
      <!-- <a :href="authStatus === 'loading' ? '#' : authStatus === 'unauthenticated' ? url : '/auth/signout'">
        {{ authStatus }}
      </a> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    authStatus: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      url: "",
      picture: this.$store.state.auth.data?.picture
    }
  },
  async mounted() {
    console.log(this.picture)
    const url = window.location.origin + window.location.pathname
    this.url = "https://ziprawan.vercel.app/api/authorize?provider=google&redirect_uri=" + url
  }
}
</script>
