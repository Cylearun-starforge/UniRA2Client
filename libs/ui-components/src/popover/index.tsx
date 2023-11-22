import {
  ExtractPropTypes,
  Prop,
  PropType,
  defineComponent,
  reactive,
  ref,
} from 'vue';

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  type Placement,
} from '@floating-ui/vue';

import style from './style.module.less';

const props = {
  trigger: {
    type: Array as PropType<Array<'hover'>>,
    default: ['hover'],
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'bottom' as Placement,
  },
  forceVisible: Boolean,
} satisfies Record<string, Prop<unknown>>;

export type CyPopoverProps = ExtractPropTypes<typeof props>;

const CyPopover = defineComponent({
  name: 'Popover',
  props,
  setup(props) {
    const states = reactive({
      visible: props.forceVisible,
    });
    const triggerRef = ref<HTMLDivElement>();
    const popoverRef = ref<HTMLDivElement>();
    const { floatingStyles: popoverFloatingStyle } = useFloating(
      triggerRef,
      popoverRef,
      {
        placement: props.placement,
        middleware: [offset(4), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
      }
    );

    const handleMouseEnter = () => {
      states.visible = true;
    };

    const handleMouseLeave = () => {
      if (!props.forceVisible) {
        states.visible = false;
      }
    };

    return { popoverFloatingStyle, states, handleMouseEnter, handleMouseLeave };
  },
  render() {
    const {
      $slots,
      popoverFloatingStyle,
      states,
      handleMouseEnter,
      handleMouseLeave,
    } = this;
    return (
      <div
        ref="triggerRef"
        style={{ position: 'relative' }}
        onMouseenter={handleMouseEnter}
        onMouseleave={handleMouseLeave}
        class={style.trigger}
      >
        {$slots.trigger?.()}
        {states.visible && (
          <div
            ref="popoverRef"
            style={popoverFloatingStyle}
            onMouseleave={handleMouseLeave}
            class={style.popover}
          >
            {$slots.default?.()}
          </div>
        )}
      </div>
    );
  },
});

export default CyPopover;
