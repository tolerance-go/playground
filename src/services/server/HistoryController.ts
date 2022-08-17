// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取列表  描述  GET /api/histories */
export async function HistoryControllerIndex(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.HistoryControllerIndexParams,
  options?: { [key: string]: any },
) {
  return request<API.HistoryListResponse>('/api/histories', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建 component  POST /api/histories */
export async function HistoryControllerCreate(
  body: API.CreationHistory,
  options?: { [key: string]: any },
) {
  return request<API.HistoryShowResponse>('/api/histories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查看  描述  GET /api/histories/${param0} */
export async function HistoryControllerShow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.HistoryControllerShowParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.HistoryShowResponse>(`/api/histories/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新 component  PUT /api/histories/${param0} */
export async function HistoryControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.HistoryControllerUpdateParams,
  body: string,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponse>(`/api/histories/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除 app  DELETE /api/histories/${param0} */
export async function HistoryControllerDestroy(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.HistoryControllerDestroyParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.HistoryShowResponse>(`/api/histories/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
