import { PageControllerUpdate } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useClickAway, useEventTarget, useRequest } from 'ahooks';
import { Input, Spin } from 'antd';
import { useRef } from 'react';

export default ({ item }: { item: API.ShownPage }) => {
  const { updatePath } = useModel('page.pageList', (model) => ({
    updatePath: model.updatePath,
  }));

  const { stopUpdating } = useModel('page.pageUpdatingMeta', (model) => ({
    stopUpdating: model.stopUpdating,
  }));

  const [value, { onChange }] = useEventTarget({
    initialValue: item.path,
  });

  const { loading, run } = useRequest(
    async (value) => {
      return PageControllerUpdate(
        {
          id: item.id,
        },
        {
          path: value,
        },
      );
    },
    {
      manual: true,
      loadingDelay: 300,
      onSuccess: (page) => {
        updatePath(page.id, page);
        stopUpdating();
      },
    },
  );

  const ref = useRef<HTMLDivElement>(null);

  useClickAway(() => {
    run(value);
  }, ref);

  return (
    <Spin spinning={loading}>
      <div ref={ref}>
        <Input
          autoFocus
          value={value}
          onChange={onChange}
          size="small"
          onPressEnter={(e) => {
            /** 防止 Menu 失去 active */
            e.stopPropagation();
            run(value);
          }}
          onBlur={run}
        ></Input>
      </div>
    </Spin>
  );
};
