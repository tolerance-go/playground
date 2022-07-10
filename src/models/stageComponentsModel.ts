import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

export type StageComponentsModelItem = {
  id: string;
  type: string;
  /** 插槽存在多种，不单单是 children */
  slots: Record<string, string[]>;
  /** 从小到大排序 0,1,2 */
  slotsOrder: Record<string, number[]>;
  display: 'block' | 'inline';
};

export type StageComponentsModel = Record<string, StageComponentsModelItem>;

const useStageComponentsModel = () => {
  const [rootIds, setRootIds] = useState<string[]>([]);
  const [stageComponentsModel, setStageComponentsModel] =
    useState<StageComponentsModel>();

  /** 新增组建到舞台 */
  const addComponentToStage = useMemoizedFn(
    (
      type: string,
      params: {
        id: string;
        display: StageComponentsModelItem['display'];
      },
    ) => {
      const newId = params.id;

      setRootIds((prev) => prev.concat(newId));

      setStageComponentsModel((prev) => ({
        ...prev,
        [newId]: {
          id: newId,
          type,
          slots: {},
          slotsOrder: {},
          display: params.display,
        },
      }));
    },
  );

  return {
    rootIds,
    stageComponentsModel,
    addComponentToStage,
  };
};

export default useStageComponentsModel;
