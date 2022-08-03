import ComEventCUForm from '@/components/ComEventCUForm';
import { ComponentEvent } from '@/models/comsEvents';
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

  const { comsEvents, deleteComStatEvent } = useModel(
    'comsEvents',
    (model) => ({
      comsEvents: model.comsEvents,
      deleteComStatEvent: model.deleteComStatEvent,
    }),
  );

  const actions =
    stageSelectNodeId && selectedComponentStatusId
      ? comsEvents[stageSelectNodeId]?.[selectedComponentStatusId]
      : undefined;

  const { triggerPrepareSaveTimeChange } = useModel(
    'stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  return (
    <ProList<ComponentEvent>
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
              <ComEventCUForm
                eventId={item.id}
                mode="edit"
                key="edit"
              ></ComEventCUForm>,
              <a
                key="remove"
                onClick={() => {
                  if (stageSelectNodeId && selectedComponentStatusId) {
                    deleteComStatEvent(
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
