// Styles
import '../../stylus/components/_forms.styl'
import { lqFormMixin } from 'lq-form'
/* @vue/component */
export default {
  name: 'lq-v-form',
  mixins: [lqFormMixin],

  inheritAttrs: false,
  data () {
    return {
      inputs: [],
      watchers: [],
      errorBag: {}
    }
  },
  render (h) {
    return h('form', {
      staticClass: 'v-form lq-v-form',
      attrs: Object.assign({
        novalidate: true
      }, this.$attrs),
      on: {
        submit: e => { e.preventDefault(); this.submit() }
      }
    }, this.$slots.default)
  }
}
