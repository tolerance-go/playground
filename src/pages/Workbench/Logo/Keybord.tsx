import { ProCard, ProList } from '@ant-design/pro-components';
import { Drawer, Typography } from 'antd';

const defaultData = [
  {
    id: 'esc',
    name: '删除',
    extra: 'Esc',
  },
  {
    id: 'undo',
    name: '撤销',
    extra: ['Cmd', 'Z'],
  },
  {
    id: 'redo',
    name: '重做',
    extra: ['Shift', 'Cmd', 'Z'],
  },
];

export default ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) => {
  return (
    <>
      <Drawer
        title="快捷键"
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        placement="left"
        bodyStyle={{
          padding: 0,
          paddingTop: 15,
        }}
        footer={false}
        zIndex={9999}
      >
        <ProCard title="编辑" collapsible>
          <ProList
            rowKey="id"
            split
            dataSource={defaultData}
            metas={{
              title: {
                dataIndex: 'name',
              },
              extra: {
                render: (text: string[] | string) => {
                  return (
                    <>
                      {(Array.isArray(text) ? text : [text]).map((item) => (
                        <Typography.Text key={item} keyboard>
                          {item}
                        </Typography.Text>
                      ))}
                    </>
                  );
                },
              },
            }}
          />
        </ProCard>
      </Drawer>
      <span>快捷键</span>
    </>
  );
};
