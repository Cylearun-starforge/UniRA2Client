import { defineComponent, PropType, h, ref, reactive, StyleValue } from "vue";
import style from "./dropdown-selector.module.css";
import { VBinder, VFollower, VTarget } from "vueuc";

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

const DropdownSelector = defineComponent({
  name: "dropdown-selector",
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
    const showMenuRef = ref(false);
    const openMenu = () => {
      showMenuRef.value = !showMenuRef.value;
    };

    return () => (
      <VBinder>
        {{
          default: () => [
            <VTarget>
              {{
                default: () => (
                  <div class={[style['dropdown-selector-root']]} style={props.style}>
                    <div class={[style['dropdown-selected-item'], "flex"]}>
                      {
                        props.candidates.find((item) =>
                          props.compare!(item.value, props.value)
                        )?.display
                      }
                    </div>
                    <button
                      class={style['dropdown-button']}
                      onClick={openMenu}
                    ></button>
                  </div>
                ),
              }}
            </VTarget>,
            <VFollower width="target" show={showMenuRef.value}>
              {{
                default: () => (
                  <div
                    style={{ display: showMenuRef.value ? "block" : "none" }}
                  >
                    <div
                      class={style['dropdown-menu-root']}
                      onFocusout={(_) => console.log("focusout")}
                    >
                      {props.candidates.map((item) => (
                        <div
                          key={item.value}
                          class={style['dropdown-menu-item']}
                          onClick={(_) => {
                            ctx.emit("update:value", item.value);
                            showMenuRef.value = false;
                          }}
                        >
                          {item.display}
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              }}
            </VFollower>,
          ],
        }}
      </VBinder>
    );
  },
}) as unknown as <T>(props: DropdownSelectorProps<T>) => JSX.Element;

export default DropdownSelector;
