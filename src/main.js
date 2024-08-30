import 'core-js/stable'
import Vue from 'vue'
//import CoreuiVuePro from '@coreui/vue-pro'
import CoreuiVuePro from '../node_modules/@coreui/vue-pro/src/index.js'
import App from './App'
import router from './router/index'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import i18n from './i18n.js'
import VueKonva from 'vue-konva';
import AuthService from './lib/authservice'
import Api from './lib/api'
import Helper from './utils/helper.js'
import "./index.css";
import 'material-icons/iconfont/material-icons.css';
//import opencv from './opencv.js';

Vue.use(CoreuiVuePro)
Vue.prototype.$log = console.log.bind(console)

Vue.use(VueKonva);

window.apiUrl = window.config.API_URL;
window.api = new Api();
window.auth = new AuthService();
window.helper = new Helper();

// window.business = new BusinessHelper();
// window.drawing = new DrawingHelper();


new Vue({
  el: '#app',
  router,
  store,
  //CIcon component documentation: https://coreui.io/vue/docs/components/icon
  icons,
  i18n,
  template: '<App/>',
  components: {
    App
  }
})
