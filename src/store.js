import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  asideShow: false,
  darkMode: false,

  // Branding state
  logoUrl: '',
  faviconUrl: '',
  primaryColor: '#ffffff',
  secondaryColor: '#000000',
  fontFamily: 'Arial',
}

const mutations = {
  toggleSidebarDesktop(state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile(state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set(state, [variable, value]) {
    state[variable] = value
  },
  toggle(state, variable) {
    state[variable] = !state[variable]
  },

  // Branding-specific mutations
  setBranding(state, branding) {
    state.logoUrl = branding.logoUrl
    state.faviconUrl = branding.faviconUrl
    state.primaryColor = branding.primaryColor
    state.secondaryColor = branding.secondaryColor
    state.fontFamily = branding.fontFamily
  }
}

export default new Vuex.Store({
  state,
  mutations
})