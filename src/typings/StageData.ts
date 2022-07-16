export type StageData = {
  comsTree: {
    rootIds: string[];
    stageComponentsModel: Record<string, object>;
  };
  comsModel: {
    settings: Record<string, object>;
  };
};
