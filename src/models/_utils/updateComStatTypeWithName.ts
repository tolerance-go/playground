import { WritableDraft } from 'immer/dist/internal';
import { ComponentAction, ComponentsActions } from '../comsActions';
import { ComponentEvent, ComponentsEvents } from '../comsEvents';

export const updateComStatTypeWithName = (
  comId: string,
  statId: string,
  actionWithName: Partial<{
    [actionName: string]: ComponentEvent | ComponentAction;
  }>,
  draft: WritableDraft<ComponentsEvents | ComponentsActions>,
) => {
  if (draft[comId] === undefined) {
    draft[comId] = {};
  }

  const actionName = Object.keys(actionWithName)[0];
  const action = actionWithName[actionName];

  const actionId = Object.keys(draft[comId][statId]).find((actionId) => {
    if (draft[comId][statId][actionId].name === actionName) {
      return true;
    }
    return false;
  });

  if (actionId) {
    draft[comId][statId][actionId] = {
      ...draft[comId][statId][actionId],
      ...action,
      id: actionId,
    };
  }
};
