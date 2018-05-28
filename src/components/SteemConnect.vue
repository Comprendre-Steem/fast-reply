<template>
  <div id="steemconnect"></div>
</template>

<script>
import Vue from 'vue'
import Storage from 'vue-ls'

Vue.use(Storage)

export default {
  name: 'SteemConnect',
  created () {
    // TODO log with multiple accounts ?

    // Parse URL to look after SC2 returned values
    let params = this.$route.query
    let accessToken = params['access_token']
    let username = params['username']
    let expiresIn = params['expires_in']

    if (accessToken != null && username != null && expiresIn != null) {
      let expiration = expiresIn * 1000 // expiration is in milliseconds
      Vue.ls.set('username', username, expiration)
      Vue.ls.set('access_token', accessToken, expiration)
      this.$store.dispatch('connect', accessToken)
    }
    this.$router.push('/')
  }
}
</script>
