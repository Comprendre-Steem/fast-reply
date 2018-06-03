export default {
  /**  SteemConnect v2 -- Helpers **/
  vote: function (api, me, author, permlink, weight) {
    return api.vote(me, author, permlink, weight * 100)
  },
  comment: function (api, me, author, permlink, body, created) {
    return api.comment(
      author,
      permlink,
      me,
      permlink + '-' + created,
      '',
      body,
      {app: 'fast-reply', version: 0.3}
    )
  },
  follow: function (api, me, username) {
    return api.follow(me, username)
  },
  unfollow: function (api, me, username) {
    return api.unfollow(me, username)
  },
  ignore: function (api, me, username) {
    return api.ignore(me, username)
  },
  share: function (api, me, author, permlink) {
    return api.reblog(me, author, permlink)
  }
}
