import { useCallback, useRef } from 'react';
import { Updater, useImmer } from 'use-immer';

type GetStateAction<S> = () => S;

function useGetImmer<S>(
  initialState: S | (() => S),
): [S, Updater<S>, GetStateAction<S>];
function useGetImmer<S = undefined>(): [
  S | undefined,
  Updater<S | undefined>,
  GetStateAction<S | undefined>,
];
function useGetImmer<S>(initialState?: S) {
  const [state, setState] = useImmer(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const getState = useCallback(() => stateRef.current, []);

  return [state, setState, getState];
}

export { useGetImmer };
export default useGetImmer;
