import { Col, Modal, Row } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { ColumnsTree } from './ColumnsTree';

export type ColumnsConfigModalAPI = {
  open: () => void;
};

export const ColumnsConfigModal = React.forwardRef<
  ColumnsConfigModalAPI,
  unknown
>((props, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
  }));

  return (
    <>
      <Modal width={'50%'} visible={visible} onCancel={() => setVisible(false)}>
        <Row>
          <Col
            span={8}
            style={{
              borderRight: '1px solid #f2f2f2',
            }}
          >
            <ColumnsTree />
          </Col>
          <Col span={16}></Col>
        </Row>
      </Modal>
    </>
  );
});
