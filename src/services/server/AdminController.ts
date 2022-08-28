// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取列表  描述  GET /api/admin/gen-widgets */
export async function AdminControllerIndex(options?: { [key: string]: any }) {
  return request<API.ResultResponse>('/api/admin/gen-widgets', {
    method: 'GET',
    ...(options || {}),
  });
}
