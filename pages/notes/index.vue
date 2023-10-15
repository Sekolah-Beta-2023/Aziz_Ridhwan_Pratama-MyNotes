<template>
  <div v-if="auth">
    <div>Hello, {{ auth.name }}!</div>
    <div class="flex justify-between">
      <div>
        Filter category:
        <select id="filter" v-model="filterQuery" class="p-2 rounded-md" name="title">
          <option value="" selected>Select category</option>
          <option
            v-for="category in Array.from(new Set(notes.filter(n => n.isPrivate === privateOnly).flatMap(n => n.categories)))"
            :key="category" :value="category">{{ category }}</option>
        </select>
      </div>
      <div>
        <label for="filterPrivate">Private</label>
        <input id="filterPrivate" type="checkbox" @click="setPrivate" />
      </div>
    </div>
    <div class="mt-6 mb-2">
      <div>
        <a class="bg-slate-300 rounded-lg p-3 font-serif" href="/notes/new">Add New Note</a>
      </div>
    </div>
    <TransitionGroup name="notes" tag="div" class="relative">
      <NotesCard v-for="note in filterNotes" :key="note.id" :note="note" />
    </TransitionGroup>
  </div>
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
import NotesCard from "~/components/notes/NotesCard.vue";

export default {
  components: {
    NotesCard
  },
  data() {
    return {
      notes: this.$store.state.notes.data,
      filterQuery: "",
      privateOnly: false,
      auth: null,
      url: "https://ziprawan.vercel.app/api/authorize?provider=google&redirect_uri=",
    }
  },
  middleware: "notes",
  async mounted() {
    console.log(this.notes)
    this.url = this.url + window.location.origin + window.location.pathname
    const auth = this.$store.state.auth.data;
    if (auth) {
      this.auth = auth
    }
  },
  computed: {
    filterNotes() {
      if (this.filterQuery) {
        return this.notes.filter(note => note.isPrivate === this.privateOnly).filter(note => note.categories.includes(this.filterQuery));
      }

      return this.notes.filter(note => note.isPrivate === this.privateOnly);
    }
  },
  methods: {
    setPrivate() {
      this.privateOnly = !this.privateOnly;
      this.filterQuery = "";
    }
  }
}
</script>