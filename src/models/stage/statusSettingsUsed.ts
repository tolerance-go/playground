// import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { useState } from 'react';

export type StatusSettingsUsed = Record<string, string>;

/** 每个组件的动作改变后的状态 */
const useStatusSettingsUsed = () => {
  const [statusSettingsUsed, setStatusSettingsUsed] =
    useState<StatusSettingsUsed>({});

  const setComStatusSettingsUsed = useMemoizedFn(
    (comId: string, statId: string) => {
      setStatusSettingsUsed(
        produce((draft) => {
          draft[comId] = statId;
        }),
      );
    },
  );

  // const { setSelectedComponentStatusId } = useModel(
  //   'stage.selectedComponentStatusId',
  //   (model) => ({
  //     setSelectedComponentStatusId: model.setSelectedComponentStatusId,
  //   }),
  // );

  // /** 设置组件的默认状态为全局右侧面板选中状态 */
  // const selectRightPanelComStatusIdFromDefault = useMemoizedFn(
  //   (comId: string) => {
  //     const defaultStatId = statusSettingsUsed[comId];
  //     setSelectedComponentStatusId(defaultStatId);
  //   },
  // );

  // /** 获取数据，准备持久化 */
  // const getData = useMemoizedFn(() => {
  //   return {
  //     statusSettingsUsed,
  //   };
  // });

  // /** 初始化 */
  // const initData = useMemoizedFn(
  //   (from?: { statusSettingsUsed: StatusSettingsUsed }) => {
  //     setStatusSettingsUsed(from?.statusSettingsUsed ?? {});
  //   },
  // );

  // /** 清空组件的默认配置 */
  // const cleanComDefautStat = useMemoizedFn((comId: string) => {
  //   setStatusSettingsUsed(
  //     produce((draft) => {
  //       delete draft[comId];
  //     }),
  //   );
  // });

  // const getComDefaultStatId = useMemoizedFn((comId: string) => {
  //   return statusSettingsUsed[comId];
  // });

  return {
    statusSettingsUsed,
    // getComDefaultStatId,
    // initData,
    // getData,
    // cleanComDefautStat,
    setComStatusSettingsUsed,
    // selectRightPanelComStatusIdFromDefault,
  };
};

export default useStatusSettingsUsed;
