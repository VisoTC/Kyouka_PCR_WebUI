import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nickName: "",
    groups: Array<{ gid: number; name: string }>(),
    period: null as string | null,
    select: null as { gid: number; name: string } | null
  },
  mutations: {
    loadInfo(state, payload) {
      if (payload.nickName == undefined || payload.groups == undefined) {
        return
      }
      state.nickName = payload.nickName
      state.groups = payload.groups
    },
    current(state, payload: {
      period: string;
      select: { name: string; gid: number };
    }) {
      state.period = payload.period
      state.select = payload.select
    }
  },
  actions: {
  },
  modules: {
  }
})
