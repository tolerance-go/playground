import DiscussItem from '@/components/DiscussItem';
import { TempDiscussItem } from '@/components/TempDiscussItem';
import { PLAYGROUND_ATOM_WRAPPER_CLASS_NAME } from '@/constants/atoms';
import { getURLQuery } from '@/helps/getURLQuery';
import { findClosestParentHTMLElement } from '@/utils/findClosestParentHTMLElement';
import { useModel } from '@umijs/max';
import { PropsWithChildren } from 'react';
import { DiscussInfos } from '@/components/DiscussInfos';
import { PlaygroundHandlerBar } from '@/components/PlaygroundHandlerBar';

export const StagePlaygroundWrapper = (
  props: PropsWithChildren<{
    id: string;
  }>,
) => {
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
      id={props.id}
      style={{
        position: 'relative',
        cursor: mode === 'discuss' ? 'help' : 'default',
      }}
      onClick={(event) => {
        if (mode !== 'discuss') return;

        if (event.altKey) return;

        const parentAtomWrapper = findClosestParentHTMLElement(
          event.target as HTMLElement,
          (item) => item.classList.contains(PLAYGROUND_ATOM_WRAPPER_CLASS_NAME),
        );

        if (parentAtomWrapper) {
          const rect = parentAtomWrapper.getBoundingClientRect();

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
