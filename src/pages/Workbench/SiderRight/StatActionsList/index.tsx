import ComActionCUForm from '@/components/ComActionCUForm';
import { FormItemExtendLabel } from '@/components/FormItemExtendLabel';
import { useSelectedComActiveStatExtendRelation } from '@/hooks/useSelectedComActiveStatExtendRelation';
import { useSelectedNode } from '@/hooks/useSelectedNode';
import { ComponentAction } from '@/models/comsActions';
import { DeleteOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import './index.less';

export default () => {
  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    stageSelectNodeId: model?.stageSelectNodeId,
  }));

  const { selectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      selectedComponentStatusId: model.selectedComponentStatusId,
    }),
  );

  const { comsActions, deleteComStatAction } = useModel(
    'comsActions',
    (model) => ({
      comsActions: model.comsActions,
      deleteComStatAction: model.deleteComStatAction,
    }),
  );

  const actions =
    stageSelectNodeId && selectedComponentStatusId
      ? comsActions[stageSelectNodeId]?.[selectedComponentStatusId]
      : undefined;

  const { triggerPrepareSaveTimeChange } = useModel(
    'stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  const { stageSelectNode } = useSelectedNode();

  const { lockComExtendActionField, unlockComExtendActionField } = useModel(
    'statusRelations',
    (model) => ({
      lockComExtendActionField: model.lockComExtendActionField,
      unlockComExtendActionField: model.unlockComExtendActionField,
    }),
  );

  const { extendRelation } = useSelectedComActiveStatExtendRelation();

  if (!stageSelectNode) {
    return null;
  }

  return (
    <ProList<ComponentAction>
      style={{
        marginTop: 10,
      }}
      split
      className="actions-list"
      rowKey="id"
      dataSource={Object.keys(actions ?? {}).map((actionId) => {
        const action = actions![actionId];
        return action;
      })}
      showActions="hover"
      metas={{
        title: {
          dataIndex: 'name',
          render: (dom, entity) => {
            if (!extendRelation) {
              return dom;
            }

            return (
              <FormItemExtendLabel
                label={entity.name}
                fieldName={entity.name}
                lockFields={extendRelation?.actionLockFields}
                onUnLockClick={() => {
                  unlockComExtendActionField(
                    stageSelectNode.id,
                    extendRelation.id,
                    entity.name,
                  );
                  triggerPrepareSaveTimeChange();
                }}
                onLockClick={() => {
                  lockComExtendActionField(
                    stageSelectNode.id,
                    extendRelation.id,
                    entity.name,
                  );
                  triggerPrepareSaveTimeChange();
                }}
              ></FormItemExtendLabel>
            );
          },
        },
        subTitle: {
          dataIndex: 'typeZh',
        },
        actions: {
          render: (dom, item) => {
            return [
              <ComActionCUForm
                actionId={item.id}
                mode="edit"
                key="edit"
              ></ComActionCUForm>,
              <a
                key="remove"
                onClick={() => {
                  if (stageSelectNodeId && selectedComponentStatusId) {
                    deleteComStatAction(
                      stageSelectNodeId,
                      selectedComponentStatusId,
                      item.id,
                    );
                    triggerPrepareSaveTimeChange();
                  }
                }}
                style={{
                  color: 'red',
                }}
              >
                <DeleteOutlined />
              </a>,
            ];
          },
        },
      }}
    />
  );
};
