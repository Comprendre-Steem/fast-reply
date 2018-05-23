<template>
  <div class="box message-preview">
    <div v-if="selectedComment" class="top">
      <div class="avatar">
        <img :src="$options.filters.avatar(selectedComment.author)">
      </div>
      <div class="address">
        <div class="steem-username">
          <a target="_blank" :href="$options.filters.profile(selectedComment.author)">
            @{{ selectedComment.author }} ({{ parseInt(selectedComment.reputation) }})
          </a>
        </div>
        <button @click.prevent="followAccount(selectedComment.author)" class="button is-success is-small">
          Follow @{{ selectedComment.author }}
        </button>
        <button @click.prevent="unfollowAccount(selectedComment.author)" class="button is-warning is-small">
          Unfollow @{{ selectedComment.author }}
        </button>
        <button @click.prevent="ignoreAccount(selectedComment.author)" class="button is-danger is-small">
          Mute @{{ selectedComment.author }}
        </button>
      </div>
      <div>
        <span class="subject"><strong>{{ selectedComment.rootTitle }}</strong></span>
        <span class="msg-attachment">
          <a target="_blank" :href="$options.filters.steemit(selectedComment.url)">
              <icon name="external-link-alt" scale="0.8"></icon>
          </a>
        </span>
      </div>
      <hr>
      <div class="content" v-html="$options.filters.markdownToHTML(selectedComment.body)">
      </div>
    </div>
  </div>
</template>

<script>
import sc2Utils from '@/utils/sc2-utils.js'
import toast from '@/utils/toast.js'

export default {
  name: 'message-pane-preview',
  computed: {
    selectedComment () {
      return this.$store.getters.inbox.selectedComment
    },
    api () {
      return this.$store.getters.steemconnect.api
    },
    me () {
      return this.$store.getters.steemconnect.user.name
    }
  },
  methods: {
    /**  SteemConnect v2 -- Direct actions **/
    followAccount: function (username) {
      sc2Utils.follow(this.api, this.me, username)
        .then(() => toast.createDialog('success', 'You are now following ' + username, '3000'))
        .catch(err => toast.createDialog('error', err, 3000))
    },
    unfollowAccount: function (username) {
      sc2Utils.unfollow(this.api, this.me, username)
        .then(() => toast.createDialog('success', 'You are not following ' + username + ' anymore', '3000'))
        .catch(err => toast.createDialog('error', err, 3000))
    },
    ignoreAccount: function (username) {
      let app = this
      sc2Utils.ignore(this.api, this.me, username)
        .then(() => app.$store.dispatch('addUserToIgnore', username))
        .then(() => toast.createDialog('success', 'You are now ignoring' + username, '3000'))
        .catch(err => toast.createDialog('error', err, 3000))
    }
  }
}
</script>

<style scoped>

</style>