import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted)

export default {
  createDialog: function (type, data, timeout) {
    Vue.toasted[type](data, {
      position: 'bottom-right',
      duration: timeout,
      action: {
        text: 'Close',
        onClick: (e, toastObject) => {
          toastObject.goAway(0)
        }
      }
    })
  }
}
