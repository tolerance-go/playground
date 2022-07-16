import { useSearchParams } from '@/.umi/exports';
import Stage from '@/components/Stage';
import { useInitSatgeData } from '@/hooks/useInitSatgeData';
import { message } from 'antd';
import { useEffect } from 'react';

export default function App() {
  const [searchParams] = useSearchParams();

  const { initStageData } = useInitSatgeData();

  useEffect(() => {
    /** 同步 url，下次刷新页面的时候可以记住 */
    const pageId = searchParams.get('pageId');

    if (!pageId) {
      message.warn('pageID 缺失，无法正常渲染');
      return;
    }

    initStageData(pageId);
  }, []);

  return <Stage />;
}
