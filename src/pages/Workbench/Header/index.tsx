import { PlusCircleFilled } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Button, Col, Divider, Row, Space } from 'antd';
import Logo from '../Logo';
import APIConfigForm from './APIConfigForm';
import { AutoSaveTag } from './AutoSaveTag';
import CenterArea from './CenterArea';
import CMSConfigForm from './CMSConfigForm';
import { PlayAction } from './PlayAction';
import SettingsBtn from './SettingsBtn';

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
        height: 64,
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
            <Button disabled type="text" icon={<PlusCircleFilled />}>
              布局
            </Button>
            <Button disabled type="text" icon={<PlusCircleFilled />}>
              框架
            </Button>
            <Button disabled type="text" icon={<PlusCircleFilled />}>
              文本
            </Button>
            <CMSConfigForm />
            <APIConfigForm />
          </Space>
        </Col>
        <Col>
          <Space>
            <AutoSaveTag />
            <PlayAction />
            <Button type="primary">发布</Button>
            <Divider type="vertical" />
            <SettingsBtn />
            <Avatar>User</Avatar>
          </Space>
        </Col>
      </Row>
      <CenterArea />
    </div>
  );
};

export default App;
