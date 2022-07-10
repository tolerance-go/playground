import { useModel } from '@umijs/max';
import { Card } from 'antd';
import consola from 'consola';
import { nanoid } from 'nanoid';

const gridStyle: React.CSSProperties = {
  width: '25%',
  textAlign: 'center',
  padding: 14,
  cursor: 'pointer',
};

const App = () => {
  const { addComponentToStage } = useModel('stageComponentsModel', (model) => ({
    addComponentToStage: model.addComponentToStage,
  }));

  const { setComponentSettings } = useModel('componentsSettings', (model) => ({
    setComponentSettings: model.setComponentSettings,
  }));

  const { comsInitalSettings } = useModel(
    'componentsSettingConfigs',
    (model) => ({
      comsInitalSettings: model.comsInitalSettings,
    }),
  );

  return (
    <div
      style={{
        padding: 10,
      }}
    >
      {[
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
            { type: 'item', name: '', title: 'Divider分割线' },
            { type: 'item', name: '', title: 'Grid栅格' },
            { type: 'item', name: '', title: 'Layout布局' },
            { type: 'item', name: '', title: 'Space间距' },
          ],
        },
        {
          title: '导航',
          type: 'group',
          children: [
            { type: 'item', name: '', title: 'Affix固钉' },
            { type: 'item', name: '', title: 'Breadcrumb面包屑' },
            { type: 'item', name: '', title: 'Dropdown下拉菜单' },
            { type: 'item', name: '', title: 'Menu导航菜单' },
            { type: 'item', name: '', title: 'PageHeader页头' },
            { type: 'item', name: '', title: 'Pagination分页' },
            { type: 'item', name: '', title: 'Steps步骤条' },
          ],
        },
        {
          title: '数据录入',
          type: 'group',
          children: [
            { type: 'item', name: '', title: 'AutoComplete自动完成' },
            { type: 'item', name: '', title: 'Cascader级联选择' },
            { type: 'item', name: '', title: 'Checkbox多选框' },
            { type: 'item', name: '', title: 'DatePicker日期选择框' },
            { type: 'item', name: '', title: 'Form表单' },
            { type: 'item', name: '', title: 'Input输入框' },
            { type: 'item', name: '', title: 'InputNumber数字输入框' },
            { type: 'item', name: '', title: 'Mentions提及' },
            { type: 'item', name: '', title: 'Radio单选框' },
            { type: 'item', name: '', title: 'Rate评分' },
            { type: 'item', name: '', title: 'Select选择器' },
            { type: 'item', name: '', title: 'Slider滑动输入条' },
            { type: 'item', name: '', title: 'Switch开关' },
            { type: 'item', name: '', title: 'TimePicker时间选择框' },
            { type: 'item', name: '', title: 'Transfer穿梭框' },
            { type: 'item', name: '', title: 'TreeSelect树选择' },
            { type: 'item', name: '', title: 'Upload上传' },
          ],
        },
        {
          title: '数据展示',
          type: 'group',
          children: [
            { type: 'item', name: '', title: 'Avatar头像' },
            { type: 'item', name: '', title: 'Badge徽标数' },
            { type: 'item', name: '', title: 'Calendar日历' },
            { type: 'item', name: '', title: 'Card卡片' },
            { type: 'item', name: '', title: 'Carousel走马灯' },
            { type: 'item', name: '', title: 'Collapse折叠面板' },
            { type: 'item', name: '', title: 'Comment评论' },
            { type: 'item', name: '', title: 'Descriptions描述列表' },
            { type: 'item', name: '', title: 'Empty空状态' },
            { type: 'item', name: '', title: 'Image图片' },
            { type: 'item', name: '', title: 'List列表' },
            { type: 'item', name: '', title: 'Popover气泡卡片' },
            { type: 'item', name: '', title: 'Segmented分段控制器' },
            { type: 'item', name: '', title: 'Statistic统计数值' },
            { type: 'item', name: '', title: 'Table表格' },
            { type: 'item', name: '', title: 'Tabs标签页' },
            { type: 'item', name: '', title: 'Tag标签' },
            { type: 'item', name: '', title: 'Timeline时间轴' },
            { type: 'item', name: '', title: 'Tooltip文字提示' },
            { type: 'item', name: '', title: 'Tree树形控件' },
          ],
        },
        {
          title: '反馈',
          type: 'group',
          children: [
            { type: 'item', name: '', title: 'Alert警告提示' },
            { type: 'item', name: '', title: 'Drawer抽屉' },
            { type: 'item', name: '', title: 'Message全局提示' },
            { type: 'item', name: '', title: 'Modal对话框' },
            { type: 'item', name: '', title: 'Notification通知提醒框' },
            { type: 'item', name: '', title: 'Popconfirm气泡确认框' },
            { type: 'item', name: '', title: 'Progress进度条' },
            { type: 'item', name: '', title: 'Result结果' },
            { type: 'item', name: '', title: 'Skeleton骨架屏' },
            { type: 'item', name: '', title: 'Spin加载中' },
          ],
        },
        {
          title: '其他',
          type: 'group',
          children: [
            { type: 'item', name: '', title: 'Anchor锚点' },
            { type: 'item', name: '', title: 'BackTop回到顶部' },
            { type: 'item', name: '', title: 'ConfigProvider全局化配置' },
          ],
        },
      ].map((group) => {
        return (
          <Card
            key={group.title}
            bordered={false}
            title={group.title}
            size="small"
            style={{
              marginBottom: 10,
            }}
          >
            {group.children.map((item) => {
              return (
                <Card.Grid
                  key={item.title}
                  hoverable={false}
                  style={gridStyle}
                  onClick={() => {
                    if (item.name === 'button') {
                      const newId = nanoid();
                      consola.info('添加新组件到舞台');
                      addComponentToStage('button', {
                        id: newId,
                        display: 'inline',
                      });
                      consola.info('初始化新组件配置');
                      setComponentSettings(
                        newId,
                        comsInitalSettings['button'] ?? {},
                      );
                    }
                  }}
                >
                  {item.title}
                </Card.Grid>
              );
            })}
            <Card.Grid hoverable={false} style={gridStyle}>
              ...
            </Card.Grid>
          </Card>
        );
      })}
    </div>
  );
};

export default App;
