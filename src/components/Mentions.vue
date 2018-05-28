<template>
  <div class="mentions">
    <table class="table is-bordered is-hoverable is-narrow is-fullwidth is-striped">
      <thead>
      <tr>
        <th><abbr title="Position">#</abbr></th>
        <th>Author</th>
        <th>Article</th>
        <th>Category</th>
        <th>Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="mention in mentions" :key="mentions.indexOf(mention)">
        <th>{{ mentions.indexOf(mention) }}</th>
        <td>{{ mention.author }}</td>
        <td><a :href="$options.filters.steemit(mention.permlink)" target="_blank">{{ mention.title }}</a></td>
        <td><a :href="'https://steemit.com/created/'+mention.category" target="_blank">{{ mention.category }}</a></td>
        <td>{{ mention.created | date }}</td>
      </tr>
      </tbody>
    </table>

    <div class="center" v-if="loading">
      <icon name="circle-notch" scale="5" spin></icon>
    </div>

  </div>
</template>

<script>
export default {
  name: 'mentions',
  data: function () {
    return {
      loading: true,
      data: []
    }
  },
  mounted () {
    this.$http.get('http://api.comprendre-steem.fr/getMentions?username=' + this.user.name)
      .then(res => {
        this.data = res.data.mentions
        this.loading = false
      })
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    mentions () {
      return this.data
    }
  }
}
</script>

<style scoped>
.mentions {
  margin: 20px;
  padding-top: 50px;
}
.center {
  text-align: center;
}
</style>
