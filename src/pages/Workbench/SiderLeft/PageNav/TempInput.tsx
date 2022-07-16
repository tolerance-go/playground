import { PageControllerCreate } from '@/services/server/PageController';
import { useModel, useRequest, useSearchParams } from '@umijs/max';
import { Input, message, Spin } from 'antd';

export const TempInput = () => {
  const {
    setCreatePathing,
    pushPath,
    tempInputValue,
    setTempInputValue,
  } = useModel('pageList', (model) => ({
    tempInputValue: model.tempInputValue,
    createPathing: model.createPathing,
    setCreatePathing: model.setCreatePathing,
    pushPath: model.pushPath,
    setTempInputValue: model.setTempInputValue,
    setActivePageId: model.setActivePageId,
  }));

  const [searchParams] = useSearchParams();

  const { loading, run } = useRequest(
    async () => {
      if (tempInputValue) {
        const appId = searchParams.get('appId');

        if (!appId) {
          message.warn('appId 缺失');
          return;
        }

        return await PageControllerCreate({
          path: tempInputValue,
          app_id: appId,
        });
      }
    },
    {
      manual: true,
      onSuccess: (page) => {
        if (page) {
          pushPath(page);
          setCreatePathing(false);
          // setActivePageId(page.id);
        }
      },
    },
  );

  return (
    <Spin spinning={loading}>
      <Input
        autoFocus
        value={tempInputValue}
        size="small"
        onChange={(e) => setTempInputValue(e.target.value)}
        onPressEnter={(e) => {
          /** 防止 Menu 失去 active */
          e.stopPropagation();
          run();
        }}
        onBlur={run}
      ></Input>
    </Spin>
  );
};
