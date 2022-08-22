import { DiscussTag } from '@/components/DiscussTag';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Button, Input, Popover, Space } from 'antd';
import { useEffect, useState } from 'react';

export const TempDiscussItem = () => {
  const { tempDiscuss, setTempDiscuss, requestCreateDiscuss } = useModel(
    'playground',
    (model) => ({
      tempDiscuss: model.tempDiscuss,
      setTempDiscuss: model.setTempDiscuss,
      requestCreateDiscuss: model.requestCreateDiscuss,
    }),
  );

  const [value, setValue] = useState('');

  const createDiscuss = useMemoizedFn(() => {
    if (!tempDiscuss) return;
    if (!value) return;

    requestCreateDiscuss(
      {
        ...tempDiscuss,
        title: value,
      },
      {
        onSuccess: () => {
          setValue('');
        },
      },
    );
  });

  useEffect(() => {
    if (tempDiscuss === undefined) {
      setValue('');
    }
  }, [tempDiscuss]);

  return tempDiscuss ? (
    <Popover
      placement="right"
      destroyTooltipOnHide
      key={JSON.stringify({
        top: tempDiscuss.top,
        left: tempDiscuss.left,
      })}
      content={
        <Space>
          <Input
            maxLength={50}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            value={value}
            placeholder="请输入讨论标题"
            bordered={false}
            size="large"
            style={{
              width: 200,
            }}
            onPressEnter={() => {
              createDiscuss();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setTempDiscuss(undefined);
              }
            }}
          ></Input>
          <Button
            // size="small"
            shape="circle"
            icon={<CloseOutlined />}
            onClick={() => {
              setTempDiscuss(undefined);
            }}
          ></Button>
          <Button
            // size="small"
            type="primary"
            disabled={!value}
            shape="circle"
            icon={<CheckOutlined />}
            onClick={() => {
              createDiscuss();
            }}
          ></Button>
        </Space>
      }
      visible
    >
      <DiscussTag
        type={tempDiscuss.createdSuccess ? 'default' : 'dashed'}
        top={tempDiscuss.top}
        left={tempDiscuss.left}
      />
    </Popover>
  ) : null;
};
