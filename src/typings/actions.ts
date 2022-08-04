import { ComponentAction } from '@/models/comsActions';

export interface SwitchStatusAction extends ComponentAction {
  settings: {
    targetComId: string;
    targetStatId: string;
  };
}
