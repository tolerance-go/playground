import { DataControllerIndex } from '@/services/server/DataController';
import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { ProColumns, ProFieldValueType } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import produce from 'immer';
import qs from 'qs';
import { useState } from 'react';

export type DataItem = Record<string, any> & {
  id: string;
};

export type DataColumnId = string;

export type DataColumnType = string;

export type DataColumnSettingsType = (
  | {
      type: 'text';
    }
  | {
      type: 'date';
    }
) & {
  defaultValue?: string;
  title?: string;
  id: DataColumnId;
};

export type DataType = {
  columns?: DataTableColumn[];
  dataSource?: DataItem[];
  columnsSettings?: Record<DataColumnId, DataColumnSettingsType>;
};

export type DataTableColumn = Omit<
  ProColumns<DataItem, 'text'>,
  'title' | 'key' | 'valueType'
> & {
  title?: string;
  key: string;
  valueType: ProFieldValueType;
};

export type DataListItem = Omit<API.Data, 'data'> & {
  data?: DataType;
};

const defaultDataColumnsSettingsType: SettingFormConfig = [
  {
    type: 'string',
    name: 'title',
    label: '标题',
  },
  {
    type: 'string',
    name: 'defaultValue',
    label: '默认值',
  },
];

/** 路径管理 */
const useDataList = () => {
  /** 当前激活的 page path */
  const [dataList, setDataList] = useState<DataListItem[]>([]);

  const [dataColumnSettingsConfigs] = useState<
    Record<DataColumnSettingsType['type'], SettingFormConfig>
  >({
    text: [...defaultDataColumnsSettingsType],
    date: [...defaultDataColumnsSettingsType],
  });

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

  /** 返回 data 方便后端接口更新 data json  */
  const getColumnDataMetaAfterAddColumn = useMemoizedFn(
    (
      dataId: number,
      column: DataTableColumn,
    ): {
      index: number;
      data?: DataType;
    } => {
      const index = dataList?.findIndex((item) => item.id === dataId);
      if (index > -1) {
        return {
          index,
          data: {
            ...dataList[index].data,
            columns: (dataList[index].data?.columns ?? []).concat(column),
            columnsSettings: {
              ...dataList[index].data?.columnsSettings,
              [column.key]: {
                id: column.key,
                type: (() => {
                  switch (column.valueType) {
                    case 'text':
                      return 'text';
                    case 'date':
                      return 'date';
                    default:
                      return 'text';
                  }
                })(),
              },
            },
          },
        };
      }
      return {
        index: -1,
      };
    },
  );

  /** 返回 data 方便后端接口更新 data json  */
  const getColumnDataMetaAfterUpdateColumnSettings = useMemoizedFn(
    (
      dataId: number,
      columnId: string,
      columnSettings: Partial<DataColumnSettingsType>,
    ): {
      index: number;
      data?: DataType;
    } => {
      const index = dataList?.findIndex((item) => item.id === dataId);
      if (index > -1) {
        const prevColumnSettings =
          dataList[index].data?.columnsSettings?.[columnId];
        if (prevColumnSettings) {
          return {
            index,
            data: {
              ...dataList[index].data,
              columnsSettings: {
                ...dataList[index].data?.columnsSettings,
                [columnId]: {
                  ...prevColumnSettings,
                  ...columnSettings,
                },
              },
            },
          };
        }
      }
      return {
        index: -1,
      };
    },
  );

  /** 返回 data 方便后端接口更新 data json  */
  const getColumnDataMetaAfterPushDataSource = useMemoizedFn(
    (
      dataId: number,
      record: DataItem,
    ): {
      index: number;
      data?: DataType;
    } => {
      const index = dataList?.findIndex((item) => item.id === dataId);
      if (index > -1) {
        return {
          index,
          data: {
            ...dataList[index].data,
            dataSource: (dataList[index].data?.dataSource ?? []).concat(record),
          },
        };
      }
      return {
        index: -1,
      };
    },
  );

  /** 返回 data 方便后端接口更新 data json  */
  const getColumnDataMetaAfterUpdateDataSource = useMemoizedFn(
    (
      dataId: number,
      recordId: string,
      record: Partial<DataItem>,
    ): {
      index: number;
      data?: DataType;
    } => {
      const index = dataList.findIndex((item) => item.id === dataId);
      if (index > -1) {
        const dataSource = dataList[index].data?.dataSource;
        if (dataSource) {
          const prevRecordIndex = dataSource.findIndex(
            (item) => item.id === recordId,
          );
          // index 存在则 dataSource 一定存在
          if (prevRecordIndex !== undefined && prevRecordIndex > -1) {
            /** 先拷贝再操作！！！ */
            const next = [...dataSource];
            next[prevRecordIndex] = {
              ...dataSource[prevRecordIndex],
              ...record,
            };
            return {
              index,
              data: {
                ...dataList[index].data,
                dataSource: next,
              },
            };
          }
        }
      }

      return {
        index: -1,
      };
    },
  );

  const getColumnDataMetaAfterRemoveDataSource = useMemoizedFn(
    (
      dataId: number,
      recordId: string,
    ): {
      index: number;
      data?: DataType;
    } => {
      const index = dataList.findIndex((item) => item.id === dataId);
      if (index > -1) {
        const dataSource = dataList[index].data?.dataSource;
        if (dataSource) {
          const prevRecordIndex = dataSource.findIndex(
            (item) => item.id === recordId,
          );
          // index 存在则 dataSource 一定存在
          if (prevRecordIndex !== undefined && prevRecordIndex > -1) {
            /** 先拷贝再操作！！！ */
            const next = [...dataSource];
            next.splice(prevRecordIndex, 1);
            return {
              index,
              data: {
                ...dataList[index].data,
                dataSource: next,
              },
            };
          }
        }
      }

      return {
        index: -1,
      };
    },
  );

  const addColumn = useMemoizedFn((dataId: number, column: DataTableColumn) => {
    setDataList(
      produce((draft) => {
        const { index, data } =
          getColumnDataMetaAfterAddColumn(dataId, column) ?? {};
        if (index > -1) {
          draft[index].data = data;
        }
      }),
    );
  });

  const updateColumn = useMemoizedFn(
    (
      dataId: number,
      columnId: string,
      columnSettings: Partial<DataColumnSettingsType>,
    ) => {
      setDataList(
        produce((draft) => {
          const { index, data } =
            getColumnDataMetaAfterUpdateColumnSettings(
              dataId,
              columnId,
              columnSettings,
            ) ?? {};
          if (index > -1) {
            draft[index].data = data;
          }
        }),
      );
    },
  );

  const pushDataSource = useMemoizedFn((dataId: number, record: DataItem) => {
    setDataList(
      produce((draft) => {
        const { index, data } =
          getColumnDataMetaAfterPushDataSource(dataId, record) ?? {};
        if (index > -1) {
          draft[index].data = data;
        }
      }),
    );
  });

  const updateDataSource = useMemoizedFn(
    (dataId: number, recordId: string, record: Partial<DataItem>) => {
      setDataList(
        produce((draft) => {
          const { index, data } =
            getColumnDataMetaAfterUpdateDataSource(dataId, recordId, record) ??
            {};
          if (index > -1) {
            draft[index].data = data;
          }
        }),
      );
    },
  );

  const removeDataSource = useMemoizedFn((dataId: number, recordId: string) => {
    setDataList(
      produce((draft) => {
        const { index, data } =
          getColumnDataMetaAfterRemoveDataSource(dataId, recordId) ?? {};
        if (index > -1) {
          draft[index].data = data;
        }
      }),
    );
  });

  return {
    dataList,
    loading,
    dataColumnSettingsConfigs,
    getColumnDataMetaAfterRemoveDataSource,
    removeDataSource,
    getColumnDataMetaAfterUpdateDataSource,
    updateDataSource,
    getColumnDataMetaAfterPushDataSource,
    pushDataSource,
    getColumnDataMetaAfterUpdateColumnSettings,
    updateColumn,
    getColumnDataMetaAfterAddColumn,
    addColumn,
    updateData,
    setDataList,
    pushData,
    deleteData,
  };
};

export default useDataList;
