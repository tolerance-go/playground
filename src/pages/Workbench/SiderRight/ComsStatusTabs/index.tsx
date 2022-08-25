import { useSelectedComDefaultStatId } from '@/hooks/selected/useSelectedComDefaultStatId';
import { useSetNearSelectedComponentStatusId } from '@/hooks/actions/useSetNearSelectedComponentStatusId';
import { useModel } from '@umijs/max';
import { Badge, Tabs, Typography } from 'antd';
import { useRef } from 'react';
import ComStatusSettingsTrigger from './ComStatusSettingsTrigger';
import CreateComStatus, { CreateComStatusAPI } from './CreateComStatus';

const { TabPane } = Tabs;

export const ComsStatusTabs = () => {
  const createFormRef = useRef<CreateComStatusAPI>(null);

  const { stageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    stageSelectNodeId: model?.stageSelectNodeId,
  }));

  const { componentsStatus, deleteComStat } = useModel(
    'page.comsStatus',
    (model) => ({
      componentsStatus: model.componentsStatus,
      deleteComStat: model.deleteComStat,
    }),
  );

  const { deleteComStatRelationFromToStatId } = useModel(
    'page.statusConnectRelations',
    (model) => ({
      deleteComStatRelationFromToStatId:
        model.deleteComStatRelationFromToStatId,
    }),
  );

  const { selectedComDefaultStatId } = useSelectedComDefaultStatId();

  const { setNearSelectedComponentStatusId } =
    useSetNearSelectedComponentStatusId();

  const { selectedComponentStatusId, setSelectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
      setSelectedComponentStatusId: model.setSelectedComponentStatusId,
    }),
  );

  const { triggerPrepareSaveTimeChange } = useModel(
    'app.stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  return (
    <Tabs
      size="small"
      type="editable-card"
      activeKey={selectedComponentStatusId}
      addIcon={<CreateComStatus ref={createFormRef} />}
      tabBarExtraContent={{
        right: <ComStatusSettingsTrigger />,
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

            /** 删除继承关系 */
            deleteComStatRelationFromToStatId(stageSelectNodeId, statId);

            triggerPrepareSaveTimeChange();
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
              tab={
                selectedComDefaultStatId === statusId ? (
                  <Badge dot>
                    {selectedComponentStatusId === statusId ? (
                      <Typography.Link>{componentStatus.name}</Typography.Link>
                    ) : (
                      componentStatus.name
                    )}
                  </Badge>
                ) : (
                  componentStatus.name
                )
              }
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
