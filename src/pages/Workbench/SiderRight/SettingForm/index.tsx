import { ConfigsForm } from '@/components/ConfigsForm';
import { useComponentSettings } from '@/hooks/useComponentSettings';
import { useComStatusExtendSettings } from '@/hooks/useComStatusExtendSettings';
import { useCurrentComStatExtendRelation } from '@/hooks/useCurrentComStatExtendRelation';
import { useSelectedComSettingsConfigs } from '@/hooks/useSelectedComSettingsConfigs';
import { useSelectedNode } from '@/hooks/useSelectedNode';
import { useModel } from '@umijs/max';
import { Form } from 'antd';
import consola from 'consola';
import utl from 'lodash';
import { useEffect, useMemo } from 'react';
import styles from './index.less';
import { SettingInputLabel } from './SettingInputLabel';

// const SettingInputs: Record<string, React.ElementType<any>> = {
//   string: Input,
//   boolean: Switch,
//   select: Select,
// };

export const SettingForm = () => {
  const { stageSelectNode } = useSelectedNode();
  const { configs } = useSelectedComSettingsConfigs();

  const { settings } = useComponentSettings(stageSelectNode?.id);

  const { setCurrentComSettingsExtendsSettings } = useComStatusExtendSettings();

  const { extendRelation } = useCurrentComStatExtendRelation();

  const [form] = Form.useForm();

  const { triggerPrepareSaveTimeChange } = useModel(
    'stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  const debounceTriggerPrepareSaveTimeChange = useMemo(() => {
    return utl.debounce(triggerPrepareSaveTimeChange, 350);
  }, [triggerPrepareSaveTimeChange]);

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [settings]);

  if (!stageSelectNode) {
    consola.info('本次渲染，未选中元素，返回空');
    return null;
  }

  return (
    <ConfigsForm
      configs={configs}
      className={styles.wrapper}
      labelCol={{
        span: 7,
      }}
      wrapperCol={{
        span: 17,
      }}
      layout={'horizontal'}
      form={form}
      requiredMark={false}
      onValuesChange={(changedValues, values) => {
        consola.success('同步修改组件配置值', values);
        setCurrentComSettingsExtendsSettings(values);
        debounceTriggerPrepareSaveTimeChange();
      }}
      renderLabel={(item) => {
        return (
          <SettingInputLabel
            comId={stageSelectNode.id}
            extendRelation={extendRelation}
            fieldName={item.name}
            label={item.label}
          ></SettingInputLabel>
        );
      }}
      configInputProps={(item) => {
        const disabled = extendRelation
          ? /**
             * 锁住表示不自动同步，那么用户就是可以自定义输入的
             * 这里和界面的图标是相反的
             */
            !extendRelation.lockFields[item.name]
          : false;
        return {
          disabled,
          bordered: false,
        };
      }}
    ></ConfigsForm>
  );
};
