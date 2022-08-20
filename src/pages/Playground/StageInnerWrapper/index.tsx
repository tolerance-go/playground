import { PLAYGROUND_ATOM_WRAPPER_CLASS_NAME } from '@/constants/atoms';
import { getURLQuery } from '@/helps/getURLQuery';
import { findClosestParentHTMLElement } from '@/utils/findClosestParentHTMLElement';
import { useModel } from '@umijs/max';
import { PropsWithChildren } from 'react';
import DiscussItem from '../DiscussItem';
import { TempDiscussItem } from '../TempDiscussItem';

export const StageInnerWrapper = (props: PropsWithChildren<unknown>) => {
  const { discusses, mode, tempDiscuss, setTempDiscuss } = useModel(
    'playground',
    (model) => ({
      discusses: model.discusses,
      mode: model.mode,
      tempDiscuss: model.tempDiscuss,
      setTempDiscuss: model.setTempDiscuss,
    }),
  );

  return (
    <div
      style={{
        position: 'relative',
      }}
      onClick={(event) => {
        if (mode !== 'discuss') return;

        const parentAtomWrapper = findClosestParentHTMLElement(
          event.target as HTMLElement,
          (item) => item.classList.contains(PLAYGROUND_ATOM_WRAPPER_CLASS_NAME),
        );

        if (parentAtomWrapper) {
          const rect = event.currentTarget.getBoundingClientRect();

          const { comid: comId, statid: statId } =
            parentAtomWrapper.dataset ?? {};

          const query = getURLQuery();

          setTempDiscuss({
            left: event.pageX,
            top: event.pageY,
            containerWidth: rect.width,
            containerHeight: rect.height,
            containerLeft: rect.left,
            containerTop: rect.top,
            belongsToComId: comId!,
            belongsToComStatId: statId!,
            pageId: Number(query.pageId),
          });
        }
      }}
    >
      {props.children}
      {mode === 'discuss' && !tempDiscuss
        ? discusses.map((discuss) => {
            return <DiscussItem key={discuss.id} {...discuss} />;
          })
        : null}
      <TempDiscussItem />
    </div>
  );
};
