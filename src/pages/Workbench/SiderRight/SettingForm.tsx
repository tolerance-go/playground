import { useComponentSettings } from '@/hooks/useComponentSettings';
import { useSelectedNodeMeta } from '@/hooks/useSelectedNode';
import { SegmentedPropsPicked } from '@/typings/SegmentedProps';
import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { useModel } from '@umijs/max';
import { Form, Input, Segmented, Select, Switch } from 'antd';
import consola from 'consola';
import React, { useEffect } from 'react';
import styles from './SettingForm.less';

export const SegmentedSwitch = ({
  value,
  onChange,
  ...rest
}: {
  value?: boolean;
  onChange?: (next: boolean) => void;
} & Omit<SegmentedPropsPicked, 'value' | 'onChange' | 'options'>) => {
  return (
    <Segmented
      block
      {...rest}
      options={[
        {
          label: '是',
          value: 'true',
        },
        {
          label: '否',
          value: 'false',
        },
      ]}
      value={String(value)}
      onChange={(next) => {
        onChange?.(next === 'true');
      }}
    />
  );
};

const SettingInputs: Record<string, React.ElementType<any>> = {
  string: Input,
  boolean: Switch,
  select: Select,
};

const SettingInput = ({
  config,
  value,
  onChange,
}: {
  config: SettingFormConfig[number];
  value?: any;
  onChange?: (next: any) => void;
}) => {
  if (config.type === 'string') {
    return <Input bordered={false} value={value} onChange={onChange} />;
  }

  if (config.type === 'select') {
    return (
      <Select
        mode={config.multiple ? 'multiple' : undefined}
        value={value}
        onChange={onChange}
        options={config.options}
        bordered={false}
      />
    );
  }

  if (config.type === 'boolean') {
    return <SegmentedSwitch value={value} onChange={onChange} />;
  }

  return null;
};

export const SettingForm = () => {
  const { stageSelectNode: selectNodeMeta } = useSelectedNodeMeta();

  const { setComSettingsInCurrent } = useModel('statusSettings', (model) => ({
    setComSettingsInCurrent: model.setComSettingsInCurrent,
  }));

  const { settings } = useComponentSettings(selectNodeMeta?.id);
  const { componentsConfigs } = useModel(
    'componentsSettingConfigs',
    (model) => {
      consola.info('准备返回渲染配置', selectNodeMeta, model);
      return {
        componentsConfigs: model?.componentsConfigs,
      };
    },
  );

  const configs = selectNodeMeta?.type
    ? componentsConfigs[selectNodeMeta.type]
    : undefined;

  const [form] = Form.useForm();

  useEffect(() => {
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [selectNodeMeta?.id]);

  if (!selectNodeMeta) {
    consola.info('本次渲染，未选中元素，返回空');
    return null;
  }

  consola.info('渲染配置表单', configs);

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
        setComSettingsInCurrent(values);
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
            label={item.label}
            name={item.name}
            colon={false}
          >
            <SettingInput config={item} />
          </Form.Item>
        );
      })}
    </Form>
  );
};
