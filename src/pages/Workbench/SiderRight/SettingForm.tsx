import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { useModel } from '@umijs/max';
import { Form, Input, Select, Switch } from 'antd';
import consola from 'consola';
import React, { useEffect } from 'react';
import styles from './SettingForm.less';

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
    return <Input value={value} onChange={onChange} />;
  }

  if (config.type === 'select') {
    return (
      <Select
        mode={config.multiple ? 'multiple' : undefined}
        value={value}
        onChange={onChange}
        options={config.options}
      />
    );
  }

  return null;
};

export const SettingForm = () => {
  const { selectNodeMeta } = useModel('selectNodeMeta');
  const { setSettings, settings } = useModel('componentsSettings');
  const { configs } = useModel('componentsSettingConfigs', (model) => ({
    configs: selectNodeMeta?.type
      ? model.componentsConfigs[selectNodeMeta.type]
      : undefined,
  }));

  const [form] = Form.useForm();

  useEffect(() => {
    if (selectNodeMeta && settings[selectNodeMeta.id]) {
      form.setFieldsValue(settings[selectNodeMeta.id]);
    }
  }, [selectNodeMeta?.id]);

  if (!selectNodeMeta) {
    consola.info('本次渲染，未选中元素，返回空');
    return null;
  }

  consola.info('渲染配置表单', configs);

  return (
    <Form
      size={'small'}
      className={styles.wrapper}
      {...{
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      }}
      layout={'horizontal'}
      form={form}
      onValuesChange={(changedValues, values) => {
        consola.success('同步修改组件配置值', values);
        setSettings((prev) => ({
          ...prev,
          [selectNodeMeta.id]: values,
        }));
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
          >
            <SettingInput config={item} />
          </Form.Item>
        );
      })}
    </Form>
  );
};
