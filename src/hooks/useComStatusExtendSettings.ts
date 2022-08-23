import { useModel } from '@umijs/max';
import { useComStatusExtendProps } from './__utils/useComStatusExtendProps';

/** 组件继承状态修改 */
export const useComStatusExtendSettings = () => {
  const { setComStatSetting, updateComStatSetting } = useModel(
    'comsSettings',
    (model) => ({
      setComStatSetting: model.setComStatSetting,
      updateComStatSetting: model.updateComStatSetting,
    }),
  );

  const { getStatLockSettingFields } = useModel('statusConnectRelations', (model) => ({
    getStatLockSettingFields: model.getStatLockSettingFields,
  }));

  const {
    setComExtendsProps: setComExtendsSettings,
    setCurrentComPropsExtendsProps: setCurrentComSettingsExtendsSettings,
  } = useComStatusExtendProps({
    getStatLockFields: getStatLockSettingFields,
    updateComStatProps: updateComStatSetting,
    setComStatProps: setComStatSetting,
  });

  return {
    setCurrentComSettingsExtendsSettings,
    setComExtendsSettings,
  };
};
