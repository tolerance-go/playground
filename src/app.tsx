// 运行时配置

import { getURLQuery } from '@/helps/getURLQuery';
import { UserControllerLogin } from '@/services/server/UserController';

// umi getInitialState 不反回，页面不会渲染
export async function getInitialState(): Promise<{
  user: API.ShownUser;
}> {
  const { userInfo } = getURLQuery();

  if (!userInfo) {
    throw new Error('缺少用户信息');
  }

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

  return { user };
}
