import {
  ExtractPropTypes,
  Prop,
  PropType,
  computed,
  defineComponent,
  ref,
  toRefs,
  watch,
} from 'vue';

import style from './style.module.less';
import { CyBorder } from '..';
import { useSyntheticValue } from '@/utils/use-synthetic-value';

const props = {
  value: {
    type: String,
    required: false,
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
  placeholder: {
    type: String,
    required: false,
  },
} satisfies Record<string, Prop<unknown>>;

export type CyInputProps = ExtractPropTypes<typeof props>;

const CyInput = defineComponent({
  name: 'Input',
  props,
  setup(props) {
    const { value, width } = toRefs(props);
    const [syntheticValue, setSyntheticValue] = useSyntheticValue(
      value,
      props.onChange
    );

    const showPlaceholder = computed(
      () => (props.placeholder?.length ?? 0) > 0
      // isInnerValue
      //   ? syntheticValue.value.length === 0
      //   : !value.value || value.value.length === 0
    );

    const handleUpdateValue = () => {
      if (inputRef.value) {
        setSyntheticValue(inputRef.value.value);
      }
    };
    watch(syntheticValue, (v) => {
      console.log('syntheticValue', v);
    });
    const inputRef = ref<HTMLInputElement>();

    return {
      inputRef,
      syntheticValue: syntheticValue.value,
      handleUpdateValue,
      width: `${width}px`,
      showPlaceholder,
    };
  },
  render() {
    const {
      syntheticValue,
      handleUpdateValue,
      width,
      type,
      showPlaceholder,
      placeholder,
    } = this;
    return (
      <div class={style['cy-input']}>
        <CyBorder topCornerSize={0} bottomCornerSize={0} width="100%">
          <input
            ref="inputRef"
            type={type}
            style={{ width }}
            value={syntheticValue}
            onInput={handleUpdateValue}
          />
          {showPlaceholder && (
            <div class={style.placeholder} role="placeholder">
              {placeholder}
            </div>
          )}
        </CyBorder>
      </div>
    );
  },
});

export default CyInput;
