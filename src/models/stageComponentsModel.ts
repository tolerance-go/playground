import { SlotPosition } from '@/models/slotsInsert';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import { useState } from 'react';

export type StageComponentsModelItem = {
  /** 所在的插槽名称 */
  slotName: string;
  /** 父组件的 id */
  parentId: string;
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

  const { removeComSettings } = useModel('componentsSettings', (model) => ({
    removeComSettings: model?.removeComSettings,
  }));

  /** 新增组建到舞台 */
  const addComponentToStage = useMemoizedFn(
    (
      type: string,
      params: {
        parentId: string;
        slotName: string;
        id: string;
        display: StageComponentsModelItem['display'];
      },
    ) => {
      const newId = params.id;

      setRootIds((prev) => prev.concat(newId));

      setStageComponentsModel((prev) => ({
        ...prev,
        [newId]: {
          slotName: params.slotName,
          parentId: params.parentId,
          id: newId,
          type,
          slots: {},
          slotsOrder: {},
          display: params.display,
        },
      }));
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
          slotName: params.slotName,
          parentId: params.parentId,
          id: params.newId,
          type: params.type,
          slots: {},
          slotsOrder: {},
          display: params.display,
        },
      }));
    },
  );

  /** 删除组件 */
  const removeComFromTree = useMemoizedFn(
    (options: { comId: string; parentId: string; slotName: string }) => {
      const { comId, parentId, slotName } = options;

      /** 删除跟组件 */
      if (parentId === 'root') {
        setRootIds((prev) => {
          const index = prev.findIndex((item) => item === comId);
          prev.splice(index, 1);
          return [...prev];
        });
      }

      setStageComponentsModel(
        produce((prev) => {
          /** 删除自己在父组件中的插槽 */
          const parent = prev?.[parentId];
          if (parent) {
            const targetSlots = parent.slots?.[slotName];
            const slotIndex = targetSlots.findIndex((item) => item === comId);
            targetSlots.splice(slotIndex, 1);
          }

          /** 删除所有子组件 */
          let allSlots: string[] = [];
          const collectAllSlotComIds = (id: string) => {
            const target = stageComponentsModel?.[id];
            if (!target) return;
            Object.keys(target.slots).forEach((slotName) => {
              const slotComIds = target.slots[slotName];
              allSlots = allSlots.concat(slotComIds);
              slotComIds.forEach((slotComId) =>
                collectAllSlotComIds(slotComId),
              );
            });
          };
          collectAllSlotComIds(comId);
          allSlots.forEach((slotComId) => {
            delete prev?.[slotComId];
            removeComSettings(slotComId);
          });

          /** 删除自身 */
          delete prev?.[comId];
          removeComSettings(comId);
        }),
      );
    },
  );

  /** 删除插槽 */
  const removeSlotFromTree = useMemoizedFn(
    (options: { comId: string; slotName: string; parentId: string }) => {
      const { comId, slotName } = options;

      /** 删除插槽下面的所有组件 */
      const slotComIds = stageComponentsModel?.[comId].slots[slotName];
      slotComIds?.forEach((slotComId) => {
        removeComFromTree({
          comId: slotComId,
          parentId: comId,
          slotName,
        });
      });

      setStageComponentsModel(
        produce((prev) => {
          /** 删除插槽自身 */
          delete prev?.[comId].slots[slotName];

          return prev;
        }),
      );
    },
  );

  /**
   * 移动组件
   * 插槽是不能移动的
   */
  const moveComFromTree = useMemoizedFn(
    (options: {
      comId: string;
      parentId: string;
      slotName: string;
      targetIndex: number;
      targetComId: string;
      targetSlotName: string;
      targetParentId: string;
    }) => {
      const {
        comId,
        parentId,
        slotName,
        targetParentId,
        targetIndex,
        targetComId,
        targetSlotName,
      } = options;

      const removePrevCom = (
        comsModel: WritableDraft<StageComponentsModel> | undefined,
      ) => {
        // 找到要移动的元素
        const toMoveNode = comsModel?.[comId];

        if (toMoveNode) {
          /**
           * 从原来位置删除
           * 只是从父组件插槽相应删除
           */
          const parentNode = comsModel?.[parentId];
          if (parentNode) {
            const index = parentNode.slots[slotName].findIndex(
              (slotComId) => slotComId === comId,
            );
            parentNode.slots[slotName].splice(index, 1);
          }
        }
      };

      /** 移动的是跟组件，放置的目标是跟组件 */
      if (parentId === 'root' && targetSlotName === 'root') {
        setRootIds(
          produce((prev) => {
            const index = prev.findIndex((item) => item === comId);

            if (index === targetIndex) {
              return prev;
            }

            console.log(targetIndex);
            prev.splice(index, 1);
            prev.splice(
              index < targetIndex ? targetIndex - 1 : targetIndex,
              0,
              comId,
            );
          }),
        );
        /** 移动的是插槽组件，放置目标也是插槽 */
      } else if (parentId !== 'root' && targetSlotName !== 'root') {
        setStageComponentsModel(
          produce((prev) => {
            // 找到要移动的元素
            const node = prev?.[comId];

            if (node) {
              /**
               * 从原来位置删除
               * 只是从父组件插槽相应删除
               */
              const parentNode = prev?.[parentId];
              if (parentNode) {
                const index = parentNode.slots[slotName].findIndex(
                  (slotComId) => slotComId === comId,
                );
                parentNode.slots[slotName].splice(index, 1);

                // 在新的组件指定插槽下的指定顺序放置
                const targetCom = prev?.[targetComId];

                if (targetCom) {
                  /** 同一个插槽内移动 */
                  if (targetComId === parentId) {
                    targetCom.slots[targetSlotName].splice(
                      index < targetIndex ? targetIndex - 1 : targetIndex,
                      0,
                      comId,
                    );
                  } else {
                    /** 2个不同插槽移动 */
                    targetCom.slots[targetSlotName].splice(
                      targetIndex,
                      0,
                      comId,
                    );
                  }
                }
              }
            }
          }),
        );

        /** 移动的是跟组件，放置的是插槽组件 */
      } else if (parentId === 'root' && targetSlotName !== 'root') {
        setRootIds(
          produce((prev) => {
            const index = prev.findIndex((item) => item === comId);
            prev.splice(index, 1);
          }),
        );

        setStageComponentsModel(
          produce((prev) => {
            // 在新的组件指定插槽下的指定顺序放置
            const targetParentNode = prev?.[targetComId];

            if (targetParentNode) {
              targetParentNode.slots[targetSlotName].splice(
                targetIndex,
                0,
                comId,
              );
            }
          }),
        );

        /** 移动是插槽组件，放置的是跟组件 */
      } else if (slotName !== 'root' && targetParentId === 'root') {

        setStageComponentsModel(
          produce((prev) => {
            // 找到要移动的元素
            const node = prev?.[comId];

            if (node) {
              /**
               * 从原来位置删除
               * 只是从父组件插槽相应删除
               */
              const parentNode = prev?.[parentId];
              if (parentNode) {
                const index = parentNode.slots[slotName].findIndex(
                  (slotComId) => slotComId === comId,
                );
                parentNode.slots[slotName].splice(index, 1);
              }
            }
          }),
        );

        setRootIds(
          produce((prev) => {
            prev.splice(targetIndex, 0, comId);
          }),
        );
      }

      // setStageComponentsModel(
      //   produce((prev) => {
      //     // 找到要移动的元素
      //     const toMoveNode = prev?.[comId];

      //     if (toMoveNode) {
      //       /**
      //        * 从原来位置删除
      //        * 只是从父组件插槽相应删除
      //        */
      //       const parentNode = prev?.[parentId];
      //       if (parentNode) {
      //         const index = parentNode.slots[slotName].findIndex(
      //           (slotComId) => slotComId === comId,
      //         );
      //         parentNode.slots[slotName].splice(index, 1);
      //       } else {
      //         window.__consola.debug(
      //           'debug:',
      //           'moveComFromTree',
      //           '没有找到父元素',
      //           parentId,
      //         );
      //       }

      //       // 在新的组件指定插槽下的指定顺序放置
      //       const targetParentNode = prev?.[targetComId];

      //       // 可能是跟组件位置
      //       if (targetParentNode) {
      //         targetParentNode.slots[targetSlotName].splice(
      //           targetIndex,
      //           0,
      //           comId,
      //         );
      //       }
      //     }

      //     return prev;
      //   }),
      // );
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

  const getLatestStageComponentsModel = useMemoizedFn(() => {
    return stageComponentsModel;
  });

  window.__consola.info('model:', 'stageComponentsModel', stageComponentsModel);
  window.__consola.info('model:', 'rootIds', rootIds);

  return {
    rootIds,
    stageComponentsModel,
    addComponentToStage,
    getData,
    initData,
    addComToStageSlot,
    removeComFromTree,
    removeSlotFromTree,
    moveComFromTree,
    getLatestStageComponentsModel,
  };
};

export default useStageComponentsModel;
