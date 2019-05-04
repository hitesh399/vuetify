// Mixins
import Colorable from './colorable'
import { inject as RegistrableInject } from './registrable'
// Utilities
import mixins from '../util/mixins'

/* @vue/component */
export default mixins(
  Colorable,
  RegistrableInject('form')
).extend({
  name: 'lq-validatable',

  props: {
    disabled: Boolean,
    errorCount: {
      type: [Number, String],
      default: 1
    },
    errorMessages: {
      type: [String, Array],
      default: () => []
    },
    readonly: Boolean
  },

  data () {
    return {
      hasColor: false,
      hasFocused: false,
      hasInput: false,
      isFocused: false,
      isResetting: false,
      lazyValue: this.value,
      valid: false
    }
  },

  computed: {
    hasError () {
      return this.error && this.error.length > 0
    },
    // TODO: Add logic that allows the user to enable based
    // upon a good validation
    hasSuccess () {
      return !this.hasError && this.field.touch
    },
    hasState () {
      return (
        this.hasSuccess ||
        (this.shouldValidate && this.hasError)
      )
    },
    shouldValidate () {
      if (this.hasError) return true
      if (this.isResetting) return false

      return this.validateOnBlur
        ? this.hasFocused && !this.isFocused
        : (this.hasInput || this.hasFocused)
    },
    validations () {
      return this.validationTarget.slice(0, Number(this.errorCount))
    },
    validationState () {
      if (this.hasError && this.shouldValidate) return 'error'
      if (this.hasSuccess) return 'success'
      if (this.hasColor) return this.color
      return undefined
    },
    hasMessages () {
      return this.validationTarget.length > 0
    },
    validationTarget () {
      return this.error ? this.error : []
    }
  },
  watch: {
    isFocused (val) {
      // Should not check validation
      // if disabled or readonly
      if (
        !val &&
        !this.disabled &&
        !this.readonly
      ) {
        this.hasFocused = true
        this.validateOnBlur && this.validate()
      }
    },
    hasError (val) {
      if (this.shouldValidate) {
        this.$emit('update:error', val)
      }
    },
    value (val) {
      this.lazyValue = val
    }
  }
})
