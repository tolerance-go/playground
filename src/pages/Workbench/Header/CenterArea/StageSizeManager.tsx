import BoxSizeInput from '@/components/ConfigsForm/inputs/BoxSizeInput';
import { CloseOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Popover, Space, Typography } from 'antd';

export const StageSizeManager = () => {
  const { stageSize, setStageSize } = useModel('stage.stageSize', (model) => ({
    stageSize: model.stageSize,
    setStageSize: model.changeStageSize,
  }));

  return (
    <Popover
      trigger={['click']}
      content={
        <BoxSizeInput
          debounceTime={350}
          value={stageSize}
          onChange={setStageSize}
        />
      }
    >
      <Typography.Text
        type="secondary"
        style={{
          cursor: 'pointer',
        }}
      >
        {/* px 默认不显示单位，更好看 */}
        <Space size={5}>
          {stageSize?.width?.value
            ? `${stageSize?.width?.value}${
                stageSize.width.unit === 'px' ? '' : stageSize.width.unit ?? ''
              }`
            : 'auto'}
          <CloseOutlined
            style={{
              fontSize: 10,
            }}
          />
          {stageSize?.height?.value
            ? `${stageSize?.height?.value}${
                stageSize.height.unit === 'px'
                  ? ''
                  : stageSize.height.unit ?? ''
              }`
            : 'auto'}
        </Space>
      </Typography.Text>
    </Popover>
  );
};
