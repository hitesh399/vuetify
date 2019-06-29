// Styles
import '../../stylus/components/_rating.styl'

// Components
import VIcon from '../VIcon'

// Mixins
import Colorable from '../../mixins/colorable'
import Delayable from '../../mixins/delayable'
import Sizeable from '../../mixins/sizeable'
import Rippleable from '../../mixins/rippleable'
import Themeable from '../../mixins/themeable'

// Utilities
import { createRange } from '../../util/helpers'
import mixins from '../../util/mixins'
import { lqElementMixin, lqPermissionMixin } from 'lq-form'
import helper from 'vuejs-object-helper'
import Validatable from '../../mixins/lq-validatable'
import VMessages from '../VMessages'
// Types
import { VNode, VNodeDirective, VNodeChildren } from 'vue'

type ItemSlotProps = {
  index: number
  value: number
  isFilled: boolean
  isHalfFilled?: boolean | undefined
  isHovered: boolean
  isHalfHovered?: boolean | undefined
  click: Function
}

/* @vue/component */
export default mixins(
  Colorable,
  Delayable,
  Rippleable,
  Sizeable,
  Themeable,
  lqElementMixin,
  lqPermissionMixin,
  Validatable
).extend({
  name: 'lq-v-rating',

  props: {
    backgroundColor: {
      type: String,
      default: 'accent'
    },
    color: {
      type: String,
      default: 'primary'
    },
    dense: Boolean,
    emptyIcon: {
      type: String,
      default: '$vuetify.icons.ratingEmpty'
    },
    fullIcon: {
      type: String,
      default: '$vuetify.icons.ratingFull'
    },
    halfIcon: {
      type: String,
      default: '$vuetify.icons.ratingHalf'
    },
    halfIncrements: Boolean,
    length: {
      type: [Number, String],
      default: 5
    },
    clearable: Boolean,
    readonly: Boolean,
    hover: Boolean,
    value: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      hoverIndex: -1
    }
  },

  computed: {
    internalValue: {
      get () {
        return helper.getProp(this.$store.state.form, `${this.formName}.values.${this.id}`)
      },
      set (value: any) {
        this.setValue(value)
      }
    },
    directives (): VNodeDirective[] {
      if (this.readonly || !this.ripple) return []

      return [{
        name: 'ripple',
        value: { circle: true }
      } as VNodeDirective]
    },
    iconProps (): object {
      const {
        dark,
        medium,
        large,
        light,
        small,
        size,
        xLarge
      } = this.$props

      return {
        dark,
        medium,
        large,
        light,
        size,
        small,
        xLarge
      }
    },
    isHovering (): boolean {
      return this.hover && this.hoverIndex >= 0
    }
  },

  watch: {
    value (val) {
      this.internalValue = val
    }
  },
  created () {
    if (this.value) {
      this.internalValue = this.value
    }
  },
  methods: {
    createClickFn (i: number): Function {
      return (e: MouseEvent) => {
        if (this.readonly) return

        const newValue = this.genHoverIndex(e, i)
        if (this.clearable && this.internalValue === newValue) {
          this.internalValue = 0
        } else {
          this.internalValue = newValue
        }
      }
    },
    createProps (i: number): ItemSlotProps {
      const props: ItemSlotProps = {
        index: i,
        value: this.internalValue,
        click: this.createClickFn(i),
        isFilled: Math.floor(this.internalValue) > i,
        isHovered: Math.floor(this.hoverIndex) > i
      }

      if (this.halfIncrements) {
        props.isHalfHovered = !props.isHovered && (this.hoverIndex - i) % 1 > 0
        props.isHalfFilled = !props.isFilled && (this.internalValue - i) % 1 > 0
      }

      return props
    },
    genHoverIndex (e: MouseEvent, i: number) {
      return i + (this.isHalfEvent(e) ? 0.5 : 1)
    },
    getIconName (props: ItemSlotProps): string {
      const isFull = this.isHovering ? props.isHovered : props.isFilled
      const isHalf = this.isHovering ? props.isHalfHovered : props.isHalfFilled

      return isFull ? this.fullIcon : isHalf ? this.halfIcon : this.emptyIcon
    },
    getColor (props: ItemSlotProps): string {
      if (this.isHovering) {
        if (props.isHovered || props.isHalfHovered) return this.color
      } else {
        if (props.isFilled || props.isHalfFilled) return this.color
      }

      return this.backgroundColor
    },
    isHalfEvent (e: MouseEvent): boolean {
      if (this.halfIncrements) {
        const rect = e.target && (e.target as HTMLElement).getBoundingClientRect()
        if (rect && (e.pageX - rect.left) < rect.width / 2) return true
      }

      return false
    },
    onMouseEnter (e: MouseEvent, i: number): void {
      this.runDelay('open', () => {
        this.hoverIndex = this.genHoverIndex(e, i)
      })
    },
    onMouseLeave (): void {
      this.runDelay('close', () => (this.hoverIndex = -1))
    },
    genItem (i: number): VNode | VNodeChildren | string {
      const props = this.createProps(i)

      if (this.$scopedSlots.item) return this.$scopedSlots.item(props)

      const listeners: Record<string, Function> = {
        click: props.click
      }

      if (this.hover) {
        listeners.mouseenter = (e: MouseEvent) => this.onMouseEnter(e, i)
        listeners.mouseleave = this.onMouseLeave

        if (this.halfIncrements) {
          listeners.mousemove = (e: MouseEvent) => this.onMouseEnter(e, i)
        }
      }

      return this.$createElement(VIcon, this.setTextColor(this.getColor(props), {
        directives: this.directives,
        props: this.iconProps,
        on: listeners
      }), [this.getIconName(props)])
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

  render (h): VNode {
    const children = createRange(Number(this.length)).map(i => this.genItem(i))
    children.push(this.genMessages())
    return h('div', {
      staticClass: 'v-rating',
      class: {
        'v-rating--readonly': this.readonly,
        'v-rating--dense': this.dense
      }
    }, children)
  }
})
