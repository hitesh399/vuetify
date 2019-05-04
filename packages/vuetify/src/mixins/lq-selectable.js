// Components
import VInput from '../components/LqVInput'

// Mixins
import Rippleable from './rippleable'
import Comparable from './comparable'
/* @vue/component */
export default VInput.extend({
  name: 'lq-selectable',

  mixins: [Rippleable, Comparable],

  model: {
    prop: 'inputValue',
    event: 'change'
  },

  props: {
    color: {
      type: String,
      default: 'accent'
    },
    id: String,
    idIndex: [Number, String],
    inputValue: null,
    falseValue: null,
    trueValue: null,
    multiple: {
      type: Boolean,
      default: null
    },
    label: String,
    val: [String, Number]
  },

  data: vm => ({
    lazyValue: vm.inputValue
  }),

  computed: {
    computedColor () {
      return this.isActive ? this.color : this.validationState
    },
    isMultiple () {
      return this.multiple === true || (this.multiple === null && Array.isArray(this.internalValue))
    },
    isActive () {
      const value = this.val
      const input = this.internalValue
      if (this.isMultiple) {
        if (!Array.isArray(input)) return false

        return input.some(item => this.valueComparator(item, value))
      }

      if (this.trueValue === undefined || this.falseValue === undefined) {
        return value
          ? this.valueComparator(value, input)
          : Boolean(input)
      }

      return this.valueComparator(input, this.trueValue)
    },
    isDirty () {
      return this.isActive
    }
  },

  watch: {
    inputValue (val) {
      this.lazyValue = val
    }
  },

  methods: {
    genLabel () {
      if (!this.hasLabel) return null
      const label = VInput.options.methods.genLabel.call(this)
      label.data.on = { click: this.onChange }

      return label
    },
    genInput (type, attrs) {
      return this.$createElement('input', {
        attrs: Object.assign({
          'aria-label': this.label,
          'aria-checked': this.isActive.toString(),
          disabled: this.isDisabled,
          id: this.id,
          role: type,
          type
        }, attrs, { id: `${this.formName}.${this.id}.${this.idIndex}` }),
        domProps: {
          value: this.value,
          checked: this.isActive
        },
        on: {
          blur: this.onBlur,
          change: this.onChange,
          focus: this.onFocus,
          keydown: this.onKeydown
        },
        ref: 'input'
      })
    },
    onBlur (e) {
      this.isFocused = false
      this.emitNativeEvent(e)
    },
    onChange () {
      if (this.isDisabled) return

      const value = this.val
      let input = this.internalValue

      if (this.isMultiple) {
        if (!Array.isArray(input)) {
          input = []
        }

        const length = input.length

        input = input.filter(item => !this.valueComparator(item, value))

        if (input.length === length) {
          input.push(value)
        }
      } else if (this.trueValue !== undefined && this.falseValue !== undefined) {
        input = this.valueComparator(input, this.trueValue) ? this.falseValue : this.trueValue
      } else if (value) {
        input = this.valueComparator(input, value) ? null : value
      } else {
        input = !input
      }
      this.internalValue = input
      this.setValue(this.internalValue)
    },
    onFocus (e) {
      this.isFocused = true
      this.emitNativeEvent(e)
    },
    /** @abstract */
    onKeydown (e) {
      this.emitNativeEvent(e)
    }
  }
})
