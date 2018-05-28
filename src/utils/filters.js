// https://stackoverflow.com/a/45054257/957103

import Vue from 'vue'
import showdown from 'showdown'

Vue.filter('truncate', function (value, length) {
  // Remove words making a string larger than a given size
  if (!value) return ''
  if (value.length <= length) return value

  // https://stackoverflow.com/a/33379772/957103
  function truncateOnWord (str, limit) {
    var trimmable = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF'
    var reg = new RegExp('(?=[' + trimmable + '])')
    var words = str.split(reg)
    var count = 0
    return words.filter(function (word) {
      count += word.length
      return count <= limit
    }).join('')
  }

  return truncateOnWord(value, length) + ' [...]'
})

Vue.filter('markdownToHTML', function (value) {
  // TODO: check if content is indeed markdown (via API)
  // Transform Markdown markup into HTML
  // ShowDownJS: https://github.com/showdownjs/showdown
  return new showdown.Converter({
    tables: true,
    tablesHeaderId: true,
    ghMentions: true,
    ghMentionsLink: 'https://steemit.com/@{u}',
    strikethrough: true,
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    smoothLivePreview: true,
    disableForced4SpacesIndentedSublists: true,
    simpleLineBreaks: true
  }).makeHtml(value)
})

Vue.filter('date', function (date) {
  // Format date from UTC to locale Date
  return new Date(Date.parse(date)).toLocaleDateString()
})

Vue.filter('timestamp', function (timestamp) {
  // Format timestamp from UTC to locale Date
  let ts = new Date(timestamp)
  return ts.toLocaleDateString() + ' @ ' + ts.toLocaleTimeString()
})

Vue.filter('steemit', function (path) {
  return 'https://www.steemit.com' + path
})

Vue.filter('busy', function (path) {
  return 'https://www.busy.org' + path
})

Vue.filter('profile', function (username, platform) {
  // Creation d'un lien vers le profile d'un utilisateur
  switch (platform) {
    case 'busy' :
      return 'https://www.busy.org/@' + username
    default :
      return 'https://www.steemit.com/@' + username
  }
})

Vue.filter('avatar', function (username) {
  // Creation d'un lien vers l'avatar (image) steem d'un utilisateur // Thanks to Busy
  return 'http://img.busy.org/@' + username
})
