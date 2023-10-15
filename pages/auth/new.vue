<template>
  <div>
    <div>Welcome New User!</div>
    <div>Please customize your profile first :&#41;</div>
    <form @submit.prevent="submitHandler">
      <div>
        Name:
        <input class="px-1 pb-1" v-model="auth.name" />
      </div>
      <div>
        Username:
        <input class="px-1 pb-1" v-model="auth.username" />
      </div>
      <div class="ml-auto flex gap-4">
        <button type="submit">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      auth: {
        name: this.$store.state.auth.data.name,
        username: ""
      }
    }
  },
  methods: {
    async submitHandler() {
      if (!this.auth.name || !this.auth.username) {
        window.alert("Name or username cannot be empty!")
      }
      let put = { username: this.auth.username };
      if (this.auth.name !== this.$store.state.auth.data.name) put = { ...put, name: this.auth.name }
      const fetched = await this.$axios.post("/api/auth/session", put, {
        headers: {
          "Authorization": `Bearer ${this.$store.state.auth.token}`
        }
      })

      if (fetched.status === 200) {
        this.$store.dispatch("auth/updateData", {
          data: fetched.data.message,
        })
        this.$router.push("/")
      }
    }
  }
}
</script>