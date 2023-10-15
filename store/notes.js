export const state = () => ({
  data: [],
})

export const mutations = {
  UPDATE_DATA(state, payload) {
    if (payload) {
      let done = []
      let arrs = []

      payload.forEach((p) => {
        if (!done.includes(p.id)) {
          arrs.push(p)
          done.push(p.id)
        }
      })
      state.data.forEach((p) => {
        if (!done.includes(p.id)) {
          arrs.push(p)
          done.push(p.id)
        }
      })

      state.data = arrs
    }
  },
  DELETE_DATA(state, payload) {
    if (payload) {
      state.data = state.data.filter((data) => data.id !== payload)
    }
  },
}

export const actions = {
  updateData(ctx, payload) {
    ctx.commit('UPDATE_DATA', payload)
  },
  deleteData(ctx, payload) {
    ctx.commit('DELETE_DATA', payload)
  },
}
