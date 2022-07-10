import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Space } from 'antd';

const menu = (
  <Menu
    items={[
      {
        label: '1st menu item',
        key: '1',
        icon: <UserOutlined />,
      },
      {
        label: '2nd menu item',
        key: '2',
        icon: <UserOutlined />,
      },
      {
        label: '3rd menu item',
        key: '3',
        icon: <UserOutlined />,
      },
    ]}
  />
);

const App = () => (
  <Dropdown overlay={menu}>
    <Button shape="round">
      <Space>
        <img src="/logo.svg" width={'20px'}></img>
        <DownOutlined
          style={{
            fontSize: '12px',
          }}
        />
      </Space>
    </Button>
  </Dropdown>
);

export default App;
