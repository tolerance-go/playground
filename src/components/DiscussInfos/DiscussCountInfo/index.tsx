import { useModel } from '@umijs/max';
import { Typography } from 'antd';
import { CSSProperties } from 'react';

export const DiscussCountInfo = (props: { style?: CSSProperties }) => {
  const { filterDiscusses } = useModel('playground', (model) => ({
    filterDiscusses: model.filterDiscusses,
  }));

  return (
    <Typography.Text style={props.style}>
      {filterDiscusses.length} 条讨论
    </Typography.Text>
  );
};
