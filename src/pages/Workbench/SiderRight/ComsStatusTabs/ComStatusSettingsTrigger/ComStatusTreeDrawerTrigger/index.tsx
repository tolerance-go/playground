import { Drawer } from 'antd';
import { useState } from 'react';
import { ComStatusTreeMap } from './ComStatusTreeMap';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Drawer
        title="状态关联"
        width={400}
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <ComStatusTreeMap />
      </Drawer>
      <div onClick={() => setVisible(true)}>状态关联</div>
    </>
  );
};
