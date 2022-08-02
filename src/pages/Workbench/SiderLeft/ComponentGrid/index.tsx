import { useModel } from '@umijs/max';
import { Affix, Card, Row, Tabs, Typography } from 'antd';
import consola from 'consola';
import { nanoid } from 'nanoid';
import React, { useRef } from 'react';

const { TabPane } = Tabs;

const gridStyle: React.CSSProperties = {
  width: '50%',
  textAlign: 'center',
  padding: 14,
  cursor: 'pointer',
};

const App = ({ siderRef }: { siderRef: React.RefObject<HTMLDivElement> }) => {
  const { addComponentToStage, addComToStageSlot } = useModel(
    'stageComponentsModel',
    (model) => ({
      addComponentToStage: model?.addComponentToStage,
      addComToStageSlot: model?.addComToStageSlot,
    }),
  );

  const { getLatestComsInitalSettings } = useModel(
    'componentsSettingConfigs',
    (model) => ({
      getLatestComsInitalSettings: model?.getLatestComsInitalSettings,
    }),
  );

  const { focusComId, focusSlotName, focusSlotPosition } = useModel(
    'slotsInsert',
    (model) => ({
      focusComId: model?.focusComId,
      focusSlotName: model?.focusSlotName,
      focusSlotPosition: model?.focusSlotPosition,
    }),
  );

  const { setSelectedComponentStatusId } = useModel(
    'selectedComponentStatusId',
    (model) => ({
      setSelectedComponentStatusId: model?.setSelectedComponentStatusId,
    }),
  );

  const { initComStatus } = useModel('statusSettings', (model) => ({
    initComStatus: model?.initComStatus,
  }));

  const { setComStatusSettingsDefaults } = useModel(
    'statusSettingsDefaults',
    (model) => ({
      setComStatusSettingsDefaults: model.setComStatusSettingsDefaults,
    }),
  );

  const { setStageSelectNodeId } = useModel('stageSelectNodeId', (model) => ({
    setStageSelectNodeId: model?.setStageSelectNodeId,
  }));

  const { mode: siderLeftMode } = useModel('siderLeftMode', (model) => ({
    mode: model?.mode,
  }));

  const ref = useRef<HTMLDivElement>(null);

  const { triggerSaveTimeChange } = useModel('stageAutoSave', (model) => {
    return {
      triggerSaveTimeChange: model?.triggerPrepareSaveTimeChange,
    };
  });

  return (
    <div ref={ref}>
      <Tabs
        style={{
          padding: 15,
        }}
        key="item1"
        defaultActiveKey="1"
        size="small"
        destroyInactiveTabPane
      >
        {[
          {
            title: 'Web',
            type: 'tabs',
            children: [
              {
                title: '通用',
                type: 'group',
                children: [
                  {
                    type: 'item',
                    name: 'button',
                    title: '按钮',
                  },
                  {
                    type: 'item',
                    name: 'icon',
                    title: '图标',
                  },
                  {
                    type: 'item',
                    name: 'typography',
                    title: '排版',
                  },
                ],
              },
              {
                title: '布局',
                type: 'group',
                children: [
                  { type: 'item', name: '', title: '分割线' },
                  { type: 'item', name: '', title: '栅格' },
                  { type: 'item', name: '', title: '布局' },
                  { type: 'item', name: '', title: '间距' },
                ],
              },
              {
                title: '导航',
                type: 'group',
                children: [
                  { type: 'item', name: '', title: '固钉' },
                  { type: 'item', name: '', title: '面包屑' },
                  { type: 'item', name: '', title: '下拉菜单' },
                  { type: 'item', name: '', title: '导航菜单' },
                  { type: 'item', name: '', title: '页头' },
                  { type: 'item', name: '', title: '分页' },
                  { type: 'item', name: '', title: '步骤条' },
                ],
              },
              {
                title: '数据录入',
                type: 'group',
                children: [
                  { type: 'item', name: '', title: '自动完成' },
                  { type: 'item', name: '', title: '级联选择' },
                  { type: 'item', name: '', title: '多选框' },
                  { type: 'item', name: '', title: '日期选择框' },
                  { type: 'item', name: '', title: '表单' },
                  { type: 'item', name: '', title: '输入框' },
                  { type: 'item', name: '', title: '数字输入框' },
                  { type: 'item', name: '', title: '提及' },
                  { type: 'item', name: '', title: '单选框' },
                  { type: 'item', name: '', title: '评分' },
                  { type: 'item', name: '', title: '选择器' },
                  { type: 'item', name: '', title: '滑动输入条' },
                  { type: 'item', name: '', title: '开关' },
                  { type: 'item', name: '', title: '时间选择框' },
                  { type: 'item', name: '', title: '穿梭框' },
                  { type: 'item', name: '', title: '树选择' },
                  { type: 'item', name: '', title: '上传' },
                ],
              },
              {
                title: '数据展示',
                type: 'group',
                children: [
                  { type: 'item', name: '', title: '头像' },
                  { type: 'item', name: '', title: '徽标数' },
                  { type: 'item', name: '', title: '日历' },
                  { type: 'item', name: '', title: '卡片' },
                  { type: 'item', name: '', title: '走马灯' },
                  { type: 'item', name: '', title: '折叠面板' },
                  { type: 'item', name: '', title: '评论' },
                  { type: 'item', name: '', title: '描述列表' },
                  { type: 'item', name: '', title: '空状态' },
                  { type: 'item', name: '', title: '图片' },
                  { type: 'item', name: '', title: '列表' },
                  { type: 'item', name: '', title: '气泡卡片' },
                  { type: 'item', name: '', title: '分段控制器' },
                  { type: 'item', name: '', title: '统计数值' },
                  { type: 'item', name: '', title: '表格' },
                  { type: 'item', name: '', title: '标签页' },
                  { type: 'item', name: '', title: '标签' },
                  { type: 'item', name: '', title: '时间轴' },
                  { type: 'item', name: '', title: '文字提示' },
                  { type: 'item', name: '', title: '树形控件' },
                ],
              },
              {
                title: '反馈',
                type: 'group',
                children: [
                  { type: 'item', name: '', title: '警告提示' },
                  { type: 'item', name: '', title: '抽屉' },
                  { type: 'item', name: '', title: '全局提示' },
                  { type: 'item', name: '', title: '对话框' },
                  { type: 'item', name: '', title: '通知提醒框' },
                  { type: 'item', name: '', title: '气泡确认框' },
                  { type: 'item', name: '', title: '进度条' },
                  { type: 'item', name: '', title: '结果' },
                  { type: 'item', name: '', title: '骨架屏' },
                  { type: 'item', name: '', title: '加载中' },
                ],
              },
              {
                title: '其他',
                type: 'group',
                children: [
                  { type: 'item', name: '', title: '锚点' },
                  { type: 'item', name: '', title: '回到顶部' },
                  { type: 'item', name: '', title: '全局化配置' },
                ],
              },
            ],
          },
          {
            title: '图表',
            type: 'tabs',
            children: [
              {
                title: '折线图',
                type: 'group',
                children: [
                  {
                    type: 'item',
                    name: 'line',
                    title: '基础折线图',
                  },
                  {
                    type: 'item',
                    name: '阶梯折线图',
                    title: '阶梯折线图',
                  },
                  {
                    type: 'item',
                    name: '多折线图',
                    title: '多折线图',
                  },
                ],
              },
            ],
          },
          ...(siderLeftMode === 'insert'
            ? []
            : [
                {
                  title: '框架',
                  type: 'tabs',
                  children: [
                    {
                      title: '通用',
                      type: 'group',
                      children: [
                        {
                          type: 'item',
                          name: 'admin',
                          title: '基础管理后台',
                        },
                      ],
                    },
                  ],
                },
              ]),
        ].map((tabItem) => {
          return (
            <TabPane tab={tabItem.title} key={tabItem.title}>
              {tabItem.children.map((group) => {
                return (
                  <div key={group.title}>
                    <Affix offsetTop={0} target={() => siderRef.current}>
                      <Row
                        style={{
                          padding: `15px 5px 15px 5px`,
                          background: '#fff',
                        }}
                      >
                        <Typography.Text
                          style={{
                            fontSize: 14,
                          }}
                          strong
                        >
                          {group.title}
                        </Typography.Text>
                      </Row>
                    </Affix>
                    <Card
                      key={group.title}
                      bordered={false}
                      size="small"
                      style={{
                        /** 左右空 1px 防止滚动的时候，标题挡住 */
                        margin: '0 1px',
                      }}
                    >
                      {group.children.map((item) => {
                        return (
                          <Card.Grid
                            key={item.title}
                            hoverable={false}
                            style={gridStyle}
                            onClick={() => {
                              const newComId = nanoid();
                              const statusId = nanoid();
                              if (item.name === 'button') {
                                if (siderLeftMode === 'insert') {
                                  if (!focusComId || !focusSlotName) {
                                    throw new Error(
                                      '当前 focusCom 信息异常消失',
                                    );
                                  }

                                  addComToStageSlot({
                                    parentId: focusComId,
                                    newId: newComId,
                                    slotName: focusSlotName,
                                    type: 'button',
                                    display: 'inline',
                                    postion: focusSlotPosition,
                                  });
                                } else {
                                  consola.info('添加新组件到舞台');
                                  addComponentToStage('button', {
                                    id: newComId,
                                    display: 'inline',
                                    parentId: 'root',
                                    slotName: 'root',
                                  });
                                }
                              } else if (item.name === 'line') {
                                if (siderLeftMode === 'insert') {
                                  if (!focusComId || !focusSlotName) {
                                    throw new Error(
                                      '当前 focusCom 信息异常消失',
                                    );
                                  }

                                  addComToStageSlot({
                                    parentId: focusComId,
                                    newId: newComId,
                                    slotName: focusSlotName,
                                    type: 'line',
                                    display: 'block',
                                    postion: focusSlotPosition,
                                  });
                                } else {
                                  consola.info('添加新组件到舞台');
                                  addComponentToStage('line', {
                                    id: newComId,
                                    display: 'block',
                                    parentId: 'root',
                                    slotName: 'root',
                                  });
                                }
                              }

                              // 初始化新组件的初始化状态
                              initComStatus({
                                comId: newComId,
                                statusId,
                                configs: {
                                  settings:
                                    getLatestComsInitalSettings()?.[
                                      item.name
                                    ] ?? {},
                                  actionsId: {},
                                  stylesId: {},
                                },
                              });

                              consola.info('选中组件和默认状态');
                              /** 设置选中组件 */
                              setStageSelectNodeId(newComId);

                              /** 设置选中组件的选中状态 */
                              setSelectedComponentStatusId(statusId);

                              /** 设置组件默认状态 */
                              setComStatusSettingsDefaults(newComId, statusId);

                              triggerSaveTimeChange();
                            }}
                          >
                            <Typography.Text
                              style={{
                                fontSize: 14,
                              }}
                            >
                              {item.title}
                            </Typography.Text>
                          </Card.Grid>
                        );
                      })}
                      <Card.Grid hoverable={false} style={gridStyle}>
                        ...
                      </Card.Grid>
                    </Card>
                  </div>
                );
              })}
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default App;
