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
/**  html,
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
  } */

  html,
  body {
    height: 100%;
  }

  body {
    width: 100%;
    overflow-x: hidden;
  }

  a,
  .btn-link,
  .page-link {
    color: #17a2b8;
  }

  a:hover,
  .btn-link:hover,
  .page-link:hover,
  a:focus,
  .btn-link:focus,
  .page-link:focus {
    color: #138496;
    text-decoration: none;
  }

  .btn,
  .btn-sm,
  .btn-lg,
  .form-control,
  .page-item:first-child .page-link,
  .page-item:last-child .page-link {
    border-radius: 0;
  }

  .modal-title {
    font-size: 1rem;
  }

  .modal-content {
    border-radius: 0;
  }

  .modal-body .profile-image {
    width: 56px;
    height: 56px;
    background-position: center center;
    background-size: cover;
  }

  .modal-body .user {
    line-height: 16px;
  }

  .modal-body .user .profile-link {
    text-decoration: none;
  }

  /* NAVBAR */
  .navbar-dark .navbar-nav .nav-link {
    position: relative;
    color: rgba(255, 255, 255, .9);
  }

  .navbar-dark .navbar-text {
    color: rgba(255, 255, 255, .9);
  }

  .badge-overlap {
    position: absolute;
    top: 0;
    right: 0;
    font-size: .7rem;
    padding: 3px 6px;
  }

  .main-menuitem:after {
    display: none;
  }

  /* CONTENT */

  #content {
    width: 200%;
    height: 100%;
    background: #eee;
    padding: 56px 0;
    transition: margin-left .3s ease;
  }

  #content.show-left {
    margin-left: 0;
  }

  #content.show-right {
    margin-left: -100%;
  }

  #list,
  #reply {
    width: 50%;
    height: 100%;
    float: left;
    overflow-y: auto;
  }

  #list .list-group-item {
    padding: 0;
  }

  #list .reply {
    position: relative;
  }

  #list .reply:focus {
    box-shadow: none;
  }

  #list .user {
    line-height: 16px;
  }

  #list .user .profile-link {
    text-decoration: none;
  }

  #list .comment-profile-image {
    width: 38px;
    height: 38px;
    background-position: center center;
    background-size: cover;
    float: left;
    margin-right: 5px;
  }

  #list .comment-footer .external-links {
    line-height: 38px;
  }

  #reply {
    background: #fff;
  }

  #reply .user {
    line-height: 16px;
  }

  #reply .user .profile-link {
    text-decoration: none;
  }

  #reply .comment-profile-image {
    width: 38px;
    height: 38px;
    background-position: center center;
    background-size: cover;
    float: left;
    margin-right: 5px;
  }

  .vote-weight {
    position: relative;
  }

  .vote-weight input {
    width: 80px;
    font-size: 1.2rem;
  }

  .vote-weight:after {
    content: '%';
    line-height: 42px;
    position: absolute;
    top: 0;
    right: 10px;
    color: #999;
  }

  .vote-controls {
    margin-top: 5px;
    padding: 4px 8px;
  }

  #reply .reply-form,
  #reply .vote-form {
    background: #fafafa;
  }

  @media (min-width: 768px) {
    #content {
      width: 100%;
    }

    #content.show-right {
      margin-left: 0;
    }

    #list {
      width: 50%;
    }

    #reply {
      width: 50%;
    }
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    #reply {
      border-left: solid 1px #eee;
    }
  }

  @media (min-width: 992px) {
    #list {
      width: 40%;
    }

    #reply {
      width: 60%;
    }
  }

  @media (min-width: 1199px) {
    #list .list-group-item {
      margin: 10px 10px 0;
      border: none;
    }

    #list .list-group-item:last-child {
      margin-bottom: 10px;
    }

    #reply .user {
      padding: 10px 1rem;
    }
  }

  @media (max-width: 575px) {
    .tooltip {
      display: none;
    }

    .nav-item.dropdown {
      position: static;
    }

    .nav-item .dropdown-menu {
      width: 100%;
      border: 0;
      border-radius: 0;
      margin-top: 0;
    }
  }


  /**  Steemit specific formatting classes
  https://steemit.com/steemit/@steemitblog/new-advanced-formatting-features
  **/
  .pull-left {
    float: left;
  }
  .pull-right {
    float: right;
  }
  .text-justify {
    text-align: justify;
    text-justify: inter-word;
  }
</style>
