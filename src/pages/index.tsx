import React, { useState, useRef } from 'react';

import HiTu, { HiTuRefObject, HiTuProps } from '@ant-design/hitu';
import { Info } from '@ant-design/hitu/es/interface';

import * as allImages from '@ant-design/hitu-assets';
// import { AssetComponent } from '@ant-design/hitu-assets/es/interface';

import HandlerWrapper from '../components/HandlerWrapper';
import { Button, Slider } from 'antd';

import styles from './index.less';

const defaultInfo = {
  x: 200,
  y: 250,
  rotate: 0,
  scaleX: .2,
  scaleY: .2,
  originX: 0.5,
  originY: 0.5,
  opacity: 1
};

const commons = Object.keys(allImages).filter(name => name.includes('Common'));

export default function () {
  const hituRef = useRef<HiTuRefObject>(null);
  const info = useRef<Required<Info>>(defaultInfo);
  const [rotate, setRotate] = useState<number>(0);
  const [shapes, setShapes] = useState<HiTuProps['shapes']>([{
    type: 'shape',
    source: allImages.Common_Primary_BarChart02,
    name: 'chart',
    ...defaultInfo
  }]);

  const setFrameInfo = (i: Required<Info>) => {
    setShapes([{
      type: 'shape',
      source: allImages.Common_Primary_BarChart02,
      name: 'chart',
      ...i
    }])
    info.current = i;
  }

  const handleScale = (type: 'horizontal' | 'vertical') => {
    if (info.current) {
      if (type === 'horizontal') setFrameInfo({ ...info.current, scaleX: -info.current.scaleX })
      if (type === 'vertical') setFrameInfo({ ...info.current, scaleY: -info.current.scaleY })
    }
  }

  const handleRotate = (r: number | [number, number]) => {
    if (typeof r === 'number') {
      setRotate(r);
      if (info.current) {
        setFrameInfo({ ...info.current, rotate: r })
      }
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <div className={styles.assets}>
        {commons.map(((item) => {
          const Comp = (allImages as any)[item];
          return <div><Comp /></div>;
        }))}
      </div>
      <div className='center'>
        <HiTu
          ref={hituRef}
          width={800}
          height={500}
          style={{ border: '1px solid red', width: 800, height: 500 }}
          shapes={shapes}
          frames={200}
          defaultPlay={false}
          shapeRender={(element, shape, frameInfo) => {
            const {
              width: shapeWidth = 0,
              height: shapeHeight = 0,
            } = shape.source as any;
            return (
              <HandlerWrapper
                key={element.key + ''}
                frameInfo={frameInfo}
                shapeWidth={shapeWidth}
                shapeHeight={shapeHeight}
                setFrameInfo={setFrameInfo}
              >
                {element}
              </HandlerWrapper>
            )
          }}
        />
      </div>
      <div className={styles.config}>
        <div>
          <Button onClick={() => handleScale('horizontal')}>左右翻转</Button>&emsp;
          <Button onClick={() => handleScale('vertical')}>上下翻转</Button>
        </div>
        {info.current ?
          <>
            <div>x: &emsp; {(info.current.x).toFixed(2)}</div>
            <div>y:  &emsp;{(info.current.y).toFixed(2)}</div>
            <div>originX:  &emsp;{(info.current.originX).toFixed(2)}</div>
            <div>originY:  &emsp;{(info.current.originY).toFixed(2)}</div>
            <div>rotate: <Slider min={-180} max={180} value={rotate} onChange={handleRotate} /></div>
            <div>scaleX:  &emsp;{(info.current.scaleX).toFixed(2)}</div>
            <div>scaleY:  &emsp;{(info.current.scaleY).toFixed(2)}</div>
          </> : null}
      </div>
    </div>
  )
}