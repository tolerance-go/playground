import { ComId, StatId } from '@/typings/keys';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import produce from 'immer';
import utl from 'lodash';
import { CSSProperties, useState } from 'react';

/** 单位数字 */
export type UnitNumber = {
  value?: number;
  /**
   * percentage 百分比
   * absolute 绝对值
   */
  unit?: 'px' | '%';
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

export type ComponentCommonStyle = {
  marginPosition?: BoxPosition;
  paddingPosition?: BoxPosition;
  positionType?: CSSProperties['position'];
  position?: BoxPosition;
  size?: BoxSize;
};

/**
 * 组件的不同状态
 * key: statId
 */
export type ComponentStatusStyles = Record<StatId, ComponentCommonStyle>;

/** 所有组件的所有状态下的配置
 * key: comId
 */
export type ComponentsStyles = Record<ComId, ComponentStatusStyles>;

/** 组件外观 */
const useComsStyles = () => {
  const [comsStyles, setComsStyles] = useState<ComponentsStyles>({});

  const { getSelectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }),
  );

  const { getStageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  const setComStatStyle = useMemoizedFn(
    (comId: string, statId: string, style: ComponentCommonStyle) => {
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

  const updateComStatStyle = useMemoizedFn(
    (comId: string, statId: string, style: ComponentCommonStyle) => {
      setComsStyles(
        produce((draft) => {
          if (draft[comId] === undefined) {
            draft[comId] = {};
          }
          draft[comId][statId] = {
            ...draft[comId][statId],
            ...style,
          };
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

  const getSliceData = useMemoizedFn((comIds: string[]) => {
    return {
      comsStyles: utl.pick(comsStyles, comIds),
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn((from?: { comsStyles: ComponentsStyles }) => {
    setComsStyles(from?.comsStyles ?? {});
  });

  /** 拷贝组件 A 状态的配置到 B 状态 */
  const copyComStyleFromStatToOtherStat = useMemoizedFn(
    (comId: string, fromStatId: string, toStatId: string) => {
      setComsStyles(
        produce((draft) => {
          if (draft[comId] === undefined) {
            draft[comId] = {};
          }
          draft[comId][toStatId] = draft[comId][fromStatId];
        }),
      );
    },
  );

  const copySelectedComStyleFromActiveStatToOtherStat = useMemoizedFn(
    (toStatId: string) => {
      const stageSelectNodeId = getStageSelectNodeId();
      const selectedComponentStatusId = getSelectedComponentStatusId();
      if (stageSelectNodeId && selectedComponentStatusId) {
        copyComStyleFromStatToOtherStat(
          stageSelectNodeId,
          selectedComponentStatusId,
          toStatId,
        );
      }
    },
  );

  const deleteComsStylesByIds = useMemoizedFn((comIds: string[]) => {
    setComsStyles(
      produce((draft) => {
        comIds.forEach((comId) => {
          delete draft[comId];
        });
      }),
    );
  });

  return {
    comsStyles,
    deleteComsStylesByIds,
    getSliceData,
    getData,
    initData,
    setComStatStyle,
    updateComStatStyle,
    copyComStyleFromStatToOtherStat,
    copySelectedComStyleFromActiveStatToOtherStat,
  };
};

export default useComsStyles;
