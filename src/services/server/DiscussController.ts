// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取列表  描述  GET /api/discusses */
export async function DiscussControllerIndex(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DiscussControllerIndexParams,
  options?: { [key: string]: any },
) {
  return request<API.DiscussListResponse>('/api/discusses', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建 data  POST /api/discusses */
export async function DiscussControllerCreate(
  body: API.CreationDiscuss,
  options?: { [key: string]: any },
) {
  return request<API.DiscussShowResponse>('/api/discusses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取列表  描述  GET /api/discusses-count-comments */
export async function DiscussControllerCountComments(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DiscussControllerCountCommentsParams,
  options?: { [key: string]: any },
) {
  return request<API.CounterResponse>('/api/discusses-count-comments', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 查看  描述  GET /api/discusses/${param0} */
export async function DiscussControllerShow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DiscussControllerShowParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DiscussShowResponse>(`/api/discusses/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新 data  PUT /api/discusses/${param0} */
export async function DiscussControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DiscussControllerUpdateParams,
  body: API.UpdationDiscuss,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DiscussShowResponse>(`/api/discusses/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除 app  DELETE /api/discusses/${param0} */
export async function DiscussControllerDestroy(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DiscussControllerDestroyParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DiscussShowResponse>(`/api/discusses/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
