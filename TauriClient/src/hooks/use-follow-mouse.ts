import { Ref } from "vue";

export type FollowMouseConfig = {
  base: {
    x: "left" | "right";
    y: "top" | "bottom";
  };

  /**
   * The speed relative to mouse movement. Default is 1.
   */
  speed?: {
    x?: number;
    y?: number;
  };

  /**
   * The initial offset of the element. Default is 0.
   */
  offset?: {
    x?: number;
    y?: number;
  };

  /**
   * The maximum movement of the element. Default is Infinity.
   */
  maxMove?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
};

export function useFollowMouse(
  element: Ref<HTMLElement | undefined>,
  config: FollowMouseConfig
) {
  const rateX = config.speed?.x ?? 1;
  const rateY = config.speed?.y ?? 1;

  const offsetX = config.offset?.x ?? 0;
  const offsetY = config.offset?.y ?? 0;

  const limits = {
    left: config.maxMove?.left ?? -Infinity,
    right: config.maxMove?.right ?? Infinity,
    top: config.maxMove?.top ?? -Infinity,
    bottom: config.maxMove?.bottom ?? Infinity,
  };

  return (event: MouseEvent) => {
    const baseX = config.base.x;
    const baseY = config.base.y;

    const mouseOffsetX = event.clientX - document.body.clientWidth / 2;
    const mouseOffsetY = event.clientY - document.body.clientHeight / 2;
    let moveX = mouseOffsetX * rateX;
    let moveY = mouseOffsetY * rateY;

    if (moveX < 0 && limits.left < -moveX) {
      moveX = -limits.left;
    } else if (moveX > 0 && limits.right < moveX) {
      moveX = limits.right;
    }

    if (moveY < 0 && limits.top < -moveY) {
      moveY = -limits.top;
    } else if (moveY > 0 && limits.bottom < moveY) {
      moveY = limits.bottom;
    }

    const positionX =
      offsetX +
      moveX +
      (document.body.clientWidth - (element.value?.clientWidth ?? 0)) / 2;
    const positionY =
      offsetY +
      moveY -
      (document.body.clientHeight - (element.value?.clientHeight ?? 0)) / 2;

    if (element.value) {
      element.value.style[baseX] = `${positionX}px`;
      element.value.style[baseY] = `${positionY}px`;
    }
  };
}
