import { getURLQuery } from '@/helps/getURLQuery';
import { UserControllerLogin } from '@/services/server/UserController';
import { useGetImmer } from '@/utils/useGetImmer';
import { useRequest } from 'ahooks';

export default () => {
  const [user, setUser, getUser] = useGetImmer<API.ShownUser>();

  useRequest(
    async () => {
      const { userInfo } = getURLQuery();

      if (!userInfo) return;

      const partUser = userInfo as Pick<API.ShownUser, 'username' | 'password'>;

      const user = await UserControllerLogin({
        username: partUser.username,
        password: partUser.password,
      });

      return user;
    },
    {
      onSuccess: (data) => {
        setUser(data);
      },
    },
  );

  return {
    user,
    getUser,
  };
};
