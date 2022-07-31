import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import ComStatusTreeDrawerTrigger from './ComStatusTreeDrawerTrigger';
import StatusSettingsTrigger from './StatusSettingsTrigger';

export default () => {
  return (
    <Dropdown
      overlay={
        <Menu
          items={[
            {
              key: 'tree',
              label: <ComStatusTreeDrawerTrigger></ComStatusTreeDrawerTrigger>,
            },
            {
              key: 'settings',
              label: <StatusSettingsTrigger />,
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
