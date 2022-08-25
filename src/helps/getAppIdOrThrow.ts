import { getURLQuery } from './getURLQuery';

export const getAppIdOrThrow = (): number => {
  const { appId } = getURLQuery();

  if (!appId) throw new Error('appId 未定义');

  return Number(appId);
};
