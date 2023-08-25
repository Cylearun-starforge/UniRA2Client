import {
  ExtractPropTypes,
  Prop,
  PropType,
  defineComponent,
  ref,
  toRefs,
} from 'vue';

import style from './style.module.less';

const props = {
  value: {
    type: String,
    default: '',
  },
  onChange: {
    type: Function as PropType<(value: string) => void>,
    default: () => {},
  },
  width: {
    type: Number,
    default: 120,
  },
  type: {
    type: String,
    default: 'text',
  },
} satisfies Record<string, Prop<unknown>>;

export type CyInputProps = ExtractPropTypes<typeof props>;

const CyInput = defineComponent({
  name: 'Input',
  props,
  setup(props) {
    const { onChange, value, width, type } = toRefs(props);
    const inputRef = ref<HTMLInputElement>();
    const handleInput = () => {
      if (inputRef.value && onChange.value) {
        onChange.value(inputRef.value.value);
      }
    };
    return {
      inputRef,
      value,
      handleInput,
      width: `${width}px`,
      type,
    };
  },
  render() {
    const { value, handleInput, width, type } = this;
    return (
      <input
        ref="inputRef"
        class={style['cy-input']}
        type={type}
        style={{ width }}
        value={value}
        onInput={handleInput}
      />
    );
  },
});

export default CyInput;
