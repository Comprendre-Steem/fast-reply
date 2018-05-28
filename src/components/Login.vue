<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <div class="box">
            <figure class="avatar">
              <img src="../assets/login/sc2.png">
            </figure>
            <form>
              <a class="button is-block is-info is-large" :href="this.$store.getters.steemconnect.api.getLoginURL()">Login</a>
            </form>
          </div>
          <p class="has-text-grey">
            <a href="https://steemit.com/pick_account">Steemit.com</a> &nbsp;·&nbsp;
            <a href="https://v2.steemconnect.com/accounts/create">SteemConnect</a> &nbsp;·&nbsp;
            <a href="https://anon.steem.network/">AnonSteem</a> &nbsp;·&nbsp;
            <a href="http://account.steem.vc/">SteemVC</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // msg: 'Welcome to Your Test Vue.js App'
    }
  }
}
</script>

<style scoped>

</style>
