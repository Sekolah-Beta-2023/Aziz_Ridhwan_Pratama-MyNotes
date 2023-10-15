import { Middleware } from '@nuxt/types'
import { parse } from 'cookie'

const middleware: Middleware = async (ctx) => {
  if (!ctx.req) return
  const cookies = parse(ctx.req.headers.cookie ?? '')

  if (ctx.route.path === '/auth/signout') {
    ctx.app.$kuki.remove('session-token', {
      path: '/',
    })
    return ctx.redirect('/')
  }

  if ('session-token' in cookies) {
    const token = cookies['session-token']
    const resp = await ctx.$axios.get('/api/auth/session', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
      validateStatus: () => true,
    })

    ctx.app.$kuki.set('last_visit', Math.round(Date.now() / 1000).toString(), {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      path: '/',
    })

    if (resp.status === 200) {
      if (
        !resp.data.message.username &&
        !['/', '/auth/new'].includes(ctx.route.path)
      ) {
        ctx.store.dispatch('auth/updateData', {
          data: resp.data.message,
          token: token,
          status: 'authenticated',
        })
        return ctx.redirect('/auth/new')
      }
      ctx.store.dispatch('auth/updateData', {
        data: resp.data.message,
        token: token,
        status: 'authenticated',
      })
    } else {
      if (resp.status === 404)
        ctx.app.$kuki.remove('session-token', { path: '/' })
      ctx.store.dispatch('auth/updateData', {
        data: null,
        token: null,
        status: 'unauthenticated',
      })
    }
  } else {
    ctx.store.dispatch('auth/updateData', {
      data: null,
      token: null,
      status: 'unauthenticated',
    })
  }

  const queries = ctx.route.query

  if ('access_token' in queries && queries.access_token) {
    const token = queries.access_token
    if (typeof token === 'string') {
      const resp = await ctx.$axios.get('/api/auth/session', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
        validateStatus: () => true,
      })
      if (resp.status === 200) {
        const expire = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        ctx.app.$kuki.set('session-token', queries.access_token, {
          expires: expire,
          path: '/',
        })
        ctx.store.dispatch('auth/updateData', {
          data: resp.data.message,
          token: token,
          status: 'authenticated',
        })
        return ctx.redirect(ctx.route.path ?? '/')
      }
    }
  }
}

export default middleware
