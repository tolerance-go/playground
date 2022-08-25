import { ConfigsForm } from '@/components/ConfigsForm';
import { FormItemExtendLabel } from '@/components/FormItemExtendLabel';
import { useComStatusExtendStyles } from '@/hooks/relations/useComStatusExtendStyles';
import { useDebounceTriggerPrepareSaveTimeChange } from '@/hooks/actions/useDebounceTriggerPrepareSaveTimeChange';
import { useComStatFormReset } from '@/hooks/useComStatFormReset';
import { useSelectedComActiveStatExtendRelation } from '@/hooks/selected/useSelectedComActiveStatExtendRelation';
import { useSelectedComActiveStatStyle } from '@/hooks/selected/useSelectedComActiveStatStyle';
import { useSelectedComStyleConfigs } from '@/hooks/selected/useSelectedComStyleConfigs';
import { useSelectedNode } from '@/hooks/selected/useSelectedNode';
import { useModel } from '@umijs/max';
import { Form } from 'antd';

export default () => {
  const { configs } = useSelectedComStyleConfigs();
  const [form] = Form.useForm();

  const { stageSelectNode } = useSelectedNode();

  const { setCurrentComStylesExtendsStyles } = useComStatusExtendStyles();

  const { triggerPrepareSaveTimeChange } = useModel(
    'app.stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  const { debounceTriggerPrepareSaveTimeChange } =
    useDebounceTriggerPrepareSaveTimeChange();

  const { style } = useSelectedComActiveStatStyle(stageSelectNode?.id);
  const { extendRelation } = useSelectedComActiveStatExtendRelation();

  const { lockComExtendStyleField, unlockComExtendStyleField } = useModel(
    'page.statusConnectRelations',
    (model) => ({
      lockComExtendStyleField: model.lockComExtendStyleField,
      unlockComExtendStyleField: model.unlockComExtendStyleField,
    }),
  );

  useComStatFormReset(form, style);

  if (!stageSelectNode) {
    return null;
  }

  return (
    <ConfigsForm
      configs={configs}
      // className={styles.wrapper}
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
        setCurrentComStylesExtendsStyles(values);
        debounceTriggerPrepareSaveTimeChange();
      }}
      renderLabel={(item) => {
        if (!extendRelation) {
          return <span>{item.label}</span>;
        }

        return (
          <FormItemExtendLabel
            lockFields={extendRelation.styleUnsyncFields}
            fieldName={item.name}
            label={item.label}
            onUnLockClick={() => {
              unlockComExtendStyleField(
                stageSelectNode.id,
                extendRelation.id,
                item.name,
              );
              triggerPrepareSaveTimeChange();
            }}
            onLockClick={() => {
              lockComExtendStyleField(
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
            !extendRelation.styleUnsyncFields[item.name]
          : false;
        return {
          disabled,
          bordered: false,
        };
      }}
    ></ConfigsForm>
  );
};
