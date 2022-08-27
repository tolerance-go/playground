// 运行时配置

import { getURLQuery } from '@/helps/getURLQuery';
import { UserControllerLogin } from '@/services/server/UserController';
import delay from 'delay';

// umi getInitialState 不反回，页面不会渲染
export async function getInitialState(): Promise<{
  user: API.ShownUser;
  appId: string;
}> {
  const { userInfo, appId: _appId } = getURLQuery();

  if (!userInfo) {
    throw new Error('缺少用户信息');
  }

  if (!_appId) {
    throw new Error('缺少 appId');
  }

  const appId = _appId as string;

  const partUser = userInfo as Partial<
    Pick<API.ShownUser, 'username' | 'password'>
  >;

  if (!partUser.password || !partUser.username) {
    throw new Error('用户信息不完整');
  }

  const user = await UserControllerLogin({
    username: partUser.username,
    password: partUser.password,
  });

  return { appId, user };
}
