import { HISTORY_AREA_NAMES } from '@/constants/HistoryAreaNames';
import { RecoverParams } from '@/domains/HistoryManager';
import {
  DatabaseControllerCreate,
  DatabaseControllerDestroy,
  DatabaseControllerIndex,
} from '@/services/server/DatabaseController';
import { SettingFormConfig } from '@/typings/SettingFormConfig';
import { moveOffsetArrayItem } from '@/utils/moveOffsetArrayItem';
import { ProColumns, ProFieldValueType } from '@ant-design/pro-components';
import { useModel,  } from '@umijs/max';
import { useMemoizedFn,useRequest } from 'ahooks';
import { message } from 'antd';
import produce from 'immer';
import qs from 'qs';
import { useRef, useState } from 'react';

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

export type DataListItem = Omit<API.ShownDatabase, 'data'> & {
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

  const { historyManager } = useModel('app.appStateHistory', (model) => ({
    historyManager: model.historyManager,
  }));

  const tagWithTriggerUpdateByRecoverUpdateDataListItemRef = useRef<boolean>(false);

  const getDataList = useMemoizedFn(() => {
    return dataList;
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
              id,
            };
          }
        }),
      );
    },
  );

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

      return DatabaseControllerIndex({
        appId: Number(appId),
      });
    },
    {
      onSuccess: (data?: API.ShownDatabase[]) => {
        const dataList =
          data?.map((item) => {
            return {
              ...item,
              data: JSON.parse(item.data ?? '{}'),
            };
          }) ?? [];

        setDataList(dataList);

        historyManager.registerArea({
          name: HISTORY_AREA_NAMES.DATA_LIST,
          getInitialState: () => {
            return dataList;
          },
          pull: () => {
            return getDataList();
          },
          /** state 为空的情况，表示 index 为 -1，组件需要恢复到最初状态 */
          recover: async ({
            state,
            commitInfo,
            nextNode,
            snapshotsStack,
            direction,
            currentNode,
            index,
          }: RecoverParams<
            DataListItem[],
            | {
                type: 'deleteDataListItem';
                data: DataListItem;
              }
            | {
                type: 'addDataListItem';
                data: DataListItem;
              }
            | {
                type: 'updateDataListItem';
                data: DataListItem;
              }
          >) => {
            if (direction === 'back') {
              if (
                nextNode?.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                  .commitInfo.type === 'deleteDataListItem'
              ) {
                // 回退操作
                // 回退前 nextNode，操作为 删除一项目
                // 我们需要新增一个项目
                const removedItem =
                  nextNode?.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                    .commitInfo.data;

                const { success, data } = await DatabaseControllerCreate({
                  name: removedItem.name,
                  desc: removedItem.desc,
                  data: JSON.stringify(removedItem.data),
                  app_id: String(removedItem.app_id),
                  logic_created_at: removedItem.createdAt,
                  logic_updated_at: removedItem.updatedAt,
                });

                // 新增成功后
                if (success) {
                  // 需要更新历史数据
                  // 1. 回退前删除的 info 里面的项目，因为删除后 state 没有，我们不用管
                  nextNode.changedAreasSnapshots[
                    HISTORY_AREA_NAMES.DATA_LIST
                  ].commitInfo.data = data!;
                  // 2. 当前 node 往后，直到找到第一次添加 removedItem 的地方停止，替换 info 和 state 中的所有数据
                  for (let floatIndex = index; floatIndex > -1; floatIndex--) {
                    if (
                      snapshotsStack[floatIndex].areasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ]
                    ) {
                      snapshotsStack[floatIndex].areasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ].state = snapshotsStack[floatIndex].areasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ].state.map((item) => {
                        if (item.id === removedItem.id) {
                          return data!;
                        }
                        return item;
                      });
                    }

                    if (
                      snapshotsStack[floatIndex].changedAreasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ]?.commitInfo.type === 'addDataListItem' &&
                      snapshotsStack[floatIndex].changedAreasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ].commitInfo.data.id === removedItem.id
                    ) {
                      snapshotsStack[floatIndex].changedAreasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ].commitInfo.data = data!;

                      break;
                    }
                  }

                  setDataList(
                    currentNode.areasSnapshots[HISTORY_AREA_NAMES.DATA_LIST].state,
                  );
                }

                return { success };
              }
              if (
                nextNode?.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                  .commitInfo.type === 'addDataListItem'
              ) {
                const addedItem =
                  nextNode?.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                    .commitInfo.data;
                const { success } = await DatabaseControllerDestroy({
                  id: String(addedItem.id),
                });
                if (success) {
                  setDataList(state);
                }
                return { success };
              }

              if (
                nextNode?.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                  .commitInfo.type === 'updateDataListItem'
              ) {
                const updatedItem =
                  nextNode.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                    .commitInfo.data;

                tagWithTriggerUpdateByRecoverUpdateDataListItemRef.current = true;

                updateData(
                  updatedItem.id,
                  state.find((item) => item.id === updatedItem.id)!,
                );

                return {
                  success: true,
                };
              }
            }

            if (direction === 'forward') {
              if (
                currentNode.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                  .commitInfo.type === 'deleteDataListItem'
              ) {
                const removedItem = commitInfo.data;
                const { success } = await DatabaseControllerDestroy({
                  id: String(removedItem.id),
                });
                if (success) {
                  setDataList(state);
                }
                return { success };
              }

              if (
                currentNode.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                  .commitInfo.type === 'addDataListItem'
              ) {
                // 前进操作
                // 前进后为 currentNode，操作为 增加一个项目
                // 我们需要重新增加一个项目

                const addedItem =
                  currentNode.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                    .commitInfo.data;
                const { success, data } = await DatabaseControllerCreate({
                  // 这里要加一个 xxxx 来指定创建后的顺序，比如逻辑的 createTime 和 updateTime
                  name: addedItem.name,
                  desc: addedItem.desc,
                  data: JSON.stringify(addedItem.data),
                  app_id: addedItem.app_id,
                  logic_created_at: addedItem.createdAt,
                  logic_updated_at: addedItem.updatedAt,
                });

                // 新增成功后

                if (success) {
                  // 需要更新历史数据
                  // 1. 当前节点之前新增的数据，替换成新的新增
                  const oldAddedItem =
                    currentNode.changedAreasSnapshots[HISTORY_AREA_NAMES.DATA_LIST]
                      .commitInfo.data;

                  currentNode.changedAreasSnapshots[
                    HISTORY_AREA_NAMES.DATA_LIST
                  ].commitInfo.data = addedItem;

                  // 2. 当前 node 往前，直到首次出现删除 addedItem 的地方，替换 info 和 state 中的所有数据

                  for (
                    let floatIndex = index;
                    floatIndex < snapshotsStack.length;
                    floatIndex++
                  ) {
                    if (
                      snapshotsStack[floatIndex].areasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ]
                    ) {
                      snapshotsStack[floatIndex].areasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ].state = snapshotsStack[floatIndex].areasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ].state.map((item) => {
                        if (item.id === oldAddedItem.id) {
                          return data!;
                        }
                        return item;
                      });
                    }

                    if (
                      snapshotsStack[floatIndex].changedAreasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ]?.commitInfo.type === 'deleteDataListItem' &&
                      snapshotsStack[floatIndex].changedAreasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ].commitInfo.data.id === oldAddedItem.id
                    ) {
                      snapshotsStack[floatIndex].changedAreasSnapshots[
                        HISTORY_AREA_NAMES.DATA_LIST
                      ].commitInfo.data = data!;

                      break;
                    }
                  }

                  setDataList(
                    currentNode.areasSnapshots[HISTORY_AREA_NAMES.DATA_LIST].state,
                  );
                }

                return { success };
              }
            }

            setDataList(state);
            return { success: true };
          },
        });
      },
    },
  );

  /** 尾部插入 */
  const pushData = useMemoizedFn((item: DataListItem) => {
    setDataList((prev) => {
      historyManager.commit({
        [HISTORY_AREA_NAMES.DATA_LIST]: {
          commitInfo: {
            type: 'addDataListItem',
            data: item,
          },
          state: prev?.concat(item),
        },
      });
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
        historyManager.commit({
          [HISTORY_AREA_NAMES.DATA_LIST]: {
            commitInfo: {
              type: 'deleteDataListItem',
              data: removed[0],
            },
            state: draft,
          },
        });
        return draft;
      }

      return prev;
    });
  });

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

  const getColumnDataMetaAfterDeleteColumn = useMemoizedFn(
    (
      dataId: number,
      column: DataTableColumn,
    ): {
      index: number;
      data?: DataType;
    } => {
      const index = dataList?.findIndex((item) => item.id === dataId);
      if (index > -1) {
        const nextColumns = [...(dataList[index].data?.columns ?? [])];
        const columnIndex = nextColumns.findIndex(
          (item) => item.key === column.key,
        );

        if (columnIndex > -1) {
          const [removed] = nextColumns.splice(columnIndex, 1);

          const nextColsSettings = {
            ...dataList[index].data?.columnsSettings,
          };

          delete nextColsSettings[removed.key];

          return {
            index,
            data: {
              ...dataList[index].data,
              columns: nextColumns,
              columnsSettings: nextColsSettings,
            },
          };
        }
      }
      return {
        index: -1,
      };
    },
  );

  const getColumnDataMetaAfterMoveOffsetColumn = useMemoizedFn(
    (
      dataId: number,
      column: DataTableColumn,
      offset: 1 | -1,
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
            columns: moveOffsetArrayItem(
              dataList[index].data?.columns ?? [],
              (item) => item.key === column.key,
              offset,
            ),
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

  const addDataListItemColumn = useMemoizedFn(
    (dataId: number, column: DataTableColumn) => {
      setDataList(
        produce((draft) => {
          const { index, data } =
            getColumnDataMetaAfterAddColumn(dataId, column) ?? {};
          if (index > -1) {
            draft[index].data = data;
          }
        }),
      );
    },
  );

  const deleteDataListItemColumn = useMemoizedFn(
    (dataId: number, column: DataTableColumn) => {
      setDataList(
        produce((draft) => {
          const { index, data } =
            getColumnDataMetaAfterDeleteColumn(dataId, column) ?? {};
          if (index > -1) {
            draft[index].data = data;
          }
        }),
      );
    },
  );

  const updateDataListItemData = useMemoizedFn(
    (dataId: number, data: DataType) => {
      setDataList(
        produce((draft) => {
          const index = draft?.findIndex((item) => item.id === dataId);
          if (index > -1) {
            draft[index].data = {
              ...draft[index].data,
              ...data,
            };
          }
        }),
      );
    },
  );

  const moveLeftDataListItemColumn = useMemoizedFn(
    (dataId: number, column: DataTableColumn) => {
      setDataList(
        produce((draft) => {
          const { index, data } =
            getColumnDataMetaAfterMoveOffsetColumn(dataId, column, -1) ?? {};
          if (index > -1) {
            draft[index].data = data;
          }
        }),
      );
    },
  );

  const moveRightDataListItemColumn = useMemoizedFn(
    (dataId: number, column: DataTableColumn) => {
      setDataList(
        produce((draft) => {
          const { index, data } =
            getColumnDataMetaAfterMoveOffsetColumn(dataId, column, 1) ?? {};
          if (index > -1) {
            draft[index].data = data;
          }
        }),
      );
    },
  );

  const updateDataListItemColumn = useMemoizedFn(
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

  const pushDataListItemDataSource = useMemoizedFn(
    (dataId: number, record: DataItem) => {
      setDataList(
        produce((draft) => {
          const { index, data } =
            getColumnDataMetaAfterPushDataSource(dataId, record) ?? {};
          if (index > -1) {
            draft[index].data = data;
          }
        }),
      );
    },
  );

  const updateDataListItemDataSource = useMemoizedFn(
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

  const removeDataListItemDataSource = useMemoizedFn(
    (dataId: number, recordId: string) => {
      setDataList(
        produce((draft) => {
          const { index, data } =
            getColumnDataMetaAfterRemoveDataSource(dataId, recordId) ?? {};
          if (index > -1) {
            draft[index].data = data;
          }
        }),
      );
    },
  );

  /** 获取数据集合的表格数据 */
  const getTableDataSourceByDataId = useMemoizedFn((dataId: number) => {
    const dataItem = dataList.find((item) => item.id === dataId);
    if (dataItem) {
      return dataItem.data?.dataSource;
    }
  });

  return {
    dataList,
    loading,
    dataColumnSettingsConfigs,
    removeDataListItemDataSource,
    updateDataListItemDataSource,
    pushDataListItemDataSource,
    updateDataListItemColumn,
    addDataListItemColumn,
    moveLeftDataListItemColumn,
    moveRightDataListItemColumn,
    deleteDataListItemColumn,
    updateDataListItemData,
    updateData,
    pushData,
    deleteData,
    setDataList,
    getDataList,
    getColumnDataMetaAfterUpdateColumnSettings,
    getColumnDataMetaAfterPushDataSource,
    getColumnDataMetaAfterUpdateDataSource,
    getColumnDataMetaAfterRemoveDataSource,
    getTableDataSourceByDataId,
    getColumnDataMetaAfterAddColumn,
    tagWithTriggerUpdateByRecoverUpdateDataListItemRef,
  };
};

export default useDataList;
