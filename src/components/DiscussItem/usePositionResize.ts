import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';

/** 处理 discuss Tag 跟随窗口大小变化，重新计算位置保证和创建时一致 */
// https://www.yuque.com/bzone/ald3bp/qnve33
export const usePositionResize = (
  props: {
    originLeft: number;
    originTop: number;
  } & Pick<
    API.Discuss,
    | 'belongsToComId'
    | 'containerLeft'
    | 'containerTop'
    | 'containerWidth'
    | 'containerHeight'
  >,
) => {
  const [left, setLeft] = useState(props.originLeft);
  const [top, setTop] = useState(props.originTop);
  /** 避免初始化后，满屏幕的 tag 一起动画归位 */
  const [initResized, setInitResized] = useState(false);

  useEffect(() => {
    const handlerResize = () => {
      const container = document.querySelector(
        `[data-comid="${props.belongsToComId}"]`,
      );

      if (container) {
        const containerRect = container.getBoundingClientRect();

        // left
        // props.containerLeft - containerRect.left = props.left - ?
        let nextLeft = new BigNumber(props.originLeft)
          .minus(new BigNumber(props.containerLeft).minus(containerRect.left))
          .toNumber();

        // top
        // props.containerTop - containerRect.top = props.top - ?

        let nextTop = new BigNumber(props.originTop)
          .minus(new BigNumber(props.containerTop).minus(containerRect.top))
          .toNumber();

        // left
        // props.containerWidth / containerRect.width = (props.left - containerRect.left) / ?

        nextLeft = new BigNumber(
          new BigNumber(nextLeft).minus(containerRect.left),
        )
          .dividedBy(
            new BigNumber(props.containerWidth).dividedBy(containerRect.width),
          )
          .plus(containerRect.left)
          .toNumber();

        // top
        // props.containerHeight / containerRect.height = (props.top - containerRect.top) / ?

        nextTop = new BigNumber(new BigNumber(nextTop).minus(containerRect.top))
          .dividedBy(
            new BigNumber(props.containerHeight).dividedBy(
              containerRect.height,
            ),
          )
          .plus(containerRect.top)
          .toNumber();

        setLeft(nextLeft);
        setTop(nextTop);
        setInitResized(true);
      }
    };

    const debounceHandlerResize = debounce(handlerResize, 50);

    /** 初始化执行一次 */
    handlerResize();

    window.addEventListener('resize', debounceHandlerResize);

    return () => {
      window.removeEventListener('resize', debounceHandlerResize);
    };
  }, []);

  return {
    left,
    top,
    initResized,
  };
};
