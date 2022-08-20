import { PLAYGROUND_ATOM_WRAPPER_CLASS_NAME } from '@/constants/atoms';
import { getURLQuery } from '@/helps/getURLQuery';
import { findClosestParentHTMLElement } from '@/utils/findClosestParentHTMLElement';
import { useModel } from '@umijs/max';
import { PropsWithChildren } from 'react';
import DiscussItem from '../DiscussItem';
import { TempDiscussItem } from '../TempDiscussItem';

export const StageInnerWrapper = (props: PropsWithChildren<unknown>) => {
  const { mode, tempDiscuss, filterDiscusses, setTempDiscuss, setDetailMode } =
    useModel('playground', (model) => ({
      mode: model.mode,
      tempDiscuss: model.tempDiscuss,
      filterDiscusses: model.filterDiscusses,
      setTempDiscuss: model.setTempDiscuss,
      setDetailMode: model.setDetailMode,
    }));

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

          setDetailMode('detail');
        }
      }}
    >
      {props.children}
      {mode === 'discuss' && !tempDiscuss
        ? filterDiscusses.map((discuss, index) => {
            return <DiscussItem key={discuss.id} {...discuss} index={index} />;
          })
        : null}
      <TempDiscussItem />
    </div>
  );
};
