import { VersionControllerCreate } from '@/services/server/VersionController';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { useModel, useSearchParams } from '@umijs/max';
import { Button, message } from 'antd';

export default () => {
  const [searchParams] = useSearchParams();

  const { pushFromStart } = useModel('app.versionList', (model) => ({
    pushFromStart: model?.pushFromStart,
  }));

  const { pageList } = useModel('page.pageList', (model) => ({
    pageList: model?.pageList,
  }));

  const { setActiveVersionId } = useModel('app.versionList', (model) => ({
    setActiveVersionId: model?.setActiveVersionId,
  }));

  return (
    <ModalForm<{
      name: string;
    }>
      title="发布并保存新版本"
      trigger={<Button type="primary">发布</Button>}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => console.log('run'),
        zIndex: 9999,
        width: '20%',
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        const appId = searchParams.get('appId');
        if (!appId) {
          message.warn('appId 缺失');
          return false;
        }
        try {
          const data = await VersionControllerCreate({
            name: values.name,
            app_id: appId,
            pageIds: pageList?.map((page) => page.id),
          });
          if (data) {
            pushFromStart(data);
            setActiveVersionId(data.id);
          }
          message.success('版本保存成功');
          return true;
        } catch {
          return false;
        }
      }}
    >
      <ProFormText
        name="name"
        label="版本号"
        placeholder="请输入名称 eg: 1.0.0"
        rules={[
          {
            required: true,
          },
        ]}
      />
    </ModalForm>
  );
};
