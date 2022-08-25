import { useModel } from '@umijs/max';
import { Col, Modal, Row } from 'antd';
import { ColumnsTree } from './ColumnsTree';
import { ColumSettingsForm } from './ColumSettingsForm';

// export type ColumnsConfigModalAPI = {
//   open: () => void;
// };

export const ColumnsConfigModal = () => {
  const { visible, setVisible } = useModel('database.dataFieldsConfig', (model) => ({
    visible: model.visible,
    setVisible: model.setVisible,
  }));

  return (
    <>
      <Modal
        title="列配置"
        width={'50%'}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={false}
      >
        <Row gutter={20}>
          <Col
            span={8}
            style={{
              borderRight: '1px solid #f2f2f2',
            }}
          >
            <ColumnsTree />
          </Col>
          <Col span={16}>
            <ColumSettingsForm />
          </Col>
        </Row>
      </Modal>
    </>
  );
};
