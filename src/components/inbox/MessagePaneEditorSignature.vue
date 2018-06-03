<template>
  <div>
    <div id="signature" v-show="!editing" @click.prevent="toggleEdit" v-html="$options.filters.markdownToHTML(signature + editButton)"></div>
    <textarea
      id="editSignature"
      v-show="editing"
      type="text"
      style="width:100%; height: 2rem"
      :value="signature"
      placeholder="Enter your custom signature here..."
      @keydown.enter.prevent="$emit('signature', $event.target.value); editing=false">
    </textarea>
  </div>
</template>

<script>
export default {
  name: 'message-pane-editor-signature',
  data () {
    return {
      editButton: '&nbsp;✏',
      editing: false
    }
  },
  computed: {
    signature () {
      return this.$store.getters.config.signature
    }
  },
  methods: {
    toggleEdit: function () {
      this.editing = true
      setTimeout(function () {
        // see https://stackoverflow.com/a/12142227/957103
        document.getElementById('editSignature').focus()
      }, 0)
    }
  }
}
</script>

<style scoped>

</style>
