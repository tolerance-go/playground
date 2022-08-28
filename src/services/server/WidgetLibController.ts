// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 删除 app  DELETE /api/everyWidgetLib */
export async function WidgetLibControllerDestroy(body: number[], options?: { [key: string]: any }) {
  return request<API.CountResponse>('/api/everyWidgetLib', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取列表  描述  GET /api/widgetLibs */
export async function WidgetLibControllerIndex(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetLibControllerIndexParams,
  options?: { [key: string]: any },
) {
  return request<API.WidgetLibListResponse>('/api/widgetLibs', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建 app  POST /api/widgetLibs */
export async function WidgetLibControllerShow(
  body: API.CreationWidgetLib,
  options?: { [key: string]: any },
) {
  return request<API.WidgetLibShowResponse>('/api/widgetLibs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取列表  描述  GET /api/widgetLibs-indexIncludeGroupsAndWidgets */
export async function WidgetLibControllerIndexIncludeGroupsAndWidgets(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetLibControllerIndexIncludeGroupsAndWidgetsParams,
  options?: { [key: string]: any },
) {
  return request<API.ShownWidgetLibIncludeGroupsIncludeWidgetsListResponse>(
    '/api/widgetLibs-indexIncludeGroupsAndWidgets',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查看  描述  GET /api/widgetLibs/${param0} */
export async function WidgetLibControllerBaseIndex(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetLibControllerBaseIndexParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.WidgetLibShowResponse>(`/api/widgetLibs/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新 app  PUT /api/widgetLibs/${param0} */
export async function WidgetLibControllerCreate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetLibControllerCreateParams,
  body: API.UpdationWidgetLib,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.WidgetLibShowResponse>(`/api/widgetLibs/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除 app  DELETE /api/widgetLibs/${param0} */
export async function WidgetLibControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetLibControllerUpdateParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.WidgetLibShowResponse>(`/api/widgetLibs/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
