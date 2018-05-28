<template>
  <div class="pending">
    <table class="table is-bordered is-hoverable is-narrow is-fullwidth is-striped">
      <thead>
      <tr>
        <th><abbr title="Position">#</abbr></th>
        <th>Type</th>
        <th>Author</th>
        <th>Article</th>
        <th>Date</th>
        <th><abbr title="# of attempts">Retry #</abbr></th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="action in pending" :key="pending.indexOf(action)">
        <th>{{ pending.indexOf(action) }}</th>
        <td>{{ action.type }} {{ action.type == 'vote' ? '(' + action.vote + '%)' : '' }}</td>
        <td>{{ action.author }}</td>
        <td><a :href="$options.filters.steemit(action.url)" target="_blank">{{ action.title }}</a></td>
        <td>{{ action.created | timestamp }}</td>
        <td>{{ action.attempts }}</td>
        <td class="center">
          <a @click.prevent="executePendingAction(action)" class="actionButton"><icon name="play" class="green" scale="0.8"></icon></a>
          <a @click.prevent="deletePendingAction(action)" class="actionButton"><icon name="window-close" class="red" scale="0.8"></icon></a>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Pending',
  data () {
    return {
      msg: 'Overview'
    }
  },
  computed: {
    pending () {
      return this.$store.getters.pending
    }
  },
  methods: {
    deletePendingAction: function (action) {
      this.$store.dispatch('deletePendingAction', action)
    },
    executePendingAction: function (action) {
      this.$store.dispatch('executePendingAction', action)
    }
  }
}
</script>

<style scoped>
.pending {
  margin: 20px;
  padding-top: 50px;
}
.center {
  text-align: center;
}
.actionButton {
  padding-left: 10px;
  padding-right: 10px;
  background: #eeeeee;
  border: 1px solid lightgray;
  horiz-align: center;
}
.actionButton:hover {
  background: #cccccc;
}
</style>
