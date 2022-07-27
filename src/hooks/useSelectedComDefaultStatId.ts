import { useModel } from '@umijs/max';

export const useSelectedComDefaultStatId = () => {
  const { stageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    stageSelectNodeId: model?.stageSelectNodeId,
  }));

  const { statusSettingsDefaults } = useModel(
    'statusSettingsDefaults',
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
