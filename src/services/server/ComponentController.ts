// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 获取列表  描述  GET /api/components */
export async function ComponentControllerIndex(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ComponentControllerIndexParams,
  options?: { [key: string]: any },
) {
  return request<API.ComponentListResponse>('/api/components', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建 component  POST /api/components */
export async function ComponentControllerCreate(
  body: API.CreationComponent,
  options?: { [key: string]: any },
) {
  return request<API.ComponentShowResponse>('/api/components', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查看  描述  GET /api/components/${param0} */
export async function ComponentControllerShow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ComponentControllerShowParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ComponentShowResponse>(`/api/components/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新 component  PUT /api/components/${param0} */
export async function ComponentControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ComponentControllerUpdateParams,
  body: string,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponse>(`/api/components/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除 app  DELETE /api/components/${param0} */
export async function ComponentControllerDestroy(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.ComponentControllerDestroyParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.ComponentShowResponse>(`/api/components/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 创建 component  POST /api/components/createWithRelation */
export async function ComponentControllerCreateWithRelation(
  body: API.CreationWithRelationComponent,
  options?: { [key: string]: any },
) {
  return request<API.CreationWithRelationComponentResponse>('/api/components/createWithRelation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
