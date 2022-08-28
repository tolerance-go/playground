import { useModel } from '@umijs/max';

export const useGridData = () => {
  const { mode: siderLeftMode } = useModel('workbench.siderLeftMode', (model) => ({
    mode: model?.siderLeftMode,
  }));

  return {
    gridData: [
      {
        title: '基础',
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
              { type: 'item', name: 'table', title: '表格' },
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
    ],
  };
};
