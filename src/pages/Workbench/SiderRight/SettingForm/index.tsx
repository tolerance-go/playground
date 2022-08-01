import { useComponentSettings } from '@/hooks/useComponentSettings';
import { useComStatusExtendSettings } from '@/hooks/useComStatusExtendSettings';
import { useCurrentComStatExtendRelation } from '@/hooks/useCurrentComStatExtendRelation';
import { useSelectedComSettingsConfigs } from '@/hooks/useSelectedComSettingsConfigs';
import { useSelectedNode } from '@/hooks/useSelectedNode';
import { useModel } from '@umijs/max';
import { Form, Input, Select, Switch } from 'antd';
import consola from 'consola';
import utl from 'lodash';
import React, { useEffect, useMemo } from 'react';
import styles from './index.less';
import { SettingInput } from './SettingInput';
import { SettingInputLabel } from './SettingInputLabel';

const SettingInputs: Record<string, React.ElementType<any>> = {
  string: Input,
  boolean: Switch,
  select: Select,
};

export const SettingForm = () => {
  const { stageSelectNode } = useSelectedNode();
  const { configs } = useSelectedComSettingsConfigs();
  const { setSelectedComSettings } = useModel('statusSettings', (model) => ({
    setSelectedComSettings: model.setSelectedComSettings,
  }));

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
    <Form
      // size={'small'}
      className={styles.wrapper}
      {...{
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
      }}
      layout={'horizontal'}
      form={form}
      requiredMark={false}
      onValuesChange={(changedValues, values) => {
        consola.success('同步修改组件配置值', values);
        setCurrentComSettingsExtendsSettings(values);
        debounceTriggerPrepareSaveTimeChange();
      }}
    >
      {configs?.map((item) => {
        if (SettingInputs[item.type] === undefined) {
          return null;
        }
        return (
          <Form.Item
            required={item.required}
            key={item.name}
            label={
              <SettingInputLabel
                comId={stageSelectNode.id}
                extendRelation={extendRelation}
                fieldName={item.name}
                label={item.label}
              ></SettingInputLabel>
            }
            name={item.name}
            colon={false}
          >
            <SettingInput
              extendRelation={extendRelation}
              fieldName={item.name}
              config={item}
            />
          </Form.Item>
        );
      })}
    </Form>
  );
};
