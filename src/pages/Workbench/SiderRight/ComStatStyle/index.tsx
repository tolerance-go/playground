import { ConfigsForm } from '@/components/ConfigsForm';
import { useSelectedComStyleConfigs } from '@/hooks/useSelectedComStyleConfigs';
import { Form, Row } from 'antd';

export default () => {
  const { configs } = useSelectedComStyleConfigs();
  const [form] = Form.useForm();

  return (
    <Row
      style={{
        flexDirection: 'column',
        height: '100%',
        alignItems: 'stretch',
      }}
      wrap={false}
    >
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
          // consola.success('同步修改组件配置值', values);
          // setCurrentComSettingsExtendsSettings(values);
          // debounceTriggerPrepareSaveTimeChange();
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
        // configInputProps={(item) => {
        //   const disabled = extendRelation
        //     ? /**
        //        * 锁住表示不自动同步，那么用户就是可以自定义输入的
        //        * 这里和界面的图标是相反的
        //        */
        //       !extendRelation.lockFields[item.name]
        //     : false;
        //   return {
        //     disabled,
        //     bordered: false,
        //   };
        // }}
      ></ConfigsForm>
    </Row>
  );
};
