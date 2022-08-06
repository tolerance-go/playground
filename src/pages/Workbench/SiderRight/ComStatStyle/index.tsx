import { ConfigsForm } from '@/components/ConfigsForm';
import { useDebounceTriggerPrepareSaveTimeChange } from '@/hooks/useDebounceTriggerPrepareSaveTimeChange';
import { useSelectedComActiveStatStyle } from '@/hooks/useSelectedComActiveStatStyle';
import { useSelectedComStyleConfigs } from '@/hooks/useSelectedComStyleConfigs';
import { useSelectedNode } from '@/hooks/useSelectedNode';
import { useModel } from '@umijs/max';
import { Form } from 'antd';
import { useEffect } from 'react';

export default () => {
  const { configs } = useSelectedComStyleConfigs();
  const [form] = Form.useForm();

  const { stageSelectNode } = useSelectedNode();

  const { setComponentStyle } = useModel('comsStyles', (model) => ({
    setComponentStyle: model.setComponentStyle,
  }));

  const { getSelectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      getSelectedComponentStatusId: model.getSelectedComponentStatusId,
    }),
  );

  const { getStageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    getStageSelectNodeId: model.getStageSelectNodeId,
  }));

  const { debounceTriggerPrepareSaveTimeChange } =
    useDebounceTriggerPrepareSaveTimeChange();

  const { style } = useSelectedComActiveStatStyle(stageSelectNode?.id);

  useEffect(() => {
    if (style) {
      form.setFieldsValue(style);
    }
  }, [style]);

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
      layout={'horizontal'}
      form={form}
      requiredMark={false}
      onValuesChange={(changedValues, values) => {
        const selectedComponentStatusId = getSelectedComponentStatusId();
        const stageSelectNodeId = getStageSelectNodeId();

        if (stageSelectNodeId && selectedComponentStatusId) {
          setComponentStyle(
            stageSelectNodeId,
            selectedComponentStatusId,
            values,
          );
        }
        // consola.success('同步修改组件配置值', values);
        // setCurrentComSettingsExtendsSettings(values);
        debounceTriggerPrepareSaveTimeChange();
      }}
      // renderLabel={(item) => {
      //   return (
      //     <SettingInputLabel
      //       comId={stageSelectNode.id}
      //       extendRelation={extendRelation}
      //       fieldName={item.name}
      //       label={item.label}
      //     ></SettingInputLabel>
      //   );
      // }}
      configInputProps={() => {
        // const disabled = extendRelation
        //   ? /**
        //      * 锁住表示不自动同步，那么用户就是可以自定义输入的
        //      * 这里和界面的图标是相反的
        //      */
        //     !extendRelation.lockFields[item.name]
        //   : false;
        return {
          // disabled,
          bordered: false,
        };
      }}
    ></ConfigsForm>
  );
};
