<template>
  <div class="field" v-shortkey.prevent="{prev: ['home'], next: ['end'], minus10: ['shift', 'home'], plus10: ['shift', 'end']}" @shortkey="changeVoteHotkey">
    <label class="label">Your Vote ({{ vote }}%)</label>
    <div class="control">
      <input id="vote-slider" class="slider is-fullwidth is-large" :class="[vote >= 0 ? 'is-info': 'is-danger']" step="1" min="-100" max="100" :value="vote" @change.prevent="changeVote" type="range">
      <div class="buttons has-addons is-centered">
        <span v-for="votePercent in voteQuickSelector" :key="votePercent" class="button is-large" :class="{'is-selected': (vote == votePercent),'is-info': (vote == votePercent)}" @click.prevent="setVote(votePercent)">
          {{votePercent}}%
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import HotKeys from 'vue-shortkey'

Vue.use(HotKeys)

export default {
  name: 'message-pane-vote-slider',
  computed: {
    vote () {
      return this.$store.getters.config.vote
    },
    voteQuickSelector () {
      return [0.5, 1, 5, 10, 25, 50, 75, 100]
    }
  },
  methods: {
    setVote (value) {
      this.$store.dispatch('config', {key: 'vote', value: value})
    },
    changeVote (event) {
      this.setVote(event.target.value)
    },
    changeVoteHotkey (event) {
      switch (event.srcKey) {
        case 'prev':
          let prev = this.voteQuickSelector.filter(value => value < this.vote).pop()
          if (prev) {
            this.setVote(prev)
          }
          break
        case 'next':
          let next = this.voteQuickSelector.filter(value => value > this.vote).shift()
          if (next) {
            this.setVote(next)
          }
          break
        case 'minus10':
          this.setVote(Math.max(this.vote - 10, -100))
          break
        case 'plus10':
          this.setVote(Math.min(this.vote + 10, 100))
          break
      }
    }
  }
}
</script>

<style scoped>

</style>
