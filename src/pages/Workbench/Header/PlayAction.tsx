import { PlayCircleTwoTone } from '@ant-design/icons';
import { useSearchParams } from '@umijs/max';
import { Button, message } from 'antd';

export const PlayAction = () => {
  const [searchParams] = useSearchParams();
  return (
    <Button
      type="text"
      icon={<PlayCircleTwoTone />}
      onClick={() => {
        const appId = searchParams.get('appId');
        const pageId = searchParams.get('pageId');

        if (!appId) {
          message.warn('appId 缺失，无法正常跳转，请检查访问地址');
          return;
        }

        if (!pageId) {
          message.warn('pageId 缺失，无法正常跳转，请检查访问地址');
          return;
        }

        window.open(`/playground?appId=${appId}&pageId=${pageId}`);
      }}
    >
      演示
    </Button>
  );
};
