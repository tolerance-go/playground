import { SlotPosition } from '@/models/slotsInsert';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';

export type StageComponentsModelItem = {
  id: string;
  type: string;
  /**
   * key 为插槽名称，插槽存在多种，不单单是 children
   * value 为组件的 id
   */
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

  const { refreshLastAutoSaveTime } = useModel('stageAutoSave', (model) => {
    return {
      refreshLastAutoSaveTime: model.triggerSaveTimeChange,
    };
  });

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

      refreshLastAutoSaveTime();
    },
  );

  /**
   * 新增组建到插槽
   */
  const addComToStageSlot = useMemoizedFn(
    (params: {
      parentId: string;
      newId: string;
      slotName: string;
      type: string;
      display: StageComponentsModelItem['display'];
      postion: SlotPosition;
    }) => {
      setStageComponentsModel((prev) => ({
        ...prev,
        [params.parentId]: {
          ...(prev?.[params.parentId] as StageComponentsModelItem),
          slots: {
            ...prev?.[params.parentId].slots,
            [params.slotName]:
              params.postion === 'before'
                ? [
                    params.newId,
                    ...(prev?.[params.parentId].slots?.[params.slotName] ?? []),
                  ]
                : [
                    ...(prev?.[params.parentId].slots?.[params.slotName] ?? []),
                    params.newId,
                  ],
          },
          slotsOrder: {},
        },
        [params.newId]: {
          id: params.newId,
          type: params.type,
          slots: {},
          slotsOrder: {},
          display: params.display,
        },
      }));

      refreshLastAutoSaveTime();
    },
  );

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      rootIds,
      stageComponentsModel,
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn(
    (from?: {
      rootIds: string[];
      stageComponentsModel: StageComponentsModel;
    }) => {
      setRootIds(from?.rootIds ?? []);
      setStageComponentsModel(from?.stageComponentsModel);
    },
  );

  return {
    rootIds,
    stageComponentsModel,
    addComponentToStage,
    getData,
    initData,
    addComToStageSlot,
  };
};

export default useStageComponentsModel;
