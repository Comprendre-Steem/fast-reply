// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// Load 3rd patry libs
import 'bulma/css/bulma.css'
import 'bulma-slider/dist/bulma-slider.min.css'
import 'bulma-slider/dist/bulma-slider.min'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

// Initialize App
import './utils/filters.js'
import store from '@/utils/store.js'
import router from '@/utils/router'
import App from '@/App'

// Global component declaration
Vue.component('icon', Icon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
  created () {
    console.log('Load Steem profile')
    // Request user details if token is available
    let token = this.$ls.get('access_token')
    if (token != null) {
      this.$store.dispatch('connect', token)
    }

    // Config migration 0.1 => 0.2
    if (!this.$store.getters.config.version) {
      this.$store.dispatch('config', {key: 'sort', value: {field: 'created', inverted: false}})
      this.$store.dispatch('config', {key: 'version', value: 0.2})
      console.log('Configuration migrated to 0.2')
    }
  },
  mounted () {
    const SECOND = 1000

    /** Start infinite execution of trigger action **/
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval

    // refresh VP every minute
    let vpTimer = setInterval(this.$store.dispatch, 60 * SECOND, 'updateVP')
    this.$store.dispatch('timer', {name: 'updateVP', value: vpTimer})

    // execute a pending vote every 5 seconds
    let voteTimer = setInterval(this.$store.dispatch, 5 * SECOND, 'executeNextPendingActionOfType', 'vote')
    this.$store.dispatch('timer', {name: 'executeNextPendingVote', value: voteTimer})

    // execute a pending comment every 30 seconds
    let commentTimer = setInterval(this.$store.dispatch, 30 * SECOND, 'executeNextPendingActionOfType', 'comment')
    this.$store.dispatch('timer', {name: 'executeNextPendingComment', value: commentTimer})
  }
})
