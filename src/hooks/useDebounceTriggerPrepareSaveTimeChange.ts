import utl from 'lodash';
import { useMemo } from 'react';
import { useModel } from '@umijs/max';

export const useDebounceTriggerPrepareSaveTimeChange = () => {
  const { triggerPrepareSaveTimeChange } = useModel(
    'stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  const debounceTriggerPrepareSaveTimeChange = useMemo(() => {
    return utl.debounce(triggerPrepareSaveTimeChange, 350);
  }, [triggerPrepareSaveTimeChange]);

  return {
    debounceTriggerPrepareSaveTimeChange,
  };
};
