import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Space } from 'antd';

const menu = (
  <Menu
    items={[
      {
        label: '返回应用管理',
        key: '1',
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
