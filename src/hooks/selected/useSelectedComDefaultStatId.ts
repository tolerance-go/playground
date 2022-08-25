import { useModel } from '@umijs/max';

export const useSelectedComDefaultStatId = () => {
  const { stageSelectNodeId } = useModel('stage.stageSelectNodeId', (model) => ({
    stageSelectNodeId: model?.stageSelectNodeId,
  }));

  const { statusSettingsDefaults } = useModel(
    'page.statusSettingsDefaults',
    (model) => ({
      statusSettingsDefaults: model.statusSettingsDefaults,
    }),
  );

  const selectedComDefaultStatId = stageSelectNodeId
    ? statusSettingsDefaults[stageSelectNodeId]
    : undefined;

  return {
    selectedComDefaultStatId,
  };
};
