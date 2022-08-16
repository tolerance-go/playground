import { HistoryManager } from '@/domains/HistoryManager';
import '@umijs/max/typings';
import consola from 'consola';
import { original } from 'immer';

declare global {
  interface Window {
    __original: typeof original;
    __consola: typeof consola;
    __historyManager: HistoryManager;
  }
}
