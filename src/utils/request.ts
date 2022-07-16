import { Request } from '@/.umi/plugin-request/request';
import { request as umiRequest } from '@umijs/max';

/** 封装后，不会继续抛出异常 */
export const request: Request = (
  url: string,
  opts: any = { method: 'GET' },
) => {
  return umiRequest(url, opts)
    .then((data) => {
      return {
        success: true,
        data,
      };
    })
    .catch((error) => error);
};
