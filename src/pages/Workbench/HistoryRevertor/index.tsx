import { useModel } from '@umijs/max';
import { Spin } from 'antd';
import { PropsWithChildren } from 'react';

export const HistoryRevertor = (props: PropsWithChildren) => {
  const { reverting } = useModel('app.appStateHistory', (model) => ({
    reverting: model.reverting,
  }));

  return <Spin spinning={reverting}>{props.children}</Spin>;
};
