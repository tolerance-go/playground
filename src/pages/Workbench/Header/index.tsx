import { AppstoreAddOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Button, Col, Divider, Row, Space } from 'antd';
import Logo from '../Logo';
import { AutoSaveTag } from './AutoSaveTag';
import CenterArea from './CenterArea';
import CMSConfigForm from './CMSConfigForm';
import { DisscusTrigger } from './DisscusTrigger';
// import EventInteraction from './EventInteraction';
import { PlayAction } from './PlayAction';
import SaveToVersionBtn from './SaveToVersionBtn';
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

  const { headerHeight } = useModel('workbenchIDESettings', (model) => ({
    headerHeight: model.headerHeight,
  }));

  const { stageMode } = useModel('stageMode', (model) => ({
    stageMode: model.mode,
  }));

  return (
    <div
      style={{
        position: 'relative',
        height: headerHeight,
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
              disabled={stageMode === 'playground'}
              type="text"
              icon={<AppstoreAddOutlined />}
              onClick={() => {
                setMode('components');
              }}
            >
              组件
            </Button>
            {/* <Button disabled type="text" icon={<PlusCircleFilled />}>
              布局
            </Button>
            <Button disabled type="text" icon={<PlusCircleFilled />}>
              框架
            </Button>
            <Button disabled type="text" icon={<PlusCircleFilled />}>
              文本
            </Button> */}
            <CMSConfigForm />
            <DisscusTrigger />
            {/* <APIConfigForm /> */}
          </Space>
        </Col>
        <Col>
          <Space>
            <AutoSaveTag />
            {/* <Divider type="vertical" /> */}
            {/* 事件交互 */}
            {/* <EventInteraction /> */}
            <PlayAction />
            <SaveToVersionBtn />
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
