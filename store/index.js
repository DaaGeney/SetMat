const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
  return {
    auth: null,
    id: null
  }
}
export const mutations = {
  setAuth (state, auth) {
    state.auth = auth
  },
  setId (state, id) {
    state.id = id
  }
}
export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    let auth = null, id = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
        id = JSON.parse(parsed.id)
      } catch (err) {
        // No valid cookie found
      }
    }
    commit('setAuth', auth)
    commit('setId', id)
    
  }
}
