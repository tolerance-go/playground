import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import ComStatusTreeDrawerTrigger from './ComStatusTreeDrawerTrigger';

export default () => {
  return (
    <Dropdown
      overlay={
        <Menu
          items={[
            {
              key: 'settings',
              label: <ComStatusTreeDrawerTrigger></ComStatusTreeDrawerTrigger>,
            },
          ]}
        />
      }
    >
      <MoreOutlined
        style={{
          marginLeft: 15,
        }}
      />
    </Dropdown>
  );
};
