import { EllipsisOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, Col, Dropdown, Row, Typography } from 'antd';

import { useState } from 'react';
import DropdownMenu from './DropdownMenu';
import TempUpdateInput from './TempUpdateInput';

export const MenuItem = ({ item }: { item: API.ShownPage }) => {
  const [hovering, setHovering] = useState(false);

  const { updatingPageId } = useModel('page.pageUpdatingMeta', (model) => ({
    updatingPageId: model.updatingPageId,
  }));

  if (updatingPageId === item.id) {
    return <TempUpdateInput item={item} />;
  }

  return (
    <Row
      wrap={false}
      justify="space-between"
      align="middle"
      onMouseEnter={() => {
        setHovering(true);
      }}
      onMouseLeave={() => {
        setHovering(false);
      }}
    >
      <Col flex={'auto'}>
        <Dropdown
          trigger={['contextMenu']}
          overlay={<DropdownMenu item={item} />}
        >
          <Typography.Paragraph
            ellipsis
            style={{
              marginBottom: 0,
            }}
          >
            {item.path}
          </Typography.Paragraph>
        </Dropdown>
      </Col>
      {hovering ? (
        <Col flex={'none'}>
          <Dropdown trigger={['click']} overlay={<DropdownMenu item={item} />}>
            <Button
              onClick={(e) => e.stopPropagation()}
              size="small"
              type="text"
              icon={<EllipsisOutlined />}
            ></Button>
          </Dropdown>
        </Col>
      ) : null}
    </Row>
  );
};
