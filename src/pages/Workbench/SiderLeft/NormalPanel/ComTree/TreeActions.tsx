import { FolderViewOutlined, SwitcherOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Col, Row, Space } from 'antd';

export default () => {
  const { stageComponentsModel, rootIds } = useModel(
    'stageComponentsModel',
    (model) => ({
      stageComponentsModel: model.stageComponentsModel,
      rootIds: model.rootIds,
    }),
  );

  const { setExpanedKeys } = useModel('comsLayout', (model) => ({
    setExpanedKeys: model.setExpanedKeys,
  }));

  return (
    <Row justify="end" align="middle">
      <Col>
        <Space size={5}>
          <Button
            icon={<FolderViewOutlined />}
            size="small"
            type="text"
            onClick={() => {
              if (stageComponentsModel) {
                window.__consola.info(
                  'action:',
                  '展开所有节点',
                  stageComponentsModel,
                );

                const getAllKeys = (
                  ids: string[],
                  allKeys: string[] = [],
                ): string[] => {
                  ids.forEach((id) => {
                    const model = stageComponentsModel?.[id];
                    if (model) {
                      allKeys.push(model.id);
                    }

                    Object.keys(model?.slots ?? {}).forEach((slotName) => {
                      allKeys.push(`${model?.id}-${slotName}`);
                      const slotIds = model?.slots[slotName] ?? [];
                      getAllKeys(slotIds, allKeys);
                    });
                  });

                  return allKeys;
                };

                setExpanedKeys(getAllKeys(rootIds));
              }
            }}
          ></Button>
          <Button
            icon={<SwitcherOutlined />}
            size="small"
            type="text"
            onClick={() => {
              setExpanedKeys([]);
            }}
          ></Button>
        </Space>
      </Col>
    </Row>
  );
};
