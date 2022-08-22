import { useModel } from '@umijs/max';
import { Typography } from 'antd';
import { useRef, useState } from 'react';

export const ParagraphItem = () => {
  const { selectedDiscuss, updateSelectedDiscussContent } = useModel(
    'playground',
    (model) => ({
      selectedDiscuss: model.selectedDiscuss,
      updateSelectedDiscussContent: model.updateSelectedDiscussContent,
    }),
  );

  const text = selectedDiscuss?.desc;

  const valueRef = useRef<string | undefined>(text);

  const [value, setValue] = useState(text);

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
        onEnd: () => {
          updateSelectedDiscussContent({
            desc: valueRef.current,
          });
        },
        onChange(value) {
          valueRef.current = value;
          /** setValue 在 onEnd 的时候，拿不到最新 */
          setValue(value);
        },
      }}
    >
      {!text ? (
        <Typography.Text type="secondary">描述信息</Typography.Text>
      ) : (
        value || text
      )}
    </Typography.Paragraph>
  );
};
