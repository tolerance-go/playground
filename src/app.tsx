// 运行时配置

import { getURLQuery } from '@/helps/getURLQuery';
import {
  UserControllerLogin,
  UserControllerShowWithSession,
} from '@/services/server/UserController';
import { deleteURLQuery } from './helps/deleteURLQuery';

// umi getInitialState 不反回，页面不会渲染
export async function getInitialState(): Promise<{
  user: API.ShownUser;
  appId: string;
}> {
  const { userInfo, appId } = getURLQuery() as {
    userInfo?: Partial<Pick<API.ShownUser, 'username' | 'password'>>;
    appId?: string;
  };

  if (!appId) {
    throw new Error('缺少 appId');
  }

  if (userInfo) {
    if (!userInfo.password || !userInfo.username) {
      throw new Error('用户信息不完整');
    }

    const user = await UserControllerLogin({
      username: userInfo.username,
      password: userInfo.password,
    });
    deleteURLQuery(['userInfo'], 'replace');
    return { appId, user };
  } else {
    const user = await UserControllerShowWithSession();
    return { appId, user };
  }
}
