export default {
  /**  SteemConnect v2 -- Helpers **/
  vote: function (api, me, author, permlink, weight) {
    return api.vote(me, author, permlink, weight * 100)
  },
  comment: function (api, me, author, permlink, body, created) {
    const signature = '<br/><div class="pull-right"><sub>' +
      '<a href="https://steemit.com/utopian-io/@roxane/fast-reply-v0-1-never-miss-to-answer-a-comment-again-and-do-it-faster-than-ever">' +
      'Sent with Fast-Reply</a></sub></div>'

    var includeSignature = false
    var commentBody = body
    if (includeSignature) {
      commentBody += signature
    }

    return api.comment(
      author,
      permlink,
      me,
      permlink + '-' + created,
      '',
      commentBody,
      {app: 'fast-reply', version: 0.2}
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
