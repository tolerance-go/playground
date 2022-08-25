import DiscussItem from '@/components/DiscussItem';
import { TempDiscussItem } from '@/components/TempDiscussItem';
import { PLAYGROUND_ATOM_WRAPPER_CLASS_NAME } from '@/constants/atoms';
import { getPageIdOrThrow } from '@/helps/getPageIdOrThrow';
import { findClosestParentHTMLElement } from '@/utils/findClosestParentHTMLElement';
import { useModel } from '@umijs/max';
import { PropsWithChildren } from 'react';

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

  const { siderLeftWidth, headerHeight } = useModel(
    'workbench.workbenchIDESettings',
    (model) => ({
      siderLeftWidth: model.siderLeftWidth,
      headerHeight: model.headerHeight,
    }),
  );

  return (
    <div
      id={props.id}
      style={{
        position: 'relative',
        cursor: mode === 'discuss' ? 'help' : 'default',
      }}
      onClick={(event) => {
        if (mode !== 'discuss') return;

        /** 允许交互 */
        if (event.altKey) return;

        const parentAtomWrapper = findClosestParentHTMLElement(
          event.target as HTMLElement,
          (item) => item.classList.contains(PLAYGROUND_ATOM_WRAPPER_CLASS_NAME),
        );

        if (parentAtomWrapper) {
          const rect = parentAtomWrapper.getBoundingClientRect();

          const containerRectLeft =
            location.pathname === '/workbench'
              ? rect.left - siderLeftWidth
              : rect.left;

          const containerRectTop =
            location.pathname === '/workbench'
              ? rect.top - headerHeight
              : rect.top;

          const pageLeft =
            location.pathname === '/workbench'
              ? event.pageX - siderLeftWidth
              : event.pageX;

          const pageTop =
            location.pathname === '/workbench'
              ? event.pageY - headerHeight
              : event.pageY;

          const { comid: comId, statid: statId } =
            parentAtomWrapper.dataset ?? {};

          const pageId = getPageIdOrThrow();

          setTempDiscuss({
            left: pageLeft,
            top: pageTop,
            containerWidth: rect.width,
            containerHeight: rect.height,
            containerLeft: containerRectLeft,
            containerTop: containerRectTop,
            belongsToComId: comId!,
            belongsToComStatId: statId!,
            pageId,
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
