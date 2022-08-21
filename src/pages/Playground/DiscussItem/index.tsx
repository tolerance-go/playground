import { DiscussTag } from '@/components/DiscussTag';
import { useModel } from '@umijs/max';
import BigNumber from 'bignumber.js';
import { debounce } from 'lodash';
import { memo, useEffect, useState } from 'react';

const DiscussItem = (
  props: API.Discuss & {
    index: number;
  },
) => {
  const { setSelectedDiscussId, setDetailMode, selectedDiscussId } = useModel(
    'playground',
    (model) => ({
      setSelectedDiscussId: model.setSelectedDiscussId,
      selectedDiscussId: model.selectedDiscussId,
      setDetailMode: model.setDetailMode,
    }),
  );

  const [left, setLeft] = useState(props.left);
  const [top, setTop] = useState(props.top);
  /** 避免初始化后，满屏幕的 tag 一起动画归位 */
  const [initResized, setInitResized] = useState(false);

  useEffect(() => {
    const handlerResize = () => {
      const container = document.querySelector(
        `[data-comid="${props.belongsToComId}"]`,
      );

      if (container) {
        // https://www.yuque.com/bzone/ald3bp/qnve33
        const containerRect = container.getBoundingClientRect();

        // left
        // props.containerLeft - containerRect.left = props.left - ?
        let nextLeft = new BigNumber(props.left)
          .minus(new BigNumber(props.containerLeft).minus(containerRect.left))
          .toNumber();

        // top
        // props.containerTop - containerRect.top = props.top - ?

        let nextTop = new BigNumber(props.top)
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

  return initResized ? (
    <DiscussTag
      className="discussItem"
      type={selectedDiscussId === props.id ? 'primary' : 'default'}
      onClick={(event) => {
        /** 防止重复创建 temp */
        event.stopPropagation();
        setSelectedDiscussId(props.id);
        setDetailMode('detail');
      }}
      top={top}
      left={left}
    />
  ) : null;
};

export default memo(DiscussItem);
