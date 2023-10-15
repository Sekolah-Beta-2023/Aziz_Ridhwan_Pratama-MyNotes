import { Middleware } from '@nuxt/types'

const middleware: Middleware = async (ctx) => {
  const authState = ctx.store.state.auth.status

  if (authState === 'authenticated') {
    const resp = await ctx.app.$axios.get('/api/notes', {
      headers: {
        Authorization: `Bearer ${ctx.store.state.auth.token}`,
      },
    })

    ctx.store.dispatch('notes/updateData', resp.data.message)
  }
}

export default middleware
