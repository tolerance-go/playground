import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { produce } from 'immer';
import { useState } from 'react';

/** 每个组件的默认应用状态 */
const statusSettingsDefaults = () => {
  const [statusSettingsDefaults, setStatusSettingsDefaults] = useState<
    Record<string, string>
  >({});

  /** 设置组件的默认状态 */
  const setComStatusSettingsDefaults = useMemoizedFn(
    (comId: string, defaultStatId: string) => {
      setStatusSettingsDefaults(
        produce((draft) => {
          draft[comId] = defaultStatId;
        }),
      );
    },
  );

  const { setSelectedComponentStatusId } = useModel(
    'selectedComponentStatus',
    (model) => ({
      setSelectedComponentStatusId: model.setSelectedComponentStatusId,
    }),
  );

  /** 设置组件的默认状态为全局右侧面板选中状态 */
  const selectedComponentStatusIdFromComDefaultStatus = useMemoizedFn(
    (comId: string) => {
      const defaultStatId = statusSettingsDefaults[comId];
      setSelectedComponentStatusId(defaultStatId);
    },
  );

  return {
    statusSettingsDefaults,
    setComStatusSettingsDefaults,
    selectedComponentStatusIdFromComDefaultStatus,
  };
};

export default statusSettingsDefaults;
