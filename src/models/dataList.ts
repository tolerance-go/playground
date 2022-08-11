import { DataControllerIndex } from '@/services/server/DataController';
import { ProColumns } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import produce from 'immer';
import qs from 'qs';
import { useState } from 'react';

export type DataItem = Record<string, any>;

export type DataType = {
  columns?: DataTableColumn[];
  dataSource?: DataItem[];
};

export type DataTableColumn = Omit<ProColumns<DataItem, 'text'>, 'title'> & {
  title?: string;
};

export type DataListItem = Omit<API.Data, 'data'> & {
  data?: DataType;
};

/** 路径管理 */
const useDataList = () => {
  /** 当前激活的 page path */
  const [dataList, setDataList] = useState<DataListItem[]>([]);

  const { loading } = useRequest(
    async () => {
      const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });
      const { appId } = query;

      if (!appId) {
        message.warn('query appId 缺失');
        return;
      }

      return DataControllerIndex({
        appId: Number(appId),
      });
    },
    {
      onSuccess: (data?: API.Data[]) => {
        setDataList(
          data?.map((item) => {
            return {
              ...item,
              data: JSON.parse(item.data ?? '{}'),
            };
          }) ?? [],
        );
      },
    },
  );

  /** 尾部插入 */
  const pushData = useMemoizedFn((item: DataListItem) => {
    setDataList((prev) => prev?.concat(item));
  });

  /** 删除 path */
  const deleteData = useMemoizedFn((id: number) => {
    setDataList(
      produce((draft) => {
        const index = draft?.findIndex((item) => item.id === id);
        if (index !== undefined && index > -1) {
          draft?.splice(index, 1);
        }
      }),
    );
  });

  const updateData = useMemoizedFn(
    (id: number, item: Partial<DataListItem>) => {
      setDataList(
        produce((draft) => {
          const index = draft?.findIndex((item) => item.id === id);
          if (index !== undefined && index > -1) {
            draft[index] = {
              ...draft[index],
              ...item,
            };
          }
        }),
      );
    },
  );

  const addColumn = useMemoizedFn((id: number, column: DataTableColumn) => {
    setDataList(
      produce((draft) => {
        const index = draft?.findIndex((item) => item.id === id);
        if (index > -1) {
          draft[index].data = {
            ...draft[index].data,
            columns: (draft[index].data?.columns ?? []).concat(column),
          };
        }
      }),
    );
  });

  return {
    dataList,
    loading,
    addColumn,
    updateData,
    setDataList,
    pushData,
    deleteData,
  };
};

export default useDataList;
