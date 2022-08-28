// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 删除 app  DELETE /api/everyWidgetGroup */
export async function WidgetGroupControllerDestroy(
  body: number[],
  options?: { [key: string]: any },
) {
  return request<API.CountResponse>('/api/everyWidgetGroup', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取列表  描述  GET /api/widgetGroups */
export async function WidgetGroupControllerIndex(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetGroupControllerIndexParams,
  options?: { [key: string]: any },
) {
  return request<API.WidgetGroupListResponse>('/api/widgetGroups', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建 app  POST /api/widgetGroups */
export async function WidgetGroupControllerShow(
  body: API.CreationWidgetGroup,
  options?: { [key: string]: any },
) {
  return request<API.WidgetGroupShowResponse>('/api/widgetGroups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取列表  描述  GET /api/widgetGroups-indexIncludeWidgets */
export async function WidgetGroupControllerIndexIncludeWidgets(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetGroupControllerIndexIncludeWidgetsParams,
  options?: { [key: string]: any },
) {
  return request<API.ShownWidgetGroupIncludeWidgetsListResponse>(
    '/api/widgetGroups-indexIncludeWidgets',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 查看  描述  GET /api/widgetGroups/${param0} */
export async function WidgetGroupControllerBaseIndex(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetGroupControllerBaseIndexParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.WidgetGroupShowResponse>(`/api/widgetGroups/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新 app  PUT /api/widgetGroups/${param0} */
export async function WidgetGroupControllerCreate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetGroupControllerCreateParams,
  body: API.UpdationWidgetGroup,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.WidgetGroupShowResponse>(`/api/widgetGroups/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除 app  DELETE /api/widgetGroups/${param0} */
export async function WidgetGroupControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.WidgetGroupControllerUpdateParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.WidgetGroupShowResponse>(`/api/widgetGroups/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
