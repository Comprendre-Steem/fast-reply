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
        <button @click.prevent="followAccount(selectedComment.author)" class="button is-success is-small" v-if="!isFollowing(selectedComment.author)">
          Follow @{{ selectedComment.author }}
        </button>
        <button @click.prevent="unfollowAccount(selectedComment.author)" class="button is-warning is-small" v-if="isFollowing(selectedComment.author)">
          Unfollow @{{ selectedComment.author }}
        </button>
        <button @click.prevent="muteAccount(selectedComment.author)" class="button is-danger is-small">
          Mute @{{ selectedComment.author }}
        </button>
      </div>
      <div>
        <span class="subject"><strong>{{ selectedComment.rootTitle }}</strong></span>
        <span class="float-right">
          <a target="_blank" :href="$options.filters.steemit(selectedComment.url)" v-tooltip.bottom="'Open in Steemit'">
            <img class="icon-tool" src="@/assets/tools/steemit.svg"/>
          </a>
          <a target="_blank" :href="$options.filters.busy(selectedComment.url)" v-tooltip.bottom="'Open in Busy'">
            <img class="icon-tool" src="@/assets/tools/busy.svg"/>
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
    isFollowing: function (username) {
      return this.$store.getters.accounts.blog.has(username)
    },

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
    muteAccount: function (username) {
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
/**
Steemit specific formatting classes
https://steemit.com/steemit/@steemitblog/new-advanced-formatting-features
**/
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
.text-justify {
  text-align: justify;
  text-justify: inter-word;
}
</style>
