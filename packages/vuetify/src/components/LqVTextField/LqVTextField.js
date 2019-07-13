import VTextField from '../VTextField/VTextField'
import lqValidate from '../../mixins/lq-validatable'

import { lqElementMixin, lqPermissionMixin } from 'lq-form'

export default VTextField.extend({
  name: 'lq-v-text-field',
  mixins: [lqElementMixin, lqPermissionMixin, lqValidate],
  props: {
    customMask: Function
  },
  computed: {
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        if (this.mask && val !== this.lazyValue) {
          this.lazyValue = this.unmaskText(this.maskText(this.unmaskText(val)))
          this.setValue(this.lazyValue)
          this.setSelectionRange()
        } else {
          this.lazyValue = val
          this.setValue(this.lazyValue)
          this.$emit('input', this.lazyValue)
        }
      }
    }
  },
  watch: {
    value (val) {
      if (this.mask && !this.internalChange) {
        const masked = this.maskText(this.unmaskText(val))
        this.lazyValue = this.unmaskText(masked)
        this.setValue(this.lazyValue)
        // Emit when the externally set value was modified internally
        String(val) !== this.lazyValue && this.$nextTick(() => {
          this.$refs.input.value = masked
          this.$emit('input', this.lazyValue)
        })
      } else {
        this.lazyValue = val
        this.setValue(this.lazyValue)
      }
    }
  },
  created () {
    if (this.value) {
      this.lazyValue = this.value
      this.setValue(this.lazyValue)
    }
  },
  methods: {
    clearableCallback () {
      if (!this.touch) {
        this.touchStatus(true)
      }
      this.internalValue = null
      this.$nextTick(() => this.$refs.input.focus())
    },
    genInput () {
      const listeners = Object.assign({}, this.$listeners)
      delete listeners['change'] // Change should not be bound externally
      const data = {
        style: {},
        domProps: {
          value: this.customMask ? this.customMask(this.lazyValue) : this.maskText(this.lazyValue)
        },
        attrs: {
          'aria-label': (!this.$attrs || !this.$attrs.id) && this.label, // Label `for` will be set if we have an id
          ...this.$attrs,
          autofocus: this.autofocus,
          disabled: this.disabled,
          readonly: this.readonly,
          type: this.type,
          name: this.name,
          id: `${this.lqForm.name}_${this.id}`
        },
        on: Object.assign(listeners, {
          blur: this.onBlur,
          input: this.onInput,
          focus: this.onFocus,
          keydown: this.onKeyDown
        }),
        ref: 'input'
      }
      if (this.placeholder) data.attrs.placeholder = this.placeholder
      if (this.mask) data.attrs.maxlength = this.masked.length
      if (this.browserAutocomplete) data.attrs.autocomplete = this.browserAutocomplete
      return this.$createElement('input', data)
    },
    onBlur (e) {
      this.isFocused = false
      // Reset internalChange state
      // to allow external change
      // to persist
      this.internalChange = false
      this.emitNativeEvent(e)
    },
    onClick (e) {
      if (this.isFocused || this.disabled) return

      this.$refs.input.focus()
      this.emitNativeEvent(e)
    },
    onFocus (e) {
      if (!this.$refs.input) return

      if (document.activeElement !== this.$refs.input) {
        return this.$refs.input.focus()
      }

      if (!this.isFocused) {
        this.isFocused = true
        this.emitNativeEvent(e)
      }
    }
  }
})
