import { useModel } from '@umijs/max';
import { useComStatusExtendProps } from '../__utils/useComStatusExtendProps';

/** 组件继承状态修改 */
export const useComStatusExtendStyles = () => {
  const { setComStatStyle, updateComStatStyle } = useModel(
    'page.comsStyles',
    (model) => ({
      setComStatStyle: model.setComStatStyle,
      updateComStatStyle: model.updateComStatStyle,
    }),
  );

  const { getStatLockStyleFields } = useModel('page.statusConnectRelations', (model) => ({
    getStatLockStyleFields: model.getStatLockStyleFields,
  }));

  const {
    setComExtendsProps: setComExtendsStyles,
    setCurrentComPropsExtendsProps: setCurrentComStylesExtendsStyles,
  } = useComStatusExtendProps({
    getStatLockFields: getStatLockStyleFields,
    updateComStatProps: updateComStatStyle,
    setComStatProps: setComStatStyle,
  });

  return {
    setCurrentComStylesExtendsStyles,
    setComExtendsStyles,
  };
};
