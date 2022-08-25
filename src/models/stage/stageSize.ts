import { HISTORY_AREA_NAMES } from '@/constants/HistoryAreaNames';
import { getURLQuery } from '@/helps/getURLQuery';
import {
  AppControllerShow,
  AppControllerUpdateStageSize,
} from '@/services/server/AppController';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';

import { useGetState, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { useRef } from 'react';
import { BoxSize } from '../page/comsStyles';

/** 舞台插槽组的选择 */
const useStageSize = () => {
  const [stageSize, setStageSize, getStageSize] = useGetState<BoxSize>();
  const { historyManager } = useModel('app.appStateHistory', (model) => ({
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

      await AppControllerUpdateStageSize(
        {
          id: query.appId as string,
        },
        JSON.stringify(data ?? {}),
      );

      if (updateCauseRecoverRef.current) {
        updateCauseRecoverRef.current = false;
      } else {
        historyManager.commit({
          [HISTORY_AREA_NAMES.STAGE_SIZE]: {
            state: data,
            commitInfo: undefined,
          },
        });
      }
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
          name: HISTORY_AREA_NAMES.STAGE_SIZE,
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
