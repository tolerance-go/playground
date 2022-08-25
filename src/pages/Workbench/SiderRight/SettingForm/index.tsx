import { ConfigsForm } from '@/components/ConfigsForm';
import { FormItemExtendLabel } from '@/components/FormItemExtendLabel';
import { useComActiveStatSetting } from '@/hooks/useComActiveStatSetting';
import { useComStatusExtendSettings } from '@/hooks/relations/useComStatusExtendSettings';
import { useDebounceTriggerPrepareSaveTimeChange } from '@/hooks/actions/useDebounceTriggerPrepareSaveTimeChange';
import { useComStatFormReset } from '@/hooks/useComStatFormReset';
import { useSelectedComActiveStatExtendRelation } from '@/hooks/selected/useSelectedComActiveStatExtendRelation';
import { useSelectedComSettingsConfigs } from '@/hooks/selected/useSelectedComSettingsConfigs';
import { useSelectedNode } from '@/hooks/selected/useSelectedNode';
import { useModel } from '@umijs/max';
import { Form } from 'antd';
import consola from 'consola';

// const SettingInputs: Record<string, React.ElementType<any>> = {
//   string: Input,
//   boolean: Switch,
//   select: Select,
// };

export const SettingForm = () => {
  const { stageSelectNode } = useSelectedNode();
  const { configs } = useSelectedComSettingsConfigs();

  const { settings } = useComActiveStatSetting(stageSelectNode?.id);

  const { setCurrentComSettingsExtendsSettings } = useComStatusExtendSettings();

  const { extendRelation } = useSelectedComActiveStatExtendRelation();

  const [form] = Form.useForm();

  const { debounceTriggerPrepareSaveTimeChange } =
    useDebounceTriggerPrepareSaveTimeChange();

  const { triggerPrepareSaveTimeChange } = useModel(
    'app.stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  const { lockComExtendField, unlockComExtendField } = useModel(
    'page.statusConnectRelations',
    (model) => ({
      lockComExtendField: model.lockComExtendSettingField,
      unlockComExtendField: model.unlockComExtendSettingField,
    }),
  );

  // /** 先执行 reset 再执行 setFieldsValue */
  // useEffect(() => {
  //   form.resetFields();
  //   form.setFieldsValue(getSetting());
  // }, [selectedComponentStatusId]);

  useComStatFormReset(form, settings);

  if (!stageSelectNode) {
    consola.info('本次渲染，未选中元素，返回空');
    return null;
  }

  return (
    <ConfigsForm
      configs={configs}
      labelCol={{
        span: 7,
      }}
      wrapperCol={{
        span: 17,
      }}
      theme="dark-area"
      layout={'horizontal'}
      form={form}
      requiredMark={false}
      onValuesChange={(changedValues, values) => {
        consola.success('同步修改组件配置值', values);
        setCurrentComSettingsExtendsSettings(values);
        debounceTriggerPrepareSaveTimeChange();
      }}
      renderLabel={(item) => {
        if (!extendRelation) {
          return <span>{item.label}</span>;
        }

        return (
          <FormItemExtendLabel
            lockFields={extendRelation.settingUnsyncFields}
            fieldName={item.name}
            label={item.label}
            onUnLockClick={() => {
              unlockComExtendField(
                stageSelectNode.id,
                extendRelation.id,
                item.name,
              );
              triggerPrepareSaveTimeChange();
            }}
            onLockClick={() => {
              lockComExtendField(
                stageSelectNode.id,
                extendRelation.id,
                item.name,
              );
              triggerPrepareSaveTimeChange();
            }}
          ></FormItemExtendLabel>
        );
      }}
      configInputProps={(item) => {
        const disabled = extendRelation
          ? /**
             * 锁住表示不自动同步，那么用户就是可以自定义输入的
             * 这里和界面的图标是相反的
             */
            !extendRelation.settingUnsyncFields[item.name]
          : false;
        return {
          disabled,
          bordered: false,
        };
      }}
    ></ConfigsForm>
  );
};
