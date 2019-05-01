// Mixins
import Colorable from './colorable'
import { inject as RegistrableInject } from './registrable'

// Utilities
import mixins from '../util/mixins'

// Types
import { PropValidator } from 'vue/types/options'
export type VuetifyRuleValidator = (value: any) => string | false
export type VuetifyMessage = string | string[]
export type VuetifyRuleValidations = (VuetifyRuleValidator | string)[]

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
    } as PropValidator<VuetifyMessage>,
    messages: {
      type: [String, Array],
      default: () => []
    } as PropValidator<VuetifyMessage>,
    readonly: Boolean,
    success: Boolean,
    successMessages: {
      type: [String, Array],
      default: () => []
    } as PropValidator<VuetifyMessage>,
    validateOnBlur: Boolean
  },

  data () {
    return {
      errorBucket: [] as string[],
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
    hasError (): boolean {
      return (
        this.internalErrorMessages.length > 0 ||
        this.errorBucket.length > 0 ||
        this.error
      )
    },
    // TODO: Add logic that allows the user to enable based
    // upon a good validation
    hasSuccess (): boolean {
      return (
        this.internalSuccessMessages.length > 0 ||
        this.success
      )
    },
    externalError (): boolean {
      return this.internalErrorMessages.length > 0 || this.error
    },
    hasMessages (): boolean {
      return this.validationTarget.length > 0
    },
    hasState (): boolean {
      return (
        this.hasSuccess ||
        (this.shouldValidate && this.hasError)
      )
    },
    internalValue: {
      get (): unknown {
        return this.lazyValue
      },
      set (val: any) {
        this.lazyValue = val

        this.$emit('input', val)
      }
    },
    shouldValidate (): boolean {
      if (this.externalError) return true
      if (this.isResetting) return false

      return this.validateOnBlur
        ? this.hasFocused && !this.isFocused
        : (this.hasInput || this.hasFocused)
    },
    validationState (): string | undefined {
      if (this.hasError && this.shouldValidate) return 'error'
      if (this.hasSuccess) return 'success'
      if (this.hasColor) return this.color
      return undefined
    },
    validationTarget (): VuetifyRuleValidations {
      if (this.internalErrorMessages.length > 0) {
        return this.internalErrorMessages
      } else if (this.successMessages.length > 0) {
        return this.internalSuccessMessages
      } else if (this.messages.length > 0) {
        return this.internalMessages
      } else if (this.shouldValidate) {
        return this.errorBucket
      } else return []
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
