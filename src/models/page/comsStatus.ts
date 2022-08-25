import { useModel } from '@umijs/max';
import { useGetState, useMemoizedFn } from 'ahooks';
import produce from 'immer';
import { DEFAULT_COM_STATUS_NAME } from '@/constants';

import { ComId, StatId } from '@/typings/keys';
import utl from 'lodash';

/** 组件状态 */
export type ComponentStat = {
  id: string;
  name: string;
};

/** 组件的不同状态 */
export type ComponentStatus = Record<StatId, ComponentStat>;

/** 所有组件的所有状态下的配置 */
export type ComponentsStatus = Record<ComId, ComponentStatus>;

const useStatusSettings = () => {
  const [componentsStatus, setComponentsStatus, getComponentsStatus] =
    useGetState<ComponentsStatus>({});

  const { getSelectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }),
  );

  const { getStageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  /** 删除组件的所有状态 */
  const deleteComStatus = useMemoizedFn((comId: string) => {
    setComponentsStatus(
      produce((draft) => {
        delete draft[comId];
      }),
    );
  });

  /** 删除组件的某个状态 */
  const deleteComStat = useMemoizedFn((comId: string, statId: string) => {
    setComponentsStatus(
      produce((draft) => {
        delete draft[comId][statId];
      }),
    );
  });

  /** 从当前选中组件，创建新的配置状态 */
  const createSelectedComponentStat = useMemoizedFn(
    (newStatId: string, name: string) => {
      setComponentsStatus(
        produce((draft) => {
          const stageSelectNodeId = getStageSelectNodeId();

          if (stageSelectNodeId) {
            draft[stageSelectNodeId] = {
              ...draft[stageSelectNodeId],
              [newStatId]: {
                id: newStatId,
                name,
              },
            };
          }
        }),
      );
    },
  );

  /** 初始化组件的默认状态 */
  const initComStatus = useMemoizedFn(
    ({ statusId, comId }: { statusId: string; comId: string }) => {
      setComponentsStatus(
        produce((draft) => {
          draft[comId] = {
            [statusId]: {
              id: statusId,
              name: DEFAULT_COM_STATUS_NAME,
            },
          };
        }),
      );
    },
  );

  /** 设置当前选中组件的激活 tab 的名称 */
  const setSelectedComActiveStatName = useMemoizedFn((name: string) => {
    const selectedComponentStatusId = getSelectedComponentStatusId();
    const stageSelectNodeId = getStageSelectNodeId();

    if (stageSelectNodeId && selectedComponentStatusId) {
      setComponentsStatus(
        produce((draft) => {
          draft[stageSelectNodeId][selectedComponentStatusId].name = name;
        }),
      );
    }
  });

  /** 获取指定组件的所有状态 */
  const getComStatus = useMemoizedFn((comId: string) => {
    return componentsStatus[comId];
  });

  const deleteComStatuslByIds = useMemoizedFn((comIds: string[]) => {
    setComponentsStatus(
      produce((draft) => {
        comIds.forEach((comId) => {
          delete draft[comId];
        });
      }),
    );
  });

  /** 获取数据，准备持久化 */
  const getData = useMemoizedFn(() => {
    return {
      componentsStatus,
    };
  });

  const getSliceData = useMemoizedFn((comIds: string[]) => {
    return {
      componentsStatus: utl.pick(componentsStatus, comIds),
    };
  });

  /** 初始化 */
  const initData = useMemoizedFn(
    (from?: { componentsStatus: ComponentsStatus }) => {
      setComponentsStatus(from?.componentsStatus ?? {});
    },
  );

  return {
    componentsStatus,
    deleteComStatuslByIds,
    getSliceData,
    getComStatus,
    setSelectedComActiveStatName,
    deleteComStatus,
    deleteComStat,
    getData,
    initData,
    getComponentsStatus,
    initComStatus,
    setComponentsStatus,
    createSelectedComponentStat,
  };
};

export default useStatusSettings;
