import { Affix, Card, Row, Tabs, Typography } from 'antd';
import React, { useRef } from 'react';
import { useGridData } from './useGridData';
import { useHandleComGridItemClick } from './useHandleComGridItemClick';

const { TabPane } = Tabs;

export type ComGridItem = {
  type: string;
  name: string;
  title: string;
  children?: ComGridItem[];
};

const gridStyle: React.CSSProperties = {
  width: '50%',
  textAlign: 'center',
  padding: 14,
  cursor: 'pointer',
};

const App = ({ siderRef }: { siderRef: React.RefObject<HTMLDivElement> }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { handleComGridItemClick } = useHandleComGridItemClick();

  const { gridData } = useGridData();

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
        {gridData.map((tabItem) => {
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
                              handleComGridItemClick(item);
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
