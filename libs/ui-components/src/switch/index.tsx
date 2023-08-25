import { ExtractPropTypes, Prop, PropType, defineComponent, toRefs } from 'vue';
import style from './style.module.less';

const props = {
  text: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onChange: Function as PropType<(checked: boolean) => void>,
} satisfies Record<string, Prop<unknown>>;

export type CySwitchProps = ExtractPropTypes<typeof props>;

const CySwitch = defineComponent({
  name: 'Switch',
  props,
  emits: {
    'update:checked': (checked: boolean) => true,
  },
  setup(props, ctx) {
    const handleUpdate = () => {
      if (props.disabled) {
        return;
      }
      const nextValue = !props.checked;
      props.onChange?.(nextValue);
      ctx.emit('update:checked', nextValue);
    };
    return () => {
      return (
        <div
          class={
            props.disabled
              ? [style['game-switch-root'], style['game-switch-disabled']]
              : [style['game-switch-root']]
          }
        >
          <div
            role="button"
            class={[
              style['game-switch-button'],
              props.checked && style['game-switch-selected'],
              props.disabled && style['game-switch-button-disabled'],
            ]}
            onClick={handleUpdate}
          ></div>
          {props.text}
        </div>
      );
    };
  },
});

export default CySwitch;
