// Styles
import '../../stylus/components/_selection-controls.styl'

// Components
import VIcon from '../VIcon'
// import { VFadeTransition } from '../transitions'

// Mixins
import Selectable from '../../mixins/lq-selectable'
import { lqElementMixin, lqPermissionMixin } from 'lq-form'
// import helper from 'vuejs-object-helper'

/* @vue/component */
export default {
  name: 'lq-v-checkbox',

  mixins: [
    Selectable,
    lqElementMixin,
    lqPermissionMixin
  ],

  props: {
    indeterminate: Boolean,
    indeterminateIcon: {
      type: String,
      default: '$vuetify.icons.checkboxIndeterminate'
    },
    onIcon: {
      type: String,
      default: '$vuetify.icons.checkboxOn'
    },
    offIcon: {
      type: String,
      default: '$vuetify.icons.checkboxOff'
    }
  },

  data: vm => ({
    inputIndeterminate: vm.indeterminate
  }),

  computed: {
    classes () {
      return {
        'v-input--selection-controls': true,
        'v-input--checkbox': true
      }
    },
    computedIcon () {
      if (this.inputIndeterminate) {
        return this.indeterminateIcon
      } else if (this.isActive) {
        return this.onIcon
      } else {
        return this.offIcon
      }
    }
  },

  watch: {
    indeterminate (val) {
      this.inputIndeterminate = val
    }
  },

  methods: {
    genCheckbox () {
      return this.$createElement('div', {
        staticClass: 'v-input--selection-controls__input'
      }, [
        this.genInput('checkbox', {
          ...this.$attrs,
          'aria-checked': this.inputIndeterminate
            ? 'mixed'
            : this.isActive.toString()
        }),
        this.genRipple(this.setTextColor(this.computedColor)),
        this.$createElement(VIcon, this.setTextColor(this.computedColor, {
          props: {
            dark: this.dark,
            light: this.light
          }
        }), this.computedIcon)
      ])
    },
    genDefaultSlot () {
      return [
        this.genCheckbox(),
        this.genLabel()
      ]
    }
  }
}
