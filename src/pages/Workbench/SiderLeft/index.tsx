import { useModel } from '@umijs/max';
import { Alert, Col, Layout, Row } from 'antd';
import consola from 'consola';
import { useRef } from 'react';
import ComponentGrid from './ComponentGrid';
import NormalPanel from './NormalPanel';

const { Sider } = Layout;

export default function App() {
  const { siderLeftMode: mode } = useModel('workbench.siderLeftMode');
  const siderRef = useRef<HTMLDivElement>(null);

  const { siderLeftWidth } = useModel('workbench.workbenchIDESettings', (model) => ({
    siderLeftWidth: model.siderLeftWidth,
  }));

  consola.info('siderLeftMode mode 变化', mode);

  const renderContent = () => {
    if (mode === 'pages') {
      return <NormalPanel />;
    }

    if (mode === 'insert' || mode === 'components') {
      return <ComponentGrid siderRef={siderRef} />;
    }

    return null;
  };

  return (
    <Sider
      ref={siderRef}
      theme="light"
      width={siderLeftWidth}
      style={{
        borderRight: '1px solid rgb(242, 242, 242)',
      }}
    >
      <Row
        style={{
          flexDirection: 'column',
          height: '100%',
          alignItems: 'stretch',
        }}
        wrap={false}
      >
        {mode === 'insert' && (
          <Col flex={'none'}>
            <Alert showIcon banner message="当前正在填充插槽" type="info" />
          </Col>
        )}
        <Col
          flex={'auto'}
          style={{
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          {renderContent()}
        </Col>
      </Row>
    </Sider>
  );
}
