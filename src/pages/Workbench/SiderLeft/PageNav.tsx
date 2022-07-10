import { Input, Menu } from 'antd';

const App = () => {
  return (
    <div>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={[
          {
            key: '1',
            label: 'option1',
          },
          {
            key: '12',
            label: <Input size="small" value={'option2'}></Input>,
          },
        ]}
      />
    </div>
  );
};

export default App;
