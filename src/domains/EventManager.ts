/**
 * 事件管理抽象
 * 组件可以监听它，来执行相关动作
 * 组件可以向他发送事件，触发相关逻辑
 */

import { ComId, EventId, StatId } from '@/typings/keys';
import { nanoid } from 'nanoid';

export type EventHandlerParams = { event: Event; data: any };

export type EventType = string;
export type EventHandlerId = string;
export type EventHandler = (params: EventHandlerParams) => void;
export type Event = {
  id: string;
  type: string;
  settings: object;
  execComId: string;
  execComStatId: string;
  execComStatActionId: string;
};

export class EventManager {
  /** 全局注册组件发生事件及后续执行目标组件 */
  private eventCenter: Record<ComId, Record<StatId, Record<EventId, Event>>> =
    {};

  /** 全局注册组件对应事件类型的处理方法 */
  private handlerCenter: Record<
    ComId,
    Record<StatId, Record<EventType, Record<EventHandlerId, EventHandler>>>
  > = {};

  /** 注册事件 */
  public register(comId: string, statId: string, event: Event) {
    if (this.eventCenter[comId] === undefined) {
      this.eventCenter[comId] = {};
    }

    if (this.eventCenter[comId][statId]) {
      this.eventCenter[comId][statId][event.id] = event;
    } else {
      this.eventCenter[comId][statId] = {
        [event.id]: event,
      };
    }
  }

  /** 更新注册事件 */
  public update(
    comId: string,
    statId: string,
    event: Partial<Event> & Pick<Event, 'id'>,
  ) {
    this.eventCenter[comId][statId][event.id] = {
      ...this.eventCenter[comId][statId][event.id],
      ...event,
    };
  }

  /** 卸载事件 */
  public uninstalled(comId: string, statId: string, eventId: string) {
    delete this.eventCenter[comId][statId][eventId];
  }

  public listen(
    eventType: string,
    callback: (data: any) => void,
    target: {
      comId: string;
      statId: string;
    },
  ) {
    const { comId, statId } = target;

    const eventHandlerId = nanoid();

    if (this.handlerCenter[comId] === undefined) {
      this.handlerCenter[comId] = {};
    }

    if (this.handlerCenter[comId][statId] === undefined) {
      this.handlerCenter[comId][statId] = {};
    }

    if (this.handlerCenter[comId][statId][eventType] === undefined) {
      this.handlerCenter[comId][statId][eventType] = {};
    }

    if (
      this.handlerCenter[comId][statId][eventType][eventHandlerId] === undefined
    ) {
      this.handlerCenter[comId][statId][eventType][eventHandlerId] = callback;
    } else {
      this.handlerCenter[comId][statId][eventType] = {
        [eventHandlerId]: callback,
      };
    }

    return eventHandlerId;
  }

  public unlisten(
    eventType: string,
    handlerId: string,
    target: {
      comId: string;
      statId: string;
    },
  ) {
    const { comId, statId } = target;

    delete this.handlerCenter[comId][statId][eventType][handlerId];
  }

  public dispatch(
    eventType: string,
    data: any,
    from: {
      comId: string;
      statId: string;
    },
  ) {
    const { comId, statId } = from;

    if (this.eventCenter[comId] && this.eventCenter[comId][statId]) {
      /** 找到该类型对应注册事件 */
      const hitEventIds = Object.keys(this.eventCenter[comId][statId]).filter(
        (eventId) => {
          const event = this.eventCenter[comId][statId][eventId];
          return event.type === eventType;
        },
      );

      hitEventIds.forEach((eventId) => {
        const event = this.eventCenter[comId][statId][eventId];
        /** 找到对应的执行对象 */
        const eventHandlers =
          this.handlerCenter[event.execComId][event.execComStatId][eventType];

        Object.keys(eventHandlers).forEach((eventHandlerId) => {
          eventHandlers[eventHandlerId]?.({
            event,
            data,
          });
        });
      });
    }
  }
}