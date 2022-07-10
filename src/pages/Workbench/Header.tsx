import {
  PlayCircleTwoTone,
  PlusCircleFilled,
  SettingFilled,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Button, Col, Divider, Row, Space } from 'antd';
import Logo from './Logo';

// const optionsWithDisabled = [
//   {
//     label: '设计',
//     value: '设计',
//   },
//   {
//     label: '演示',
//     value: '演示',
//   },
// ];

const App = () => {
  // const navigate = useNavigate();
  const { setMode } = useModel('siderLeftMode', (model) => ({
    setMode: model.setMode,
  }));

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        style={{
          height: '100%',
        }}
      >
        <Col>
          <Logo />
          <Divider type="vertical" />
          <Space>
            <Button
              type="text"
              icon={<PlusCircleFilled />}
              onClick={() => {
                setMode('components');
              }}
            >
              组件
            </Button>
            <Button type="text" icon={<PlusCircleFilled />}>
              布局
            </Button>
            <Button type="text" icon={<PlusCircleFilled />}>
              框架
            </Button>
            <Button type="text" icon={<PlusCircleFilled />}>
              文本
            </Button>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button
              type="text"
              icon={<PlayCircleTwoTone />}
              onClick={() => {
                // navigate({
                //   pathname: '/playground',
                //   search: createSearchParams({
                //     id: 'xxx',
                //   }).toString(),
                // });
                window.open('/playground');
              }}
            >
              演示
            </Button>
            <Button type="primary">发布</Button>
            <Divider type="vertical" />
            <Button type="text" icon={<SettingFilled />}>
              设置
            </Button>
            <Avatar>User</Avatar>
          </Space>
        </Col>
      </Row>
      {/* <Radio.Group
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        options={optionsWithDisabled}
        optionType="button"
        buttonStyle="solid"
        value={'设计'}
      /> */}
    </div>
  );
};

export default App;
