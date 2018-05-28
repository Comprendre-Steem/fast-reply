<template>
  <div class="column is-8 message hero is-fullheight" id="message-pane" v-show="selectedComment">
    <MessagePanePreview></MessagePanePreview>
    <div id="message-reply" class="control" @drop.prevent="onDrop" @dragover.prevent>
      <MessagePaneVoteSlider></MessagePaneVoteSlider>
      <div class="field">
        <label class="label">Your Fast Reply (<a @click="preview = !preview">Preview</a>)</label>
        <div class="control columns">
          <div class="column" :class="[preview ? 'is-6' : 'is-12']">
            <textarea id="reply" class="textarea reply" type="text" v-model="reply" placeholder="Reply here..."></textarea>
          </div>
          <div id="preview" v-if="preview" class="column is-6" v-html="$options.filters.markdownToHTML(reply)">
          </div>
        </div>
      </div>
      <div class="buttons has-addons is-grouped is-centered">
        <span v-for="emoji in emojiQuickSelector" :key="emoji" class="button is-large" @click.prevent="addContent(emoji)">
          {{ emoji }}
        </span>
      </div>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <button class="button is-large is-link is-rounded" @click.prevent="replyToSelectedComment">Reply</button>
        </div>
        <div class="control">
          <button class="button is-large is-success is-rounded" @click.prevent="voteAndReplyToSelectedComment">Vote and Reply</button>
        </div>
        <div class="control">
          <button id="vote" class="button is-large is-warning is-rounded" @click.prevent="voteSelectedComment">Vote</button>
        </div>
        <div class="control">
          <button id="ignore" class="button is-large is-danger is-rounded" @click.prevent="ignoreSelectedComment">Ignore</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toast from '@/utils/toast.js'
import MessagePanePreview from '@/components/inbox/MessagePanePreview'
import MessagePaneVoteSlider from '@/components/inbox/MessagePaneVoteSlider'

export default {
  name: 'message-pane',
  components: { MessagePanePreview, MessagePaneVoteSlider },
  data () {
    return {
      reply: '',
      preview: false
    }
  },
  watch: {
    selectedComment (after, before) {
      if (after != null) {
        this.reply = '@' + after.author + ' '
        let textarea = document.getElementById('reply')
        textarea.focus()
      }
    }
  },
  computed: {
    selectedComment () {
      return this.$store.getters.inbox.selectedComment
    },
    vote () {
      return this.$store.getters.config.vote
    },
    emojiQuickSelector () {
      return ['👍', '😀', '😘', '😍', '😆', '😎', '😅', '😂', '😱', '🙏', '🙄', '😭', '❤️']
    }
  },
  methods: {
    /** Add content to textarea using the current selection **/
    addContent (content) {
      // Inspiration : https://stackoverflow.com/questions/946534/insert-text-into-textarea-with-jquery/2819568#2819568
      let textarea = document.getElementById('reply')
      var startPos = textarea.selectionStart
      var endPos = textarea.selectionEnd
      var scrollTop = textarea.scrollTop
      this.reply = this.reply.substring(0, startPos) + content + this.reply.substring(endPos, this.reply.length)
      // Delay caret positioning to allow Vue.js to update the model and the views
      setTimeout(function () {
        textarea.focus()
        textarea.selectionStart = startPos + content.length
        textarea.selectionEnd = startPos + content.length
        textarea.scrollTop = scrollTop
        textarea.focus()
      }, 20)
    },
    /** Support for dropping images **/
    // Inspiration https://forum.vuejs.org/t/drop-files-to-drop-zone/3790
    onDrop: function (e) {
      var files = e.dataTransfer.files
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i])

        let app = this
        // https://github.com/busyorg/busy/blob/f722ab4d3b0df2ccfce8a5c3e9642b54a8257c69/src/client/components/Editor/withEditor.js#L34-L49
        fetch(`https://ipfs.busy.org/upload`, {method: 'POST', body: formData})
          .then(res => res.json())
          .then(res => app.addContent(app.toImageMarkdown(files[i].name, res.url)))
          .catch(err => toast.createDialog('error', 'Could not upload image: ' + err, 5000))
      }
    },
    toImageMarkdown: function (name, url) {
      return '![' + name + '](' + url + ')'
    },

    /** Actions on selected comment **/
    ignoreSelectedComment: function () {
      if (this.selectedComment) {
        this.$store.dispatch('markCommentProcessed', this.selectedComment.id)
        toast.createDialog('success', 'Comments ignored', 2000)
      }
    },
    /** Vote/Comment actions are added to spool for later execution **/
    voteSelectedComment: function () {
      if (this.selectedComment) {
        this.toVoteAction()
        this.$store.dispatch('markCommentProcessed', this.selectedComment.id)
      }
    },
    replyToSelectedComment: function () {
      if (this.selectedComment) {
        let body = this.reply
        if (body.length === 0) {
          toast.createDialog('error', 'Comment is empty', 1500)
        } else {
          this.toCommentAction(body)
          this.$store.dispatch('markCommentProcessed', this.selectedComment.id)
        }
      }
    },
    voteAndReplyToSelectedComment: function () {
      if (this.selectedComment) {
        let body = this.reply
        if (body.length === 0) {
          toast.createDialog('error', 'Comment is empty', 1500)
        } else {
          this.toVoteAction()
          if (this.vote > 0) {
            // If vote is defined, also vote on the comment
            this.toCommentAction(body)
          }
          this.$store.dispatch('markCommentProcessed', this.selectedComment.id)
        }
      }
    },

    /** Add pending actions - for Scheduler **/
    toVoteAction: function () {
      let vote = {
        type: 'vote',
        author: this.selectedComment.author,
        title: this.selectedComment.rootTitle,
        url: this.selectedComment.url,
        permlink: this.selectedComment.permlink,
        vote: this.vote,
        created: Date.now(),
        attempts: 0
      }
      this.$store.dispatch('addPendingAction', vote)
    },
    toCommentAction: function (body) {
      let comment = {
        type: 'comment',
        author: this.selectedComment.author,
        title: this.selectedComment.rootTitle,
        url: this.selectedComment.url,
        permlink: this.selectedComment.permlink,
        body: body,
        created: Date.now(),
        attempts: 0
      }
      this.$store.dispatch('addPendingAction', comment)
    }
  }
}
</script>

<style scoped>
#reply, #preview {
  height: 100%;
  max-height: initial;
  box-sizing: border-box;
}
</style>
