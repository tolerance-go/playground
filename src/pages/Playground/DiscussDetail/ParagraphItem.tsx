import { Typography } from 'antd';

export const ParagraphItem = () => {
  return (
    <Typography.Paragraph
      ellipsis={{
        rows: 5,
        expandable: true,
        symbol: '展开',
      }}
      editable={{
        maxLength: 200,
        autoSize: {
          maxRows: 8,
        },
      }}
    >
      <Typography.Text type="secondary">描述信息</Typography.Text>
    </Typography.Paragraph>
  );
};
