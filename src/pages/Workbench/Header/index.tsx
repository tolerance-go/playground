import { useModel } from '@umijs/max';
import { Avatar, Col, Divider, Row, Space } from 'antd';
import { AutoSaveTag } from './AutoSaveTag';
import CenterArea from './CenterArea';
import CMSConfigForm from './CMSConfigForm';
import { DisscusTrigger } from './DisscusTrigger';
import Logo from './Logo';
// import EventInteraction from './EventInteraction';
import { Layout } from 'antd';
import InsertComponentTrigger from './InsertComponentTrigger';
import { PlayAction } from './PlayAction';
import SaveToVersionBtn from './SaveToVersionBtn';
import SettingsBtn from './SettingsBtn';

const { Header } = Layout;

const App = () => {
  // const navigate = useNavigate();

  const { headerHeight } = useModel(
    'workbench.workbenchIDESettings',
    (model) => ({
      headerHeight: model.headerHeight,
    }),
  );

  return (
    <Header
      style={{
        background: '#fff',
        borderBottom: '1px solid #f2f2f2',
        padding: '0px 10px',
        /** 原本 64 会影响内部元素高度 */
        lineHeight: 'normal',
      }}
    >
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
              {/* <Button disabled type="text" icon={<PlusCircleFilled />}>
              布局
            </Button>
            <Button disabled type="text" icon={<PlusCircleFilled />}>
              框架
            </Button>
            <Button disabled type="text" icon={<PlusCircleFilled />}>
              文本
            </Button> */}
              <InsertComponentTrigger />
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
    </Header>
  );
};

export default App;
