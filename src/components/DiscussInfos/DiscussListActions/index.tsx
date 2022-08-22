import { useModel } from '@umijs/max';
import { ButtonProps, Select } from 'antd';

export const DiscussListActions = (props: { size?: ButtonProps['size'] }) => {
  const {
    requestResolvedDiscussLoading,
    selectedDiscuss,
    requestDeleteDiscuss,
    detailMode,
    requestResolvedDiscuss,
    detailListFilterMode,
    setDetailListFilterMode,
    setSelectedDiscussId,
    selectedNextItem,
  } = useModel('playground', (model) => ({
    requestDeleteDiscuss: model.requestDeleteDiscuss,
    requestResolvedDiscuss: model.requestResolvedDiscuss,
    requestResolvedDiscussLoading: model.requestResolvedDiscussLoading,
    selectedDiscuss: model.selectedDiscuss,
    detailMode: model.detailMode,
    detailListFilterMode: model.detailListFilterMode,
    setDetailListFilterMode: model.setDetailListFilterMode,
    setSelectedDiscussId: model.setSelectedDiscussId,
    selectedNextItem: model.selectedNextItem,
  }));

  return (
    <Select
      size={props.size}
      onChange={(val) => setDetailListFilterMode(val)}
      value={detailListFilterMode}
      options={[
        {
          label: '已解决',
          value: 'resolved',
        },
        {
          label: '未解决',
          value: 'open',
        },
      ]}
    ></Select>
  );
};
