import { useMemoizedFn } from 'ahooks';
import { Button, ButtonProps, Popconfirm, PopconfirmProps } from 'antd';
import { useState } from 'react';

export const RequestButton = <P extends any>(
  props: ButtonProps & {
    request?: () => Promise<{ success: boolean; params?: P }>;
    onSuccess?: (params?: P) => void;
    popconfirm?: PopconfirmProps;
  },
) => {
  const [loading, setLoading] = useState(false);

  const requestFn = useMemoizedFn(async () => {
    if (props.request) {
      setLoading(true);
      const result = await props.request();
      if (result.success) {
        props.onSuccess?.(result.params);
      }
      setLoading(false);
    }
  });

  if (props.popconfirm) {
    return (
      <Popconfirm {...props.popconfirm} onConfirm={requestFn}>
        <Button {...props} loading={loading}></Button>
      </Popconfirm>
    );
  }

  return (
    <Button
      {...props}
      loading={loading}
      onClick={async (event) => {
        props.onClick?.(event);
        requestFn();
      }}
    ></Button>
  );
};
