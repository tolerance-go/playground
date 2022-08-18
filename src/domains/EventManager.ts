/**
 * 事件管理抽象
 * 组件可以监听它，来执行相关动作
 * 组件可以向他发送事件，触发相关逻辑
 */

import { nanoid } from 'nanoid';

export type EventHandlerParams = { data: any };

export type EventType = string;
export type EventHandlerId = string;
export type EventHandler = (params: EventHandlerParams) => void;

export class EventManager {
  /** 全局注册组件对应事件类型的处理方法 */
  private handlerCenter: Record<
    EventType,
    Record<EventHandlerId, EventHandler>
  > = {};

  public listen<D = any>(
    eventType: string,
    callback: (event: { data: D }) => void,
  ) {
    const eventHandlerId = nanoid();

    if (this.handlerCenter[eventType] === undefined) {
      this.handlerCenter[eventType] = {};
    }

    if (this.handlerCenter[eventType][eventHandlerId] === undefined) {
      this.handlerCenter[eventType][eventHandlerId] = callback;
    } else {
      this.handlerCenter[eventType] = {
        [eventHandlerId]: callback,
      };
    }

    return eventHandlerId;
  }

  public listenAll(eventTypes: string[], callback: (data: any) => void) {
    return eventTypes.map((eventType) => this.listen(eventType, callback));
  }

  public unlistenAll(eventTypes: string[], handlerIds: string[]) {
    eventTypes.forEach((eventType) => {
      handlerIds.forEach((handlerId) => {
        this.unlisten(eventType, handlerId);
      });
    });
  }

  public unlisten(eventType: string, handlerId: string) {
    delete this.handlerCenter[eventType][handlerId];
  }

  public dispatch(eventType: string, data: any) {
    const eventHandlers = this.handlerCenter[eventType];

    Object.keys(eventHandlers ?? {}).forEach((eventHandlerId) => {
      eventHandlers[eventHandlerId]?.({
        data,
      });
    });
  }
}
