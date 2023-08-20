import { defineComponent, PropType, ref, StyleValue } from "vue";
import style from "./style.module.less";
import { useFloating, flip, shift, autoUpdate, offset } from '@floating-ui/vue';
type DropdownCandidate<T> = {
  display: string;
  value: T;
};

type DropdownSelectorProps<T> = {
  value: T;
  candidates: DropdownCandidate<T>[];
  style?: StyleValue;
  compare?: (a: T, b: T) => boolean;
};

const CyDropdownSelector = defineComponent({
  name: "DropdownSelector",
  props: {
    value: {
      type: Object,
      required: true,
    },
    candidates: {
      type: Array as PropType<DropdownCandidate<any>[]>,
      required: true,
    },
    style: Object as PropType<StyleValue>,
    compare: {
      type: Function as PropType<DropdownSelectorProps<any>["compare"]>,
      default: (a: any, b: any) => a === b,
    },
  },
  emits: ["update:value"],
  setup(props, ctx) {
    const reference = ref<HTMLDivElement>();
    const floating = ref(null);
    const showMenuRef = ref(false);
    const floatResult = useFloating(reference, floating, {
      placement: 'bottom',
      middleware: [offset(4), flip(), shift({ padding: 8 })],
      whileElementsMounted: autoUpdate
    })
    const openMenu = () => {
      showMenuRef.value = !showMenuRef.value;

    };
    const closeMenu = () => {
      showMenuRef.value = false;
    };
    
    const updateValue = (item: DropdownCandidate<any>) => {
      ctx.emit("update:value", item.value);
      closeMenu()
    };

    return {
      ...props,
      openMenu,
      closeMenu,
      showMenu: showMenuRef,
      floatResult,
      floatingStyles: floatResult.floatingStyles,
      reference,
      floating,
      updateValue
    }
  },
  render() {
    const { style: propStyle, candidates, compare, value, openMenu, closeMenu, showMenu, floatingStyles, reference, updateValue } = this
    return (
      <div
        ref="reference"
        class={[style["cy-dropdown-selector-root"]]}
        style={propStyle}
      >
        <div
          class={[style["dropdown-selected-item"], "flex"]}>
          {
            candidates.find((item) =>
              compare!(item.value, value)
            )?.display
          }
        </div>
        <button
          class={style["dropdown-button"]}
          onClick={openMenu}
        ></button>
        {showMenu &&
          <div
            ref="floating"
            style={floatingStyles}
            class={style["dropdown-menu-root"]}
          >
            {candidates.map((item) => (
              <div
                key={item.value}
                class={style["dropdown-menu-item"]}
                onClick={() => {
                  updateValue(item)
                }}
              >
                {item.display}
              </div>
            ))}
          </div>
        }
      </div>

    )
  }
}) as unknown as <T>(props: DropdownSelectorProps<T>) => JSX.Element;

export default CyDropdownSelector;
