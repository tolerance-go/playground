import { useModel } from '@umijs/max';
import { useSelectedComponentStatus } from './useSelectedComponentStatus';

/** 获取当前选中组件的所有配置状态 */
export const useSelectedComponentActiveStatus = () => {
  const { status } = useSelectedComponentStatus();

  const { selectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  if (status && selectedComponentStatusId) {
    return {
      stat: status[selectedComponentStatusId],
    };
  }

  return {
    stat: undefined,
  };
};
