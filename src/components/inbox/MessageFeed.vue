<template>
  <div class="column is-4 messages hero is-fullheight" id="message-feed">
    <div class="inbox-messages" id="inbox-messages">
      <div v-for="msg in messages" class="card" :class="[(selectedComment && selectedComment.id === msg.id) ? 'active' : '']" :key="msg.id" :id="'msg-card-'+msg.id" @click="selectComment(msg)" :data-preview-id="msg.id">
        <div class="card-content" :class="[msg.reputation < 25 ? 'low-reputation': '']">
          <div class="msg-header">
            <a target="_blank" :href="$options.filters.profile(msg.author)">
              <span class="steem-username">@{{ msg.author }} ({{ parseInt(msg.reputation) }})</span>
            </a>
            <span class="float-right"><a @click="ignoreComment(msg)"><icon name="window-close" class="red" scale="0.8"></icon></a></span>
            <span class="msg-timestamp">{{ msg.created | date }}</span>
          </div>
          <div class="msg-subject">
            <span class="msg-subject"><strong>{{ msg.rootTitle }}</strong></span>
            <span class="float-right">(${{ msg.payout }})&nbsp;
                <a target="_blank" :href="$options.filters.steemit(msg.url)"><icon name="external-link-alt" scale="0.8"></icon></a>
            </span>
          </div>
          <div class="msg-snippet">
            <!-- v-html : https://fr.vuejs.org/v2/guide/syntax.html#Interpretation-du-HTML -->
            <!-- Using filters in attributes : https://github.com/vuejs/vue/issues/4352 -->
            <p v-html="$options.filters.truncate($options.filters.markdownToHTML(msg.body), 250)"></p>
          </div>
        </div>
      </div>
      <div class="card-content" v-show="messages.isEmpty">
        <div class="msg-subject">
          <span class="msg-subject"><strong>No comments</strong></span>
        </div>
      </div>
    </div>
    <div class="credits">
      <!-- Sticky footer variants: https://css-tricks.com/couple-takes-sticky-footer/ -->
      <strong>
        Made with <icon name="heart" class="red" scale="0.8"></icon> by
        <a href="https://www.steemit.com/@roxane">@roxane</a> and
        <a href="https://www.steemit.com/@oroger">@oroger</a>
      </strong>
    </div>
  </div>
</template>

<script>
import toast from '@/utils/toast.js'
export default {
  name: 'message-feed',
  computed: {
    messages () {
      let config = this.$store.getters.config
      let inbox = this.$store.getters.inbox
      if (inbox.comments) {
        let messages = inbox.comments.filter(comment => (inbox.filter == null || inbox.filter.id === comment.rootId))
        if (config.sort) {
          // TODO: Add sort type and select extract function based on it
          let extractValue = data => (config.sort.field === 'created') ? Date.parse(data) : data
          // Define ASC / DESC sort functions
          let asc = (a, b) => extractValue(b[config.sort.field]) - extractValue(a[config.sort.field])
          let desc = (a, b) => extractValue(a[config.sort.field]) - extractValue(b[config.sort.field])
          // Sort messages based on configured value
          messages = (config.sort.inverted) ? messages.sort(asc) : messages.sort(desc)
        }
        return messages
      } else {
        return []
      }
    },
    selectedComment () {
      return this.$store.getters.inbox.selectedComment
    },
    filter () {
      return this.$store.getters.inbox.filter
    }
  },
  watch: {
    filter (after, before) {
      if (this.messages.length > 0) {
        // Select first message from list
        this.$store.dispatch('selectComment', this.messages[0])
      } else {
        // No message available
        this.$store.dispatch('selectComment', null)
      }
    }
  },
  methods: {
    selectComment (comment) {
      this.$store.dispatch('selectComment', comment)
    },
    ignoreComment (comment) {
      this.$store.dispatch('markCommentProcessed', comment.id)
      toast.createDialog('success', 'Comments ignored', 2000)
    }
  }
}
</script>

<style scoped>
#message-feed {
  display: flex;
  flex-direction: column;
}
.inbox-messages {
  flex: 1 0 auto;
}
.credits {
  flex-shrink: 0;
  margin-top: 15px;
  text-align: center;
}
</style>
