import {
  ExtractPropTypes,
  Prop,
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue';
import { getElementPosition } from '@/utils/get-element-position';
import { CyBorder } from '@/index';
import style from './list.module.less';
import scrollButtonImg from './scroll_button.png';

const FOOTER_MARGIN = 60;
const SCROLLBAR_WIDTH = 24;
const SCROLLBAR_MARGIN = 4;
const ROUND_WIDTH = 60;
const ROUND_HEIGHT = 48;
const cssVars = {
  '--footer-margin': `${FOOTER_MARGIN}px`,
  '--scrollbar-width': `${SCROLLBAR_WIDTH}px`,
  '--scrollbar-margin': `${SCROLLBAR_MARGIN}px`,
  '--round-width': `${ROUND_WIDTH}px`,
  '--round-height': `${ROUND_HEIGHT}px`,
};

const props = {
  width: {
    type: Number,
    default: 320,
    validator: (width) => {
      return (
        typeof width === 'number' && width > SCROLLBAR_WIDTH + SCROLLBAR_MARGIN
      );
    },
  },
  height: {
    type: Number,
    default: 160,
    validator: (height) => {
      return typeof height === 'number' && height > FOOTER_MARGIN;
    },
  },
} satisfies Record<string, Prop<unknown>>;

export type CyListProps = ExtractPropTypes<typeof props>;

const CyList = defineComponent({
  name: 'List',
  props,
  setup(props, ctx) {
    const scrollButtonRef = ref<HTMLImageElement>();
    const mapListRef = ref<HTMLDivElement>();
    const mapViewRef = ref<HTMLDivElement>();
    const scrollbarRef = ref<HTMLDivElement>();

    const widthData = computed(() => {
      return {
        list: `${props.width}px`,
        listContent: props.width - SCROLLBAR_WIDTH - SCROLLBAR_MARGIN,
        scrollbar: `${SCROLLBAR_WIDTH}px`,
        roundLineY1: props.width - ROUND_WIDTH,
        roundLineY2: props.width,
      };
    });

    const heightData = computed(() => {
      const footerHeight = Math.min(props.height, FOOTER_MARGIN * 2);
      const footerTransform = footerHeight - FOOTER_MARGIN;
      return {
        listContent: `${props.height - FOOTER_MARGIN}px`,
        list: props.height,
        footer: `${footerHeight}px`,
        footerTransform: `translateY(${footerTransform}px)`,
        roundLineX1: props.height,
        roundLineX2: props.height - ROUND_HEIGHT,
        svg: footerTransform + props.height,
      };
    });
    const state = reactive({
      dragging: false,
      scrollPercentage: 0,
      position: { x: 0, y: 0 },
      canMove: false,
    });
    const updateScrollbarPosition = () => {
      state.position = getElementPosition(scrollbarRef.value!);
    };

    onMounted(() => {
      updateScrollbarPosition();
      syncCanMove();
      window.addEventListener('resize', updateScrollbarPosition);
      window.addEventListener('resize', syncCanMove);
    });

    const syncCanMove = () => {
      state.canMove =
        mapListRef.value!.clientHeight > mapViewRef.value!.clientHeight;
    };

    onUnmounted(() => {
      window.removeEventListener('resize', updateScrollbarPosition);
      window.removeEventListener('resize', syncCanMove);
    });

    const startDrag = () => {
      state.dragging = true;
    };
    const stopDrag = () => {
      state.dragging = false;
    };
    const onDrag = (e: MouseEvent) => {
      if (!state.dragging || !state.canMove) {
        return;
      }

      const positionInScrollbar = e.clientY - state.position.y;
      if (positionInScrollbar < 0) {
        state.scrollPercentage = 0;
      } else if (positionInScrollbar > scrollbarRef.value!.clientHeight) {
        state.scrollPercentage = 100;
      } else {
        state.scrollPercentage =
          (positionInScrollbar / scrollbarRef.value!.clientHeight) * 100 - 1;
      }
    };

    const onScroll = (e: WheelEvent) => {
      if (!state.canMove) {
        return;
      }
      const height =
        mapListRef.value!.clientHeight - mapViewRef.value!.clientHeight;
      const currentPercentage =
        (((height * state.scrollPercentage) / 100 + e.deltaY) * 100) / height;
      if (currentPercentage < 0) {
        state.scrollPercentage = 0;
      } else if (currentPercentage > 100) {
        state.scrollPercentage = 100;
      } else {
        state.scrollPercentage = currentPercentage;
      }
    };

    return {
      widthData,
      heightData,
      mapListRef,
      mapViewRef,
      onDrag,
      onScroll,
      scrollbarRef,
      scrollButtonRef,
      startDrag,
      state,
      stopDrag,
    };
  },
  render() {
    const {
      $slots,
      widthData,
      heightData,
      onDrag,
      onScroll,
      startDrag,
      state,
      stopDrag,
    } = this;
    return (
      <div
        class={style['map-list-root']}
        onWheel={onScroll}
        style={{
          ...cssVars,
        }}
      >
        <CyBorder
          overflow="hidden"
          topCornerSize={{ height: ROUND_HEIGHT, width: ROUND_WIDTH }}
          bottomCornerSize={{ height: ROUND_HEIGHT, width: ROUND_WIDTH }}
          redrawBorderOnResize
        >
          <div
            class={style['map-list-container']}
            style={{
              width: `${widthData.listContent}px`,
              height: heightData.listContent,
            }}
          >
            <div
              class={style['map-list']}
              style={{
                height: heightData.listContent,
              }}
            >
              <div ref="mapViewRef" class={style['map-list-view']}>
                <div
                  class={style['map-list-content']}
                  ref="mapListRef"
                  style={{ top: `-${state.scrollPercentage}%` }}
                >
                  {$slots.default?.()}
                </div>
              </div>
            </div>

            <div
              class={style['map-list-footer']}
              style={{
                height: heightData.footer,
                transform: heightData.footerTransform,
              }}
            />
          </div>
        </CyBorder>
        <div
          class={style['map-scrollbar']}
          ref="scrollbarRef"
          onMouseup={stopDrag}
          onMouseleave={stopDrag}
          style={{
            height: `${heightData.list}px`,
            width: widthData.scrollbar,
          }}
        >
          <img
            class={style.button}
            ref="scrollButtonRef"
            src={scrollButtonImg}
            draggable="false"
            onMousedown={startDrag}
            onMousemove={onDrag}
            style={{ top: `${state.scrollPercentage}%` }}
          />
        </div>
      </div>
    );
  },
});

export default CyList;
