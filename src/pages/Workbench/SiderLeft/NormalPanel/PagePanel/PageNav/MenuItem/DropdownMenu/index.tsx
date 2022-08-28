import { Menu } from 'antd';
import CopyItem from './CopyItem';
import DeleteItem from './DeleteItem';
import UpdatePathItem from './UpdatePathItem';

export default ({ item }: { item: API.ShownPage }) => {
  return (
    <Menu
      onClick={(info) => {
        /** 防止 Menu item active 变换 */
        info.domEvent.stopPropagation();
      }}
      items={[
        // {
        //   label: '设置',
        //   key: 'settings',
        // },
        // {
        //   type: 'divider',
        // },
        {
          label: <UpdatePathItem item={item} />,
          key: 'change',
        },
        {
          label: <CopyItem item={item} />,
          key: 'copy',
        },
        {
          label: <DeleteItem item={item} />,
          key: 'delete',
        },
      ]}
    ></Menu>
  );
};
