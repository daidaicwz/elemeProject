// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import '@/common/stylus/index.styl';

Vue.config.productionTip = false
// 注册成功后，就可以在任何一个组件中使用this.$http服务了
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  //components: { App },
  //template: '<App/>'
  render: h => h(App)
})
