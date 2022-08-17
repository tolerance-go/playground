// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取列表  描述  GET /api/databases */
export async function DatabaseControllerIndex(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DatabaseControllerIndexParams,
  options?: { [key: string]: any },
) {
  return request<API.DatabaseListResponse>('/api/databases', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建 data  POST /api/databases */
export async function DatabaseControllerCreate(
  body: API.CreationDatabase,
  options?: { [key: string]: any },
) {
  return request<API.DatabaseShowResponse>('/api/databases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查看  描述  GET /api/databases/${param0} */
export async function DatabaseControllerShow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DatabaseControllerShowParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DatabaseShowResponse>(`/api/databases/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新 data  PUT /api/databases/${param0} */
export async function DatabaseControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DatabaseControllerUpdateParams,
  body: string,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponse>(`/api/databases/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除 app  DELETE /api/databases/${param0} */
export async function DatabaseControllerDestroy(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DatabaseControllerDestroyParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DatabaseShowResponse>(`/api/databases/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
