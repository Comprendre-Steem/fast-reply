// https://stackoverflow.com/questions/40564071/how-do-i-break-up-my-vuex-file
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource' // https://github.com/pagekit/vue-resource
import VueStorage from 'vue-ls'
// Steem Libs
import steem from 'steem'
import sc2 from 'sc2-sdk'
import sc2Utils from '@/utils/sc2-utils.js'
// Utils
import Raven from 'raven-js'
import toast from '@/utils/toast.js'

// Plugin declaration
Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(VueStorage)

// Initialize SteemConnect v2
var api = sc2.Initialize({
  app: 'fast-reply.app',
  callbackURL: 'http://localhost:8080/#/steemconnect', // Dev localhost URL
  // callbackURL: 'http://very-fast-reply.surge.sh/#/steemconnect', // Beta URL
  // callbackURL: 'http://fast-reply.surge.sh/#/steemconnect/', // Live demo URL
  scope: ['vote', 'comment', 'custom_json']
})

let defaultSort = {
  field: 'created',
  inverted: false
}

const defaultSignature = '<br/><div class="pull-right"><sub><a href="https://steemit.com/@fast-reply">Sent with Fast-Reply</a></sub></div>'

let defaultConfig = {
  version: 0.3,
  ignoreList: {comments: [], users: []},
  vote: 100,
  // Since 0.2
  sort: defaultSort,
  // Since 0.3
  signature: defaultSignature
}

const filterIgnored = function (comments, filter, ignoreList) {
  return comments ? comments
    // Filter using selected article
    .filter(comment => (filter == null || filter.id === comment.rootId))
    // Filter comments from ignored users && Filter comments previously ignored
    .filter(comment => (!ignoreList.users.includes(comment.author) && !ignoreList.comments.includes(comment.id)))
    // Otherwise return null
    : null
}

const LS_CONFIG = 'config'
const LS_PENDING = 'pending'
const LS_RUNNING = 'running'

// Create Global Store
export default new Vuex.Store({
  state: {
    steemconnect: {
      api: api,
      user: null,
      vp: null
    },
    config: defaultConfig,
    timers: {},
    inbox: {
      comments: null,
      filter: null,
      selectedComment: null
    },
    pending: Vue.ls.get(LS_PENDING, []),
    isSchedulerRunning: Vue.ls.get(LS_RUNNING, true),
    accounts: {
      blog: new Set(),
      ignore: new Set()
    }
  },
  mutations: {
    clearIgnoreList (state) {
      state.config.ignoreList = {comments: [], users: []}
      this.commit('saveConfig')
    },
    connect (state, result) {
      state.steemconnect.user = result.account
    },
    updateVP (state, vp) {
      state.steemconnect.vp = vp
    },
    logout (state) {
      // clear steemconnect state
      state.steemconnect.user = null
      state.steemconnect.vp = null
    },
    loadConfig (state) {
      console.log('Loading config...')
      // First, attempt to load 0.2 config
      state.config = Vue.ls.get(LS_CONFIG, defaultConfig)
      // Then overload with 0.3 config, if present
      state.config = Vue.ls.get(LS_CONFIG + '_' + state.steemconnect.user.name, state.config)
      // Config migration 0.1 => 0.2
      if (!state.config.version) {
        this.$store.dispatch('config', {key: 'sort', value: {field: 'created', inverted: false}})
        this.$store.dispatch('config', {key: 'version', value: 0.2})
        console.log('Configuration migrated to 0.2')
      }
      // Config migration 0.2 => 0.3
      if (state.config.version === 0.2) {
        this.$store.dispatch('config', {key: 'signature', value: defaultSignature})
        this.$store.dispatch('config', {key: 'version', value: 0.3})
        console.log('Configuration migrated to 0.3')
      }
      this.commit('saveConfig')
    },
    config (state, {name, value}) {
      state.config[name] = value
      this.commit('saveConfig')
    },
    saveConfig (state) {
      const key = LS_CONFIG + '_' + state.steemconnect.user.name
      Vue.ls.set(key, state.config)
    },
    timer (state, timer) {
      if (state.timers[timer]) {
        // Remove previous interval, if set
        clearInterval(state.timers[timer.name])
        state.timers[timer] = null
      }

      if (timer.value) {
        state.timers[timer.name] = timer.value
      }
    },
    reload (state, result) {
      state.inbox.comments = result.data.comments
      // Count number of unique rootId among comments
      let articlesCount = state.inbox.comments.map(c => c.rootId).filter((value, index, self) => self.indexOf(value) === index).length
      toast.createDialog('success', 'Found ' + state.inbox.comments.length + ' new comment(s) on ' + articlesCount + ' articles', 5000)
    },
    selectFilter (state, article) {
      state.inbox.filter = article
    },
    loadMessages (state, messages) {
      state.inbox.messages = messages
    },
    selectComment (state, comment) {
      state.inbox.selectedComment = comment
    },
    ignoreComment (state, commentId) {
      // Find comment based on its id and remove it from the list
      for (var i = 0; i < state.inbox.comments.length; i++) {
        if (state.inbox.comments[i].id === commentId) {
          // Find the right index and remove it
          state.inbox.comments.splice(i, 1)
        }
      }
      // Push to ignore list
      state.config.ignoreList.comments.push(commentId)
      this.commit('saveConfig')
    },

    /** Managing pending actions **/
    addPendingAction (state, action) {
      state.pending.push(action)
      Vue.ls.set(LS_PENDING, state.pending)
    },
    deletePendingAction (state, action) {
      state.pending = state.pending.filter(a => a !== action)
      Vue.ls.set(LS_PENDING, state.pending)
    },
    failedAttempt (state, action) {
      // Search for action in state
      let failedAction = state.pending.find(item => item === action)
      if (failedAction) {
        // if found, increase attempts counter
        failedAction.attempts++
      }
    },
    isSchedulerRunning (state, value) {
      state.isSchedulerRunning = value
      Vue.ls.set(LS_RUNNING, state.isSchedulerRunning)
    },
    accounts (state, {type, accounts}) {
      state.accounts[type] = accounts
      if (type === 'ignore') {
        // Use those names as ignore list to filter the messages
        state.config.ignoreList.users = Array.from(accounts)
        this.commit('saveConfig')
      }
    }
  },
  actions: {
    async connect ({ dispatch, commit, state }, token) {
      let success = false
      // wait for async call to resolve using await, then use result
      state.steemconnect.api.setAccessToken(token)
      await state.steemconnect.api.me()
        .then(result => {
          commit('connect', result)
          success = true
          return result
        })
        .catch(err => {
          console.log(err)
          Raven.captureException(err)
        })

      if (success) {
        // Load connected user configuration, if present
        commit('loadConfig')
        // Force reload on login
        dispatch('reload')
        // Retrieve user VP
        dispatch('updateVP')
        // Load account (un)follow/mute list
        dispatch('loadAccounts')
      } else {
        toast.createDialog('error', 'Error during login', 5000)
      }
    },
    updateVP ({ dispatch, commit, state }) {
      if (state.steemconnect.user) {
        steem.api.getAccounts([state.steemconnect.user.name], function (err, response) {
          if (!err) {
            let secondsago = (new Date() - new Date(response[0].last_vote_time + 'Z')) / 1000
            let vpow = response[0].voting_power + (10000 * secondsago / 432000)
            vpow = Math.min(vpow / 100, 100).toFixed(2)
            commit('updateVP', vpow)
          }
        })
      }
    },
    loadAccounts ({dispatch, commit, state}) {
      if (state.steemconnect.user) {
        const chunkSize = 100
        // Recursive function to go through all the following by chunk
        let loadFollowing = function (username, type, pos, accounts) {
          steem.api.getFollowing(username, pos, type, chunkSize, function (err, result) {
            if (!err) {
              for (let follows of result) {
                if (follows.what.length > 0 && follows.what[0] === type) {
                  accounts.add(follows.following)
                }
              }
              // Check if there is more to process
              if (result.length === chunkSize) {
                loadFollowing(username, type, result[result.length - 1].following, accounts)
              } else {
                commit('accounts', {type: type, accounts: accounts})
              }
            } else {
              console.log(err)
              toast.createDialog('error', 'Could not load related accounts: ' + err, 2000)
              Raven.captureException(err)
            }
          })
        }
        // Start fetching the account data
        loadFollowing(state.steemconnect.user.name, 'blog', 0, new Set())
        loadFollowing(state.steemconnect.user.name, 'ignore', 0, new Set())
      }
    },
    clearIgnoreList ({ dispatch, commit }) {
      commit('clearIgnoreList')
      dispatch('reload')
    },
    logout ({ commit }) {
      commit('logout')
    },
    timer ({dispatch, commit, state}, timer) {
      commit('timer', timer)
    },
    async reload ({dispatch, commit, state}) {
      let user = state.steemconnect.user
      if (user) {
        const url = 'http://api.comprendre-steem.fr/getComments?username=' + user.name
        commit('reload', await Vue.http.get(url))
        dispatch('selectFirstComment')
      }
    },
    selectFirstComment ({dispatch, commit, state}) {
      // Filter to find first non ignored comment
      let filtered = filterIgnored(state.inbox.comments, state.inbox.filter, state.config.ignoreList)
      if (filtered.length > 0) {
        let position = state.config.sort.inverted ? 0 : filtered.length - 1
        // Select that comment
        commit('selectComment', filtered[position])
      }
    },
    selectFilter ({dispatch, commit}, article) {
      commit('selectFilter', article)
    },
    selectComment ({dispatch, commit, state}, comment) {
      commit('selectComment', comment)
    },
    config ({dispatch, commit, state}, {key, value}) {
      commit('config', {name: key, value: value})
    },
    markCommentProcessed ({dispatch, commit, state}, commentId) {
      commit('ignoreComment', commentId)
      dispatch('selectFirstComment')
    },
    addUserToIgnore ({dispatch, commit, state}, username) {
      // Blockchain has been updated, let's reload those data locally too
      commit('loadAccounts')
    },

    /** Managing pending actions **/
    addPendingAction ({dispatch, commit, state}, action) {
      commit('addPendingAction', action)
    },
    deletePendingAction ({dispatch, commit, state}, action) {
      commit('deletePendingAction', action)
    },
    executePendingAction ({dispatch, commit, state}, action) {
      switch (action.type) {
        case 'comment': {
          sc2Utils.comment(state.steemconnect.api, state.steemconnect.user.name, action.author, action.permlink, action.body, action.created)
            .then(() => commit('deletePendingAction', action))
            .catch(err => {
              console.log('Error SC2 during comment: ', err.error_description)
              console.log('Failed action: ', action)
              commit('failedAttempt', action)
              Raven.captureException(err)
            })
          break
        }
        case 'vote': {
          sc2Utils.vote(state.steemconnect.api, state.steemconnect.user.name, action.author, action.permlink, action.vote)
            .then(() => commit('deletePendingAction', action))
            .catch(err => {
              commit('failedAttempt', action)
              if (err.error_description === 'itr->vote_percent != o.weight: You have already voted in a similar way.') {
                // already been processed, remove this action from pending
                commit('deletePendingAction', action)
              } else {
                console.log('Failed action: ', action)
                console.log('Error SC2 during vote: ', err.error_description)
                commit('failedAttempt', action)
                Raven.captureException(err)
              }
            })
          break
        }
        default: {
          toast.createDialog('error', 'Unknown action: ' + action.type, 3000)
          break
        }
      }
    },
    /** Execute next action if scheduler is enabled **/
    executeNextPendingActionOfType ({dispatch, commit, state}, type) {
      if (state.isSchedulerRunning) {
        // find next pending action of requested type, if any
        let next = state.pending
          .filter(action => action.type === type)
          // Abandon the action after 5 failed attempts
          .filter(action => action.attempts < 3)
          // If candidates are available, take the first one
          .shift()
        if (next) {
          // Execute it
          dispatch('executePendingAction', next)
        }
      }
    },
    toggleScheduler ({commit, state}) {
      commit('isSchedulerRunning', !state.isSchedulerRunning)
    }
  },
  getters: {
    user: state => {
      return state.steemconnect.user
    },
    steemconnect: state => {
      return state.steemconnect
    },
    config: state => {
      return state.config
    },
    inbox: state => {
      return {
        filter: state.inbox.filter,
        selectedComment: state.inbox.selectedComment,
        comments: filterIgnored(state.inbox.comments, null, state.config.ignoreList)
      }
    },
    pending: state => {
      return state.pending
    },
    accounts: state => {
      return state.accounts
    },
    isSchedulerRunning: state => {
      return state.isSchedulerRunning
    }
  }
})
