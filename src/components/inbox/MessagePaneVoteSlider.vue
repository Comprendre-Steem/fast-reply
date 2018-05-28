<template>
  <div class="field">
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
    // TODO regroup change vote methods
    setVote (value) {
      this.$store.dispatch('config', {key: 'vote', value: value})
    },
    changeVote (event) {
      this.$store.dispatch('config', {key: 'vote', value: event.target.value})
    }
  }
}
</script>

<style scoped>

</style>
