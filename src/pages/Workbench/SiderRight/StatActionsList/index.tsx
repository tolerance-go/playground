import ComActionCUForm from '@/components/ComActionCUForm';
import { ComponentAction } from '@/models/comsActions';
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
                删除
              </a>,
            ];
          },
        },
      }}
    />
  );
};
