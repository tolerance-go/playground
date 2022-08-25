import { getAppIdOrThrow } from '@/helps/getAppIdOrThrow';
import { getPageIdOrThrow } from '@/helps/getPageIdOrThrow';
import { PlayCircleTwoTone } from '@ant-design/icons';
import { useSearchParams } from '@umijs/max';
import { Button } from 'antd';

export const PlayAction = () => {
  const [searchParams] = useSearchParams();
  return (
    <Button
      type="text"
      icon={<PlayCircleTwoTone />}
      onClick={() => {
        const pageId = getPageIdOrThrow();
        const appId = getAppIdOrThrow();

        window.open(`/playground?appId=${appId}&pageId=${pageId}`);
      }}
    >
      演示
    </Button>
  );
};
