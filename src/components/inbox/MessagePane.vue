<template>
  <div class="column is-8 message hero is-fullheight" id="message-pane" v-show="selectedComment">
    <MessagePanePreview></MessagePanePreview>
    <div id="message-reply" class="control" @drop.prevent="onDrop" @dragover.prevent>
      <MessagePaneVoteSlider></MessagePaneVoteSlider>
      <div class="field">
        <label class="label">
          Your Fast Reply (
          <a @click="tooglePreview"
             v-shortkey.prevent="['ctrl', '@']" @shortkey="tooglePreview"
             v-tooltip.top="'CTRL+@'">
            Preview
          </a>
          )
        </label>
        <div class="control columns">
          <div class="column" :class="[preview ? 'is-6' : 'is-12']">
            <textarea
              id="reply"
              class="textarea reply"
              type="text"
              v-model="reply"
              placeholder="Reply here..."
              v-shortkey.focus="['alt', 'esc']">
            </textarea>
            <MessagePaneEditorSignature @signature="changeSignature"></MessagePaneEditorSignature>
          </div>
          <div id="preview" v-if="preview" class="column is-6" v-html="$options.filters.markdownToHTML(reply + signature)">
          </div>
        </div>
        <br style="clear:both" />
      </div>
      <div class="buttons has-addons is-grouped is-centered">
        <span v-for="(emoji, index) in emojiQuickSelector" :key="emoji"
              class="button is-large"
              @click.prevent="addContent(emoji)"
              v-shortkey.prevent="['alt', 'f' + (index +1)]" @shortkey="addContent(emoji)"
              v-tooltip.bottom="'ALT+F'+(index+1)">
          {{ emoji }}
        </span>
      </div>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <button id="replyButton"
                  class="button is-large is-link is-rounded"
                  @click.prevent="replyToSelectedComment"
                  v-shortkey.prevent="['ctrl', 'f9']" @shortkey="replyToSelectedComment"
                  v-tooltip.bottom="'CTRL+F9'">
            Reply
          </button>
        </div>
        <div class="control">
          <button id="voteAndReplyButton"
                  class="button is-large is-success is-rounded"
                  @click.prevent="voteAndReplyToSelectedComment"
                  v-shortkey.prevent="['ctrl', 'f10']" @shortkey="voteAndReplyToSelectedComment"
                  v-tooltip.bottom="'CTRL+F10'">
            Vote and Reply
          </button>
        </div>
        <div class="control">
          <button id="voteButton"
                  class="button is-large is-warning is-rounded"
                  @click.prevent="voteSelectedComment"
                  v-shortkey.prevent="['ctrl', 'f11']" @shortkey="voteSelectedComment"
                  v-tooltip.bottom="'CTRL+F11'">
            Vote
          </button>
        </div>
        <div class="control">
          <button id="ignoreButton"
                  class="button is-large is-danger is-rounded"
                  @click.prevent="ignoreSelectedComment"
                  v-shortkey.prevent="['ctrl', 'f12']" @shortkey="ignoreSelectedComment"
                  v-tooltip.bottom="'CTRL-F12'">
            Ignore
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import HotKeys from 'vue-shortkey'
import VTooltip from 'v-tooltip'

import toast from '@/utils/toast.js'
import MessagePanePreview from '@/components/inbox/MessagePanePreview'
import MessagePaneVoteSlider from '@/components/inbox/MessagePaneVoteSlider'
import MessagePaneEditorSignature from '@/components/inbox/MessagePaneEditorSignature'

Vue.use(HotKeys)
Vue.use(VTooltip)

export default {
  name: 'message-pane',
  components: { MessagePanePreview, MessagePaneVoteSlider, MessagePaneEditorSignature },
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
      return ['👍', '😀', '😘', '😍', '😆', '😎', '😅', '😂', '😱', '🙏', '😭', '❤️']
    },
    signature () {
      return this.$store.getters.config.signature
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
    tooglePreview: function () {
      console.log('toggle preview panel')
      this.preview = !this.preview
    },
    changeSignature: function (signature) {
      this.$store.dispatch('config', {key: 'signature', value: signature})
      document.getElementById('reply').focus()
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
        body: body + this.signature,
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
