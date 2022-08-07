import { useModel } from '@umijs/max';
import { useComStatusExtendProps } from './__utils/useComStatusExtendProps';

/** 组件继承状态修改 */
export const useComStatusExtendActions = () => {
  const { setComStatActionWithName, updateComStatActionWithName } = useModel(
    'comsActions',
    (model) => ({
      setComStatActionWithName: model.setComStatActionWithName,
      updateComStatActionWithName: model.updateComStatActionWithName,
    }),
  );

  const { getStatLockActionFields } = useModel('statusRelations', (model) => ({
    getStatLockActionFields: model.getStatLockActionFields,
  }));

  const {
    setComExtendsProps: setComExtendsActions,
    setCurrentComPropsExtendsProps: setCurrentComActionsExtendsActions,
  } = useComStatusExtendProps({
    getStatLockFields: getStatLockActionFields,
    updateComStatProps: updateComStatActionWithName,
    setComStatProps: setComStatActionWithName,
  });

  return {
    setCurrentComActionsExtendsActions,
    setComExtendsActions,
  };
};
