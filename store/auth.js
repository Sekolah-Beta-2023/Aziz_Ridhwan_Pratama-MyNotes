export const state = () => ({
  data: null,
  token: null,
  status: 'loading',
})

export const mutations = {
  UPDATE_DATA(state, payload) {
    if (payload.data) state.data = payload.data
    if (payload.token) state.token = payload.token
    if (payload.status) state.status = payload.status
  },
}

export const actions = {
  updateData(ctx, payload) {
    ctx.commit('UPDATE_DATA', payload)
  },
}
