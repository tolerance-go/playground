import { getAppIdOrThrow } from '@/helps/getAppIdOrThrow';
import { getPageIdOrThrow } from '@/helps/getPageIdOrThrow';
import { useGetSliceStageData } from '@/hooks/initials/useGetSliceStageData';
import { ComponentStructure } from '@/models/page/comsStructures';
import { ComponentControllerCreate } from '@/services/server/ComponentController';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';

export const LinkageComponentCreator = (props: {
  nodeId: ComponentStructure['id'];
  type: ComponentStructure['type'];
}) => {
  const { getSliceStageData } = useGetSliceStageData();

  const { addComMaterial } = useModel('component.componentList', (model) => ({
    addComMaterial: model.addComMaterial,
  }));

  const { setNormalStatus } = useModel(
    'workbench.normalModeSubMode',
    (model) => ({
      setNormalStatus: model.setNormalStatus,
    }),
  );

  const { setHighlightId } = useModel(
    'component.listHighlightItemId',
    (model) => ({
      setHighlightId: model.setHighlightId,
    }),
  );

  const { markNodeFromComponent } = useModel(
    'page.comsStructures',
    (model) => ({
      markNodeFromComponent: model.markNodeFromComponent,
    }),
  );

  const { triggerPrepareSaveTimeChange } = useModel(
    'app.stageAutoSave',
    (model) => ({
      triggerPrepareSaveTimeChange: model.triggerPrepareSaveTimeChange,
    }),
  );

  /**
   * 从当前舞台上的组件进行复制创建
   */
  const {
    loading: requestComponentFromStageNodeLoading,
    run: requestComponentFromStageNode,
  } = useRequest(
    async (
      stateNodeId: string,
      params: Pick<API.CreationComponent, 'name' | 'desc'>,
    ) => {
      const stageData = getSliceStageData([stateNodeId]);
      const appId = getAppIdOrThrow();
      const pageId = getPageIdOrThrow();

      return ComponentControllerCreate({
        name: params.name,
        desc: params.desc,
        app_id: appId,
        stage_data: JSON.stringify(stageData),
        usedInPageIds: [pageId],
      });
    },
    {
      manual: true,
      onSuccess(data, params) {
        addComMaterial(data);
        setNormalStatus('material');
        setHighlightId(data.id);

        markNodeFromComponent(data.id, props.nodeId);
        triggerPrepareSaveTimeChange();
      },
    },
  );

  return (
    <Spin spinning={requestComponentFromStageNodeLoading}>
      <div
        onClick={() => {
          requestComponentFromStageNode(props.nodeId, {
            name: `${props.type}-${props.nodeId}`,
            desc: '从舞台组件创建',
          });
        }}
      >
        创建关联组件
      </div>
    </Spin>
  );
};
