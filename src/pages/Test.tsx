import { SheetComponent } from '@antv/s2-react';
import { useRef, useState } from 'react';

// 初始化配置
const s2Options = {
  width: 600,
  height: 400,
  showSeriesNumber: true,
  tooltip: { showTooltip: false },
  interaction: { enableCopy: true, hoverHighlight: false },
  showDefaultHeaderActionIcon: false,
};

// 初始化数据
const s2DataCfg = {
  fields: { columns: ['province', 'city', 'type', 'price'] },
  sortParams: [],
};

export default () => {
  const data = [
    {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: 1,
    },
    {
      province: '浙江',
      city: '杭州',
      type: '纸张',
      price: 2,
    },
    {
      province: '浙江',
      city: '舟山',
      type: '笔',
      price: 17,
    },
    {
      province: '浙江',
      city: '舟山',
      type: '纸张',
      price: 6,
    },
    {
      province: '吉林',
      city: '长春',
      type: '笔',
      price: 8,
    },
    {
      province: '吉林',
      city: '白山',
      type: '笔',
      price: 12,
    },
    {
      province: '吉林',
      city: '长春',
      type: '纸张',
      price: 3,
    },
    {
      province: '吉林',
      city: '白山',
      type: '纸张',
      price: 25,
    },
    {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: 20,
    },
    {
      province: '浙江',
      city: '杭州',
      type: '纸张',
      price: 10,
    },
    {
      province: '浙江',
      city: '舟山',
      type: '笔',
      price: 15,
    },
    {
      province: '浙江',
      city: '舟山',
      type: '纸张',
      price: 2,
    },
    {
      province: '吉林',
      city: '长春',
      type: '笔',
      price: 15,
    },
    {
      province: '吉林',
      city: '白山',
      type: '笔',
      price: 30,
    },
    {
      province: '吉林',
      city: '长春',
      type: '纸张',
      price: 40,
    },
    {
      province: '吉林',
      city: '白山',
      type: '纸张',
      price: 50,
    },
  ];
  const S2Ref = useRef(null);
  const [options] = useState(s2Options);
  const [dataCfg] = useState({ ...s2DataCfg, data });

  return (
    <SheetComponent
      ref={S2Ref}
      dataCfg={dataCfg}
      options={options}
      sheetType="table"
      adaptive={true}
    />
  );
};
