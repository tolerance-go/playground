// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 登录  POST /api/login */
export async function UserControllerLogin(body: API.LoginAuth, options?: { [key: string]: any }) {
  return request<API.UserShowResponse>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 登出  GET /api/logout */
export async function UserControllerLogout(options?: { [key: string]: any }) {
  return request<API.UserShowResponse>('/api/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 用户文件上传  POST /api/upload */
export async function UserControllerUpload(options?: { [key: string]: any }) {
  return request<API.StringArrayResponse>('/api/upload', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取列表  描述  GET /api/users */
export async function UserControllerIndex(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UserControllerIndexParams,
  options?: { [key: string]: any },
) {
  return request<API.UserListResponse>('/api/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建 app  POST /api/users */
export async function UserControllerCreate(
  body: API.CreationUser,
  options?: { [key: string]: any },
) {
  return request<API.UserShowResponse>('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 查看  描述  GET /api/users-show-with-session */
export async function UserControllerShowWithSession(options?: { [key: string]: any }) {
  return request<API.UserShowResponse>('/api/users-show-with-session', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 查看  描述  GET /api/users/${param0} */
export async function UserControllerShow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UserControllerShowParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.UserShowResponse>(`/api/users/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新 app  PUT /api/users/${param0} */
export async function UserControllerUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UserControllerUpdateParams,
  body: API.UpdationUser,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.UserShowResponse>(`/api/users/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除 app  DELETE /api/users/${param0} */
export async function UserControllerDestroy(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.UserControllerDestroyParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.UserShowResponse>(`/api/users/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
