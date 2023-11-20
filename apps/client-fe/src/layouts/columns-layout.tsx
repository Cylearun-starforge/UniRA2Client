import {
  ExtractPropTypes,
  Prop,
  PropType,
  StyleValue,
  defineComponent,
  renderSlot,
} from 'vue';

type Column = {
  name: string;
  width: number | 'flex1';
  class?: string;
  style?: StyleValue;
};

const props = {
  columns: {
    type: Array as PropType<Column[]>,
    default: [{ name: 'default', width: 'flex1' }] satisfies Column[],
  },
  gap: {
    type: Number,
    default: 10,
  },
  class: String,
} satisfies Record<string, Prop<unknown>>;

export type ColumnsLayoutProps = ExtractPropTypes<typeof props>;

export default defineComponent({
  props,
  setup(props) {},
  render() {
    const cols = this.$props.columns.reduce((fragments, col) => {
      const renderSlot = this.$slots[col.name];
      if (!renderSlot) {
        return fragments;
      }
      const style =
        col.width === 'flex1'
          ? {
              flex: '1',
            }
          : {
              width: `${col.width}px`,
            };
      fragments.push(
        <div style={[style, col.style ?? {}]} class={col.class}>
          {renderSlot()}
        </div>
      );
      return fragments;
    }, [] as unknown[]);
    return (
      <div
        class={this.class}
        style={{
          display: 'flex',
          gap: `${this.$props.gap}px`,
        }}
      >
        {cols}
      </div>
    );
  },
});
