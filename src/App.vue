<template>
  <div id="app">
    <Menu></Menu>
    <div v-if="this.$router.currentRoute.name == 'SteemConnect' || this.$store.getters.user">
      <Router></Router>
    </div>
    <div v-else>
      <Login></Login>
    </div>
  </div>
</template>

<script>
import Menu from './components/Menu'
import Router from './components/Router'
import Login from './components/Login'

export default {
  name: 'App',
  components: { Menu, Router, Login }
}
</script>

<style>
  html,
  body {
    font-size: 14px;
    line-height: 1.5;
    height: 100%;
    background-color: #fff;
    font-weight: 300;
  }

  hr {
    margin: 40px 0;
  }

  .hero.is-success {
    background: white;
  }
  .hero .nav, .hero.is-success .nav {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .box {
    margin-top: 5rem;
  }
  .avatar {
    margin-top: -70px;
    padding-bottom: 20px;
  }
  .avatar img {
    padding: 5px;
    background: #fff;
    border-radius: 50%;
    -webkit-box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  }
  input {
    font-weight: 300;
  }
  p {
    font-weight: 100;
  }
  p.subtitle {
    padding-top: 1rem;
  }

  #app {
    max-height: 100vh;
  }

  .low-reputation {
    background: lightyellow;
  }

  #message-feed, #message-pane {
    padding-top: 90px;
    overflow-y: scroll;
    max-height: 100vh;
  }

  .messages {
    display: block;
    background-color: #fff;
    border-right: 1px solid #DEDEDE;
    padding: 40px 20px 0px 20px;
  }

  .message {
    display: block;
    background-color: #fff;
    padding: 40px 20px;
  }

  .inbox-messages {
    margin-top: 0px;
    /* was 60px */
  }

  .inbox-messages a {
    color: #5D5D5D;
  }

  .red {
    color: red;
  }

  .green {
    color: green;
  }

  .inbox-messages .active {
    background-color: lightblue;
  }

  .active .low-reputation {
    background-color: lightcoral;
  }

  .inbox-messages .card {
    width: 100%;
  }

  .inbox-messages .msg-check {
    padding: 0 20px;
  }

  .inbox-messages .msg-subject {
    padding: 10px 0;
  }

  .float-right {
    float: right;
  }

  .inbox-messages .msg-snippet {
    padding: 5px 20px 0px 5px;
  }

  .inbox-messages .msg-subject .fa {
    font-size: 14px;
    padding: 3px 0;
  }

  .inbox-messages .msg-timestamp {
    float: right;
    padding: 0 20px;
    color: #5d5d5d;
  }

  .message-preview {
    margin-top: 0px;
    /* was 60px */
  }

  .message-preview .avatar {
    display: inline-block;
  }

  .message-preview .top .address {
    display: inline-block;
    padding: 0 20px;
  }

  .message-preview .top .address a {
    color: #5D5D5D;
  }

  .avatar img {
    max-width: 120px;
    max-height: 80px;
    border-radius: 50px;
    border: 2px solid #999;
    padding: 2px;
  }

  .control .is-grouped .button {
    background-image: none;
  }

  /* ---- Hover ---- */

  button:hover {
    opacity:0.7;
  }

  .steem-username {
    font-size: small;
    font-weight: 700;
    text-decoration: none;
  }

  a.action.ripple {
    color: white;
  }
</style>
