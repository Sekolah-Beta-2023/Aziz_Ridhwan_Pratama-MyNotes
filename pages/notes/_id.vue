<template>
  <div v-if="note.length === 0">
    Note not found!
  </div>
  <div v-else>
    <div class="flex flex-col gap-2">
      <div v-if="!edit" class="flex flex-col gap-3">
        <div>
          <div class="w-full text-md flex gap-3 right-4">
            <button @click="edit = !edit"
              class="bg-gray-100 px-3 py-2 rounded-sm hover:bg-black hover:text-white cursor-pointer">Edit</button>
            <button @click="deleteNote()"
              class="bg-gray-100 px-3 py-2 rounded-sm hover:bg-red-500 hover:text-white cursor-pointer text-red-500">Delete</button>
          </div>
        </div>
        <div class="text-4xl font-bold">{{ note[0].title }}</div>
        <div class="">{{ note[0].content }}</div>
        <div class="text-slate-500">Categories: {{ note[0].categories.join(", ") }}</div>
      </div>
      <div v-else>
        <form @submit.prevent="submitHandler">
          <div class="bg-gray-100 rounded-xl flex flex-col gap-2 py-4 px-6">
            <div class="flex flex-col gap-2">
              <p class="text-slate-800 font-semibold">Title:</p>
              <input v-model="form.title" class="bg-transparent bg-white py-2 px-4 w-full" autocomplete="off"
                spellcheck="false" />
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-slate-800 font-semibold">Content:</p>
              <textarea v-model="form.content"
                class="text-lg resize-none bg-transparent h-[180px] bg-white py-2 px-4 w-full" autocomplete="off"
                spellcheck="false"></textarea>
            </div>
            <div class="flex flex-col gap-2">
              <p class="text-slate-800 font-semibold">Categories:</p>
              <input v-model="form.categories" class="bg-transparent bg-white py-2 px-4 w-full" autocomplete="off"
                spellcheck="false" placeholder="separated by comma" />
            </div>
            <div>
              <input v-model="form.isPrivate" type="checkbox" />
              <label>Private</label>
            </div>
            <div class="ml-auto flex gap-4">
              <button type="submit">Save</button>
              <button @click="edit = !edit">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
export default {
  data() {
    return {
      id: this.$route.params.id,
      note: [],
      edit: false,
      form: {
        title: "",
        content: "",
        categories: "",
        isPrivate: false
      }
    }
  },
  mounted() {
    console.log(this.$store.state.notes.data, this.$route.params.id)
    const note = this.$store.state.notes.data.filter(d => d.id == this.id)
    this.note = note
    this.form = {
      title: note[0].title,
      content: note[0].content,
      categories: note[0].categories.join(","),
      isPrivate: note[0].isPrivate
    }
  },
  middleware: "notes",
  methods: {
    ...mapActions('notes', ['updateData', 'deleteData']),
    async submitHandler() {
      const { categories, ...form } = this.form;
      const resp = await this.$axios.put("/api/notes", { id: this.id, ...form, categories: categories.split(",") }, {
        headers: {
          "Authorization": `Bearer ${this.$store.state.auth.token}`
        }
      })

      if (resp.status === 200) {
        this.updateData(resp.data.message.data)
        this.note = this.$store.state.notes.data.filter(d => d.id == this.id)
      }

      this.edit = !this.edit
    },
    async deleteNote() {
      const resp = await this.$axios.delete("/api/notes?id=" + this.id, {
        headers: {
          "Authorization": `Bearer ${this.$store.state.auth.token}`
        }
      })

      if (resp.status === 200) {
        this.deleteData(this.id)
        this.$router.push("/notes")
      }
    }
  }
}
</script>