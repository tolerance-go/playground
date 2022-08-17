import { Divider, Space, Typography } from 'antd';
import { StageSizeManager } from './StageSizeManager';
import { VersionTag } from './VersionTag';

export default () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Space size={'small'}>
        <StageSizeManager />
        {/* <Space>
          <InputNumber
            style={{
              width: 110,
            }}
            addonBefore="宽"
            size="small"
          ></InputNumber>
          <CloseOutlined
            style={{
              fontSize: 10,
            }}
          />
          <InputNumber
            style={{
              width: 110,
            }}
            addonBefore="高"
            size="small"
          ></InputNumber>
        </Space> */}
        <Divider type="vertical" />
        <Typography.Text
          style={{
            marginRight: 10,
          }}
          type="secondary"
        >
          test
        </Typography.Text>
        <VersionTag />
      </Space>
    </div>
  );
};
