import { useInitialState } from '@/hooks/useInitialState';
import { PageControllerCreate } from '@/services/server/PageController';
import { useModel } from '@umijs/max';
import { useClickAway, useEventTarget, useRequest } from 'ahooks';
import { Input, Spin } from 'antd';
import { useRef } from 'react';

export const TempInput = () => {
  const { pushPath } = useModel('page.pageList', (model) => ({
    pushPath: model.pushPath,
  }));

  const { choosePageId } = useModel('page.selectedPageId', (model) => ({
    choosePageId: model.choosePageId,
  }));

  const { creatingMeta, stopTempInput } = useModel(
    'page.pageCreatingMeta',
    (model) => ({
      creatingMeta: model.creatingMeta,
      stopTempInput: model.stopTempInput,
    }),
  );

  const [value, { onChange }] = useEventTarget({
    initialValue: creatingMeta.defaultInputValue,
  });

  const { initialState } = useInitialState();

  const { loading, run } = useRequest(
    async (value) => {
      return PageControllerCreate({
        path: value,
        appId: initialState.appId,
      });
    },
    {
      loadingDelay: 300,
      manual: true,
      onSuccess: (page) => {
        pushPath(page);
        choosePageId(page.id);
        stopTempInput();
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
          defaultValue={creatingMeta.defaultInputValue}
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
