import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import consola from 'consola';
import { nanoid } from 'nanoid';
import { ComGridItem } from './index';

export const useHandleComGridItemClick = () => {
  const { mode: siderLeftMode } = useModel('workbench.siderLeftMode', (model) => ({
    mode: model?.siderLeftMode,
  }));

  const { addComponentToStage, addComToStageSlot } = useModel(
    'page.comsStructures',
    (model) => ({
      addComponentToStage: model?.addComponentToStage,
      addComToStageSlot: model?.addComToStageSlot,
    }),
  );

  const { getLatestComsInitalSettings } = useModel(
    'config.comsSettingsConfigs',
    (model) => ({
      getLatestComsInitalSettings: model?.getLatestComsInitalSettings,
    }),
  );

  const { focusComId, focusSlotName, focusSlotPosition } = useModel(
    'stage.slotsInsert',
    (model) => ({
      focusComId: model?.focusComId,
      focusSlotName: model?.focusSlotName,
      focusSlotPosition: model?.focusSlotPosition,
    }),
  );

  const { setSelectedComponentStatusId } = useModel(
    'stage.selectedComponentStatusId',
    (model) => ({
      setSelectedComponentStatusId: model?.setSelectedComponentStatusId,
    }),
  );

  const { initComStatus } = useModel('page.comsStatus', (model) => ({
    initComStatus: model?.initComStatus,
  }));

  const { setComStatSetting } = useModel('page.comsSettings', (model) => ({
    setComStatSetting: model.setComStatSetting,
  }));

  const { setComStatStyle } = useModel('page.comsStyles', (model) => ({
    setComStatStyle: model.setComStatStyle,
  }));

  const { setComStatusSettingsDefaults } = useModel(
    'page.statusSettingsDefaults',
    (model) => ({
      setComStatusSettingsDefaults: model.setComStatusSettingsDefaults,
    }),
  );

  const { setStageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    setStageSelectNodeId: model?.setStageSelectNodeId,
  }));

  const { triggerSaveTimeChange } = useModel('app.stageAutoSave', (model) => {
    return {
      triggerSaveTimeChange: model?.triggerPrepareSaveTimeChange,
    };
  });

  const handleComGridItemClick = useMemoizedFn((item: ComGridItem) => {
    const newComId = nanoid();
    const statusId = nanoid();
    if (item.name === 'button') {
      if (siderLeftMode === 'insert') {
        if (!focusComId || !focusSlotName) {
          throw new Error('当前 focusCom 信息异常消失');
        }

        addComToStageSlot({
          parentId: focusComId,
          newId: newComId,
          slotName: focusSlotName,
          type: 'button',
          display: 'inline',
          postion: focusSlotPosition,
        });
      } else {
        consola.info('添加新组件到舞台');
        addComponentToStage('button', {
          id: newComId,
          display: 'inline',
          parentId: 'root',
          slotName: 'root',
        });
      }
    } else if (item.name === 'line') {
      if (siderLeftMode === 'insert') {
        if (!focusComId || !focusSlotName) {
          throw new Error('当前 focusCom 信息异常消失');
        }

        addComToStageSlot({
          parentId: focusComId,
          newId: newComId,
          slotName: focusSlotName,
          type: 'line',
          display: 'block',
          postion: focusSlotPosition,
        });
      } else {
        consola.info('添加新组件到舞台');
        addComponentToStage('line', {
          id: newComId,
          display: 'block',
          parentId: 'root',
          slotName: 'root',
        });
      }
    } else if (item.name === 'table') {
      if (siderLeftMode === 'insert') {
        if (!focusComId || !focusSlotName) {
          throw new Error('当前 focusCom 信息异常消失');
        }

        addComToStageSlot({
          parentId: focusComId,
          newId: newComId,
          slotName: focusSlotName,
          type: 'table',
          display: 'block',
          postion: focusSlotPosition,
        });
      } else {
        consola.info('添加新组件到舞台');
        addComponentToStage('table', {
          id: newComId,
          display: 'block',
          parentId: 'root',
          slotName: 'root',
        });
      }
    }

    // 初始化新组件的初始化状态
    initComStatus({
      comId: newComId,
      statusId,
    });

    setComStatSetting(
      newComId,
      statusId,
      getLatestComsInitalSettings()?.[item.name] ?? {},
    );

    setComStatStyle(newComId, statusId, {});

    consola.info('选中组件和默认状态');
    /** 设置选中组件 */
    setStageSelectNodeId(newComId);

    /** 设置选中组件的选中状态 */
    setSelectedComponentStatusId(statusId);

    /** 设置组件默认状态 */
    setComStatusSettingsDefaults(newComId, statusId);

    triggerSaveTimeChange();
  });

  return { handleComGridItemClick };
};
