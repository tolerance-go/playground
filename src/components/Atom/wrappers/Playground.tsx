import { PLAYGROUND_ATOM_WRAPPER_CLASS_NAME } from '@/constants/atoms';
import { StageComponentsModelItem } from '@/models/stageComponentsModel';
import React from 'react';

export const AtomPlaygroundWrapper = (
  props: React.PropsWithChildren<{
    statId: string;
    comId: string;
    display: StageComponentsModelItem['display'];
  }>,
) => {
  return (
    <div
      data-statId={props.statId}
      data-comId={props.comId}
      className={PLAYGROUND_ATOM_WRAPPER_CLASS_NAME}
      style={{
        display: props.display,
      }}
    >
      {props.children}
    </div>
  );
};
