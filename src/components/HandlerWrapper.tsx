/**
 * wrapper svg assets to modify frameInfo
 */

import React from 'react';
import DragWrapper from './DragWrapper';
import ScaleRect from './ScaleRect';
import { Info } from '@ant-design/hitu/es/interface';
import { angle2number } from '../utils';

export interface HandlerWrapperProps {
  frameInfo: Required<Info>
  shapeWidth: number
  shapeHeight: number

  setFrameInfo: (info: Required<Info>) => void
}

const HandlerWrapper: React.FC<HandlerWrapperProps> = (props) => {
  const {
    frameInfo: {
      x,
      y,
      originX,
      originY,
      scaleX,
      scaleY,
      rotate,
    },
    shapeWidth,
    shapeHeight,
    setFrameInfo
  } = props;

  const centerX = shapeWidth * originX;
  const centerY = shapeHeight * originY;

  const dw = shapeWidth * scaleX; // display width
  const dh = shapeHeight * scaleY;  // display height

  const baseX = x - scaleX * centerX, baseY = y - scaleY * centerY;

  const handleChangePosition = (dx: number, dy: number) => {
    setFrameInfo({ ...props.frameInfo, x: dx, y: dy })
  }

  const handleChangeAnchor = (dx: number, dy: number) => {
    let originX = (dx - baseX) / dw;
    let originY = (dy - baseY) / dh;
    let line = Math.hypot(dx - x, dy - y); // Math.sqrt(a * a + b * b);
    let ƒ = Math.atan2(dy - y, dx - x);
    let a = ƒ + angle2number(rotate) * Math.sign(scaleX) * Math.sign(scaleY);
    setFrameInfo({
      ...props.frameInfo,
      originX, originY,
      // x: dx, y: dy
      x: x + Math.cos(a) * line, y: y + Math.sin(a) * line
    });
  }

  return (
    <g>
      {props.children}
      {/* 0. drag to modify position */}
      <DragWrapper
        cursor='grab'
        translateX={x}
        translateY={y}
        onDragging={handleChangePosition}
      >
        <g
          transform={`rotate(${rotate * Math.sign(scaleX) * Math.sign(scaleY)}, ${x}, ${y})`}
        >
          <rect
            x={scaleX > 0 ? baseX : baseX + dw}
            y={scaleY > 0 ? baseY : baseY + dh}
            width={Math.abs(dw)}
            height={Math.abs(dh)}
            stroke="#999"
            strokeWidth='0.4'
            fill="transparent"
          />
          <ScaleRect position='top' {...props} />
          <ScaleRect position='right' {...props} />
          <ScaleRect position='left' {...props} />
          <ScaleRect position='bottom' {...props} />
          <ScaleRect position='top-left' {...props} />
          <ScaleRect position='top-right' {...props} />
          <ScaleRect position='bottom-left' {...props} />
          <ScaleRect position='bottom-right' {...props} />
          <DragWrapper
            cursor='move'
            translateX={x}
            translateY={y}
            onDragging={handleChangeAnchor}
          >
            <circle cx={x} cy={y} r={8} fill="#f06" />
          </DragWrapper>
        </g>
      </DragWrapper>
    </g>
  )
}

export default HandlerWrapper;