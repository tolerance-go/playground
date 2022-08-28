import { history } from '@umijs/max';
import { omit } from 'lodash';
import qs from 'qs';
import { getURLQuery } from './getURLQuery';

export const deleteURLQuery = (
  keys: string[],
  method: 'replace' | 'push' = 'push',
) => {
  const query = getURLQuery();

  const next = omit(query, keys);

  history[method](`${history.location.pathname}?${qs.stringify(next)}`);

  return query;
};
