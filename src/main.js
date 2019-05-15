// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios';
import '../static/globals/gt.js'
import 'element-ui/lib/theme-chalk/index.css';
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer);
import settings from "./settings"
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$settings = settings;
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios; // 把对象挂载vue中

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
