import { HistoryAreaNames } from '@/constants/HistoryAreaNames';
import {
  DataControllerCreate,
  DataControllerDestroy,
  DataControllerIndex,
} from '@/services/server/DataController';
import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { ProColumns, ProFieldValueType } from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import produce from 'immer';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { RecoverParams } from './../domains/HistoryManager';

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

  const { historyManager } = useModel('appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  const getDataList = useMemoizedFn(() => {
    return dataList;
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
    setDataList((prev) => {
      historyManager.commit([
        HistoryAreaNames.DataList,
        {
          commitInfo: {
            type: 'addDataListItem',
            data: item,
          },
          state: prev?.concat(item),
        },
      ]);
      return prev?.concat(item);
    });
  });

  /** 删除 path */
  const deleteData = useMemoizedFn((id: number) => {
    setDataList((prev) => {
      const index = prev?.findIndex((item) => item.id === id);
      if (index !== undefined && index > -1) {
        const draft = [...prev];
        const removed = draft.splice(index, 1);
        historyManager.commit([
          HistoryAreaNames.DataList,
          {
            commitInfo: {
              type: 'deleteDataListItem',
              data: removed[0],
            },
            state: draft,
          },
        ]);
        return draft;
      }

      return prev;
    });
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

  /** 获取数据集合的表格数据 */
  const getTableDataSourceByDataId = useMemoizedFn((dataId: number) => {
    const dataItem = dataList.find((item) => item.id === dataId);
    if (dataItem) {
      return dataItem.data?.dataSource;
    }
  });

  // useUpdateEffect(() => {
  //   if (recoverUpdatingRef.current) {
  //   } else {
  //     historyManager.commit();
  //   }

  //   recoverUpdatingRef.current = false;
  // }, [dataList]);

  useEffect(() => {
    historyManager.registerArea({
      name: HistoryAreaNames.DataList,
      /** state 为空的情况，表示 index 为 -1，组件需要恢复到最初状态 */
      recover: async ({
        index,
        state: currentState,
        commitInfo,
        nextNode,
        direction,
      }: RecoverParams<
        DataListItem[],
        {
          type: 'deleteDataListItem';
          data: DataListItem;
        }
      >) => {
        if (index === -1) {
          setDataList([]);
          return true;
        }

        if (
          direction === 'back' &&
          nextNode?.areasSnapshots[HistoryAreaNames.DataList].commitInfo
            .type === 'deleteDataListItem'
        ) {
          const removedItem = commitInfo.data;
          const { success } = await DataControllerCreate({
            // 这里要加一个 xxxx 来指定创建后的顺序，比如逻辑的 createTime 和 updateTime
            name: removedItem.name,
            desc: removedItem.desc,
            data: JSON.stringify(removedItem.data),
            app_id: removedItem.app_id,
          });
          if (success) {
            setDataList(currentState);
            return true;
          }
        }

        if (
          direction === 'forward' &&
          commitInfo.type === 'deleteDataListItem'
        ) {
          const removedItem = commitInfo.data;
          const { success } = await DataControllerDestroy({
            id: String(removedItem.id),
          });
          if (success) {
            setDataList(currentState);
            return true;
          }
        }

        return false;
      },
      backRecover: () => {},
    });
  }, []);

  return {
    dataList,
    loading,
    dataColumnSettingsConfigs,
    removeDataSource,
    updateDataSource,
    pushDataSource,
    updateColumn,
    addColumn,
    updateData,
    setDataList,
    pushData,
    deleteData,
    getDataList,
    getColumnDataMetaAfterUpdateColumnSettings,
    getColumnDataMetaAfterPushDataSource,
    getColumnDataMetaAfterUpdateDataSource,
    getColumnDataMetaAfterRemoveDataSource,
    getTableDataSourceByDataId,
    getColumnDataMetaAfterAddColumn,
  };
};

export default useDataList;
