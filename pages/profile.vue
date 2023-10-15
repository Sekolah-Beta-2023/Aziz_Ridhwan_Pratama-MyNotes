<template>
  <main v-if="authStatus === 'authenticated' && auth">
    <div class="w-full p-5 sm:p-10 flex flex-col gap-8 bg-white shadow-md rounded-2xl relative">
      <div class="block sm:hidden text-3xl font-semibold relative">
        Profile
      </div>
      <div>
        <div class="relative m-auto bg-transparent flex justify-center items-center">
          <img :src="picture ?? '../assets/default.webp'" class="overflow-hidden w-36 h-36 rounded-full" />
        </div>
      </div>
      <div>
        <div v-for="v, k in auth" :key="k">
          <div class="px-4 py-2 mt-2 bg-gray-100 rounded-lg">
            <p class="font-semibold">{{ k.charAt(0).toUpperCase() + k.slice(1) }}</p>
            <p>{{ v }}</p>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <button
          class="py-3 px-4 mt-3 bg-gray-100 hover:bg-slate-950 hover:text-white transition w-fit rounded-lg font-semibold flex items-center gap-1">
          <a href="/auth/signout">Log Out</a>
        </button>
        <button
          class="py-3 px-4 mt-3 bg-gray-100 hover:bg-red-500 hover:text-white transition w-fit rounded-lg font-semibold flex items-center gap-1">
          <button @click="deleteAccount()">Delete Account</button>
        </button>
      </div>
    </div>
  </main>
  <main v-else class="flex flex-col gap-3">
    <div>
      Please login first!
    </div>
    <a :href="url"
      class="py-3 px-4 w-fit h-fit bg-gray-100 hover:bg-slate-950 hover:text-white transition rounded-lg font-semibold">
      <button>Login with Google</button>
    </a>
  </main>
</template>

<script>
export default {
  data() {
    return {
      authStatus: this.$store.state.auth.status,
      auth: null,
      url: "https://ziprawan.vercel.app/api/authorize?provider=google&redirect_uri=",
      pictute: null
    }
  },
  async mounted() {
    this.url = this.url + window.location.origin + window.location.pathname
    const authData = this.$store.state.auth.data;
    if (authData) {
      this.auth = {
        name: authData.name,
        username: authData.username,
        email: authData.email,
        locale: authData.locale,
      }
      this.picture = authData.picture
      console.log("Gambar", authData.picture)
    }
  },
  methods: {
    async deleteAccount() {
      await this.$axios.delete("/api/notes?id=all", {
        headers: {
          "Authorization": `Bearer ${this.$store.state.auth.token}`
        }
      })
      const resp = await this.$axios.delete("/api/auth/session", {
        headers: {
          "Authorization": `Bearer ${this.$store.state.auth.token}`
        }
      })

      if (resp.status === 200) {
        this.$kuki.remove("session-token")
        this.$store.dispatch("auth/updateData", {
          data: null,
          token: null,
          status: "unauthenticated"
        })
        this.$router.push("/")
        window.location.reload()
      }
    }
  }
}
</script>