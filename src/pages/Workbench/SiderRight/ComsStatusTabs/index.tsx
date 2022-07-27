import { useSelectedComDefaultStatId } from '@/hooks/useSelectedComDefaultStatId';
import { useSetNearSelectedComponentStatusId } from '@/hooks/useSetNearSelectedComponentStatusId';
import { BranchesOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Tabs } from 'antd';
import { useRef } from 'react';
import CreateComStatus, { CreateComStatusAPI } from './CreateComStatus';

const { TabPane } = Tabs;

export const ComsStatusTabs = () => {
  const createFormRef = useRef<CreateComStatusAPI>(null);

  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    stageSelectNodeId: model?.stageSelectNodeId,
  }));

  const { componentsStatus, deleteComStat } = useModel(
    'statusSettings',
    (model) => ({
      componentsStatus: model.componentsStatus,
      deleteComStat: model.deleteComStat,
    }),
  );

  const { selectedComDefaultStatId } = useSelectedComDefaultStatId();

  const { setNearSelectedComponentStatusId } =
    useSetNearSelectedComponentStatusId();

  const { selectedComponentStatusId, setSelectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
      setSelectedComponentStatusId: model.setSelectedComponentStatusId,
    }),
  );

  return (
    <Tabs
      size="small"
      type="editable-card"
      activeKey={selectedComponentStatusId}
      addIcon={<CreateComStatus ref={createFormRef} />}
      tabBarExtraContent={{
        right: (
          <Button
            size="small"
            type="text"
            shape="circle"
            style={{
              marginLeft: 5,
            }}
          >
            <BranchesOutlined />
          </Button>
        ),
      }}
      onChange={(activeKey) => {
        setSelectedComponentStatusId(activeKey);
      }}
      onEdit={(event, type) => {
        if (type === 'remove') {
          const statId = event as string;

          if (stageSelectNodeId) {
            /** 如果删除的是激活的 id，重新设置激活 id */
            if (selectedComponentStatusId === statId) {
              setNearSelectedComponentStatusId();
            }

            deleteComStat(stageSelectNodeId, statId);
          }
        }
      }}
    >
      {stageSelectNodeId && componentsStatus[stageSelectNodeId] ? (
        Object.keys(componentsStatus[stageSelectNodeId]).map((statusId) => {
          const componentStatus = componentsStatus[stageSelectNodeId][statusId];
          return (
            <TabPane
              closable={selectedComDefaultStatId !== statusId}
              tab={componentStatus.name}
              key={statusId}
            ></TabPane>
          );
        })
      ) : (
        <></>
      )}
    </Tabs>
  );
};
