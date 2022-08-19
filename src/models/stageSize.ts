import { HistoryAreaNames } from '@/constants/HistoryAreaNames';
import { getURLQuery } from '@/helps/getURLQuery';
import {
  AppControllerShow,
  AppControllerUpdateStageSize,
} from '@/services/server/AppController';
import { useModel, useRequest } from '@umijs/max';
import { useGetState, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useRef } from 'react';
import { BoxSize } from './comsStyles';

/** 舞台插槽组的选择 */
const useStageSize = () => {
  const [stageSize, setStageSize, getStageSize] = useGetState<BoxSize>();
  const { historyManager } = useModel('appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  const changeStageSize = useMemoizedFn((data: BoxSize | undefined) => {
    setStageSize(data);
  });

  const updateCauseRecoverRef = useRef<boolean>(false);

  const updateCauseInitedRef = useRef<boolean>(false);

  const { run: updateRemoteStageSize } = useRequest(
    async (data: BoxSize | undefined) => {
      const query = getURLQuery();

      if (!query.appId) return;

      const result = await AppControllerUpdateStageSize(
        {
          id: query.appId as string,
        },
        JSON.stringify(data ?? {}),
      );

      if (result.success) {
        if (updateCauseRecoverRef.current) {
          updateCauseRecoverRef.current = false;
        } else {
          historyManager.commit({
            [HistoryAreaNames.StageSize]: {
              state: data,
              commitInfo: undefined,
            },
          });
        }
      }

      return result;
    },
    {
      manual: true,
    },
  );

  useRequest(
    async () => {
      const query = getURLQuery();

      if (!query.appId) return;

      return AppControllerShow({
        id: query.appId as string,
      });
    },
    {
      onSuccess: (data) => {
        const stageData = data?.stage_size_data
          ? JSON.parse(data.stage_size_data)
          : undefined;

        historyManager.registerArea<BoxSize | undefined, undefined>({
          name: HistoryAreaNames.StageSize,
          getInitialState: () => {
            return stageData;
          },
          pull: () => {
            return getStageSize();
          },
          recover: async ({ state }) => {
            updateCauseRecoverRef.current = true;
            setStageSize(state);
            return {
              success: true,
            };
          },
        });

        updateCauseInitedRef.current = true;
        setStageSize(stageData);
      },
    },
  );

  useUpdateEffect(() => {
    if (updateCauseInitedRef.current) {
      updateCauseInitedRef.current = false;
    } else {
      updateRemoteStageSize(stageSize);
    }
  }, [stageSize]);

  return {
    stageSize,
    changeStageSize,
  };
};

export default useStageSize;
