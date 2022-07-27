import qs from 'qs';

export const getURLQuery = () => {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  return query;
};
