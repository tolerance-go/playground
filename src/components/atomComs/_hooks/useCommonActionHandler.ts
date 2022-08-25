import { EventHandlerParams } from '@/domains/StageEventManager';
import { ComponentAction } from '@/models/comsActions';
import { SwitchStatusAction } from '@/typings/actions';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';

export const useCommonActionHandler = () => {
  const { getComStatAction } = useModel('page.comsActions', (model) => ({
    getComStatAction: model.getComStatAction,
  }));

  const { setComStatusSettingsUsed } = useModel(
    'page.statusSettingsUsed',
    (model) => ({
      setComStatusSettingsUsed: model.setComStatusSettingsUsed,
    }),
  );

  const commonActionHandler = useMemoizedFn(
    (params: EventHandlerParams, extra?: (action: ComponentAction) => void) => {
      const { event } = params;
      const action = getComStatAction(
        event.execComId,
        event.execComStatId,
        event.execComStatActionId,
      );

      if (action.type === 'switchStatus') {
        const act = action as SwitchStatusAction;
        setComStatusSettingsUsed(
          act.settings.targetComId,
          act.settings.targetStatId,
        );
      }

      extra?.(action);
    },
  );

  return {
    commonActionHandler,
  };
};
