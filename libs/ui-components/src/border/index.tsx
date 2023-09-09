import {
  ExtractPropTypes,
  Prop,
  PropType,
  Ref,
  computed,
  defineComponent,
  ref,
  toRef,
  watch,
} from 'vue';

import style from './style.module.less';

interface CornerSize {
  width: number;
  height: number;
}
interface BorderStyle {
  width: number;
  color: string;
}

const props = {
  bottomCornerSize: {
    type: [Number, Object] as PropType<number | CornerSize>,
    default: 20,
  },
  topCornerSize: {
    type: [Number, Object] as PropType<number | CornerSize>,
    default: 10,
  },
  borders: {
    type: Array as PropType<BorderStyle[]>,
    default: [
      {
        width: 2,
        color: 'rgb(1, 141, 177)',
      },
    ] satisfies BorderStyle[],
  },
} satisfies Record<string, Prop<unknown>>;

export type CyBorderProps = ExtractPropTypes<typeof props>;

function useCornerSize(cornerSize: Ref<number | CornerSize>) {
  return computed(() => {
    if (typeof cornerSize.value === 'object') {
      return cornerSize.value;
    }

    return {
      width: cornerSize.value,
      height: cornerSize.value,
    };
  });
}

interface Point {
  x: number;
  y: number;
}

/**
 * Compute points for border polygon.
 *  + start
 *
 *        p1            p2
 *         +------------+
 *        /             |
 *       /              |
 *   p6 +               |
 *      |               + p3
 *      |              /
 *      |             /
 *   p5 +------------+ p4
 */
function computeBorderPoints(
  start: { x: number; y: number },
  width: number,
  height: number,
  bottomCornerSize: CornerSize,
  topCornerSize: CornerSize
): Point[] {
  const p1: Point = {
    x: start.x + topCornerSize.width,
    y: start.y,
  };
  const p2: Point = {
    x: start.x + width,
    y: start.y,
  };

  const p3: Point = {
    x: start.x + width,
    y: start.y + height - bottomCornerSize.height,
  };

  const p4: Point = {
    x: start.x + width - bottomCornerSize.width,
    y: start.y + height,
  };

  const p5: Point = {
    x: start.x,
    y: start.y + height,
  };

  const p6: Point = {
    x: start.x,
    y: start.y + topCornerSize.height,
  };
  return [p1, p2, p3, p4, p5, p6];
}

interface PolygonProps {
  points: Point[];
  width: number;
  color: string;
}
function computedPolygons(
  borders: BorderStyle[],
  width: number,
  height: number,
  bottomCornerSize: CornerSize,
  topCornerSize: CornerSize
): PolygonProps[] {
  const context = {
    start: {
      x: 0,
      y: 0,
    },
    width,
    height,
    bottomCornerSize: {
      ...bottomCornerSize,
    },
    topCornerSize: {
      ...topCornerSize,
    },
  };
  return borders.map<PolygonProps>((border) => {
    const points = computeBorderPoints(
      context.start,
      context.width,
      context.height,
      context.bottomCornerSize,
      context.topCornerSize
    );
    context.start.x += border.width;
    context.start.y += border.width;
    context.width -= border.width * 2;
    context.height -= border.width * 2;
    return {
      points,
      ...border,
    };
  });
}

const CyBorder = defineComponent({
  name: 'Border',
  props,
  setup(props) {
    const bottomCornerSize = useCornerSize(toRef(props.bottomCornerSize));
    const topCornerSize = useCornerSize(toRef(props.topCornerSize));

    const rootRef = ref<HTMLDivElement>();
    const svgSize = ref({ width: 0, height: 0 });

    watch(rootRef, (root) => {
      if (!root) {
        return;
      }

      svgSize.value.width = root.clientWidth;
      svgSize.value.height = root.clientHeight;
    });

    const polygons = computed(() => {
      return computedPolygons(
        props.borders,
        rootRef.value?.clientWidth ?? 0,
        rootRef.value?.clientHeight ?? 0,
        bottomCornerSize.value,
        topCornerSize.value
      );
    });

    return {
      rootRef,
      svgSize,
      polygons,
    };
  },
  render() {
    const { $slots, polygons, svgSize } = this;
    return (
      <div ref="rootRef" class={style.root}>
        {$slots.default?.()}
        <svg width={svgSize.width} height={svgSize.height} class={style.canvas}>
          {polygons?.map(({ width, color, points }) => (
            <polygon
              stroke-width={width}
              stroke={color}
              fill="none"
              points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
            ></polygon>
          ))}
        </svg>
      </div>
    );
  },
});

export default CyBorder;
