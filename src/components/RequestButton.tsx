import { useMemoizedFn } from 'ahooks';
import { Button, ButtonProps, Popconfirm, PopconfirmProps } from 'antd';
import { useState } from 'react';

export const RequestButton = <P extends any>({
  request,
  onSuccess,
  popconfirm,
  ...buttonProps
}: ButtonProps & {
  request?: () => Promise<{ success: boolean; params?: P }>;
  onSuccess?: (params?: P) => void;
  popconfirm?: PopconfirmProps;
}) => {
  const [loading, setLoading] = useState(false);

  const requestFn = useMemoizedFn(async () => {
    if (request) {
      setLoading(true);
      const result = await request();
      if (result.success) {
        onSuccess?.(result.params);
      }
      setLoading(false);
    }
  });

  if (popconfirm) {
    return (
      <Popconfirm {...popconfirm} onConfirm={requestFn}>
        <Button {...buttonProps} loading={loading}></Button>
      </Popconfirm>
    );
  }

  return (
    <Button
      {...buttonProps}
      loading={loading}
      onClick={async (event) => {
        buttonProps.onClick?.(event);
        requestFn();
      }}
    ></Button>
  );
};
