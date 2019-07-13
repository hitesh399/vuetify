// Styles
import '../../stylus/components/_radios.styl'

// Components
import VIcon from '../VIcon'
// import VLabel from '../VLabel'

// Mixins
import Colorable from '../../mixins/colorable'
import Rippleable from '../../mixins/rippleable'
import Themeable from '../../mixins/themeable'
import Selectable from '../../mixins/lq-selectable'
import {
  inject as RegistrableInject
} from '../../mixins/registrable'
import { lqElementMixin, lqPermissionMixin } from 'lq-form'
// import helper from 'vuejs-object-helper'
import VMessages from '../VMessages'

/* @vue/component */
export default {
  name: 'lq-v-radio',

  mixins: [
    Colorable,
    Rippleable,
    RegistrableInject('radio'),
    Themeable,
    lqElementMixin,
    lqPermissionMixin,
    Selectable
  ],

  inheritAttrs: false,

  props: {
    color: {
      type: String,
      default: 'accent'
    },
    disabled: Boolean,
    label: String,
    onIcon: {
      type: String,
      default: '$vuetify.icons.radioOn'
    },
    offIcon: {
      type: String,
      default: '$vuetify.icons.radioOff'
    },
    readonly: Boolean,
    value: null
  },

  data: () => ({
    // isActive: false,
    isFocused: false,
    parentError: false
  }),

  computed: {
    computedData () {
      return this.setTextColor(!this.parentError && this.isActive && this.color, {
        staticClass: 'v-radio',
        'class': {
          'v-radio--is-disabled': this.isDisabled,
          'v-radio--is-focused': this.isFocused,
          ...this.themeClasses
        }
      })
    },
    computedColor () {
      return this.isActive ? this.color : this.validationState || false
    },
    computedIcon () {
      return this.isActive
        ? this.onIcon
        : this.offIcon
    },
    hasState () {
      return this.isActive || !!this.validationState
    },
    isDisabled () {
      return this.disabled
    },
    isReadonly () {
      return this.readonly
    }
  },

  mounted () {
    // this.radio.register(this)
  },

  beforeDestroy () {
    // this.radio.unregister(this)
  },

  methods: {
    // genInput (...args) {
    //   // We can't actually use the mixin directly because
    //   // it's made for standalone components, but its
    //   // genInput method is exactly what we need
    //   return Selectable.options.methods.genInput.call(this, ...args)
    // },
    // genLabel () {
    //   return this.$createElement(VLabel, {
    //     on: { click: this.onChange },
    //     attrs: {
    //       for: `${this.formName}.${this.id}.${this.idIndex}`
    //     },
    //     props: {
    //       color: this.validationState || '',
    //       dark: this.dark,
    //       focused: this.hasState,
    //       light: this.light,
    //       value: this.isActive
    //     }
    //   }, this.$slots.label || this.label)
    // },
    genRadio () {
      return this.$createElement('div', {
        staticClass: 'v-input--selection-controls__input'
      }, [
        this.genInput('radio', {
          name: this.name || (this._uid ? 'v-radio-' + this._uid : false),
          ...this.$attrs,
          value: this.value,
          id: this.id
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
    onFocus (e) {
      this.isFocused = true
      this.emitNativeEvent(e)
      if (!this.touch) {
        this.touchStatus(true)
      }
    },
    onBlur (e) {
      this.isFocused = false
      this.emitNativeEvent(e)
    },
    onChange () {
      if (this.isDisabled || this.isReadonly) return
      if (!this.touch) {
        this.touchStatus(true)
      }
      if (!this.isDisabled && (!this.isActive || !this.mandatory)) {
        // this.internalValue = this.value
        this.setValue(this.value)
      }
    },
    onKeydown (e) {
      this.emitNativeEvent(e)
    },
    genMessages () {
      if (this.hideDetails) return null
      const messages = this.hasHint
        ? [this.hint]
        : this.validations
      return this.$createElement(VMessages, {
        props: {
          color: this.hasHint ? '' : this.validationState,
          dark: this.dark,
          light: this.light,
          value: (this.hasMessages || this.hasHint) ? messages : []
        }
      })
    }
  },

  render (h) {
    return h('div', this.computedData, [
      this.genRadio(),
      this.genLabel(),
      this.genMessages()
    ])
  }
}
