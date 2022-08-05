import { ComId, StatId } from '@/typings/keys';
import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { CSSProperties, useState } from 'react';

/** 单位数字 */
export type UnitNumber = {
  value?: number;
  /**
   * percentage 百分比
   * absolute 绝对值
   */
  unit?: 'percentage' | 'absolute';
};

export type BoxPosition = {
  top?: UnitNumber;
  left?: UnitNumber;
  right?: UnitNumber;
  bottom?: UnitNumber;
};

export type BoxSize = {
  width?: UnitNumber;
  height?: UnitNumber;
  /** 锁定宽高比例 */
  lockingWidthRatio?: boolean;
};

export type ComponentStyle = {
  id: string;
  marginPosition: BoxPosition;
  paddingPosition: BoxPosition;
  positionType: CSSProperties['position'];
  position: BoxPosition;
  size: BoxSize;
};

/**
 * 组件的不同状态
 * key: statId
 */
export type ComponentStatusStyles = Record<StatId, ComponentStyle>;

/** 所有组件的所有状态下的配置
 * key: comId
 */
export type ComponentsStyles = Record<ComId, ComponentStatusStyles>;

/** 组件外观 */
const useComsStyles = () => {
  const [comsStyles, setComsStyles] = useState<ComponentsStyles>({});

  const setComponentStyle = useMemoizedFn(
    (comId: string, statId: string, style: ComponentStyle) => {
      setComsStyles(
        produce((draft) => {
          if (draft[comId] === undefined) {
            draft[comId] = {};
          }
          draft[comId][statId] = style;
        }),
      );
    },
  );

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      comsStyles,
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn((from?: { comsStyles: ComponentsStyles }) => {
    setComsStyles(from?.comsStyles ?? {});
  });

  return {
    comsStyles,
    getData,
    initData,
    setComponentStyle,
  };
};

export default useComsStyles;
