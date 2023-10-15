<template>
  <div>
    <div class="font-sans mt-4 outline outline-1 rounded-md h-36 xl:h-48">
      <a :href="`/notes/${note.id}`">
        <div class="w-full px-4 py-2">
          <div class="font-bold text-2xl">{{ note.title }}</div>
          <div class="text-sm text-slate-500">Categories: {{ note.categories.join(", ") }}</div>
          <div class="text-sm text-slate-500 text-justify whitespace-pre-line italic">
            {{ note.content.length > 100 ? `${note.content.replaceAll("\n", "").slice(0, 97)}...` :
              note.content.replaceAll("\n", "") }}
          </div>
        </div>
      </a>
      <div class="w-full px-4 pb-2">
        <div class="w-full text-md flex gap-3 right-4">
          <a :href="`/notes/${note.id}`" class="cursor-pointer">Edit</a>
          <button @click="deleteNote()" class="cursor-pointer text-red-500">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  props: {
    note: Object
  },
  methods: {
    ...mapActions('notes', ['deleteData']),
    async deleteNote() {
      const resp = await this.$axios.delete("/api/notes?id=" + this.note.id, {
        headers: {
          "Authorization": `Bearer ${this.$store.state.auth.token}`
        }
      })

      if (resp.status === 200) {
        this.deleteData(this.id)
        window.location.reload()
      }
    }
  }
}
</script>