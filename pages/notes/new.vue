<template>
  <form @submit.prevent="submitHandler">
    <div class="bg-gray-100 rounded-xl flex flex-col gap-2 py-4 px-6">
      <div class="flex flex-col gap-2">
        <p class="text-slate-800 font-semibold">Title:</p>
        <input v-model="form.title" class="bg-transparent bg-white py-2 px-4 w-full" autocomplete="off" autofocus
          spellcheck="false" />
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-slate-800 font-semibold">Content:</p>
        <textarea v-model="form.content" class="text-lg resize-none bg-transparent h-[180px] bg-white py-2 px-4 w-full"
          autocomplete="off" spellcheck="false"></textarea>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-slate-800 font-semibold">Categories:</p>
        <input v-model="form.categories" class="bg-transparent bg-white py-2 px-4 w-full" autocomplete="off" autofocus
          spellcheck="false" placeholder="separated by comma" />
      </div>
      <div>
        <input v-model="form.isPrivate" type="checkbox" />
        <label>Private</label>
      </div>
      <div class="ml-auto flex gap-4">
        <button type="submit">Save</button>
        <a href="/notes">Cancel</a>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState, mapActions } from "vuex"

export default {
  data() {
    return {
      form: {
        title: "",
        content: "",
        categories: "",
        isPrivate: false
      },
    }
  },
  computed: {
    ...mapState('notes', ['data'])
  },
  middleware: "notes",
  methods: {
    ...mapActions('notes', ['updateData']),
    async submitHandler() {
      console.log(this.data)
      const form = this.form;
      const toAppend = {
        id: "",
        title: form.title.trim(),
        content: form.content.trim(),
        categories: form.categories.trim().trim(",").split(","),
        isPrivate: form.isPrivate
      };

      const resp = await this.$axios.post('/api/notes', toAppend, {
        headers: {
          "Authorization": `Bearer ${this.$store.state.auth.token}`
        }
      })

      if (resp.status === 201) {
        this.updateData(resp.data.message.data)
      }

      this.$router.push("/notes")
    },
  }
}
</script>