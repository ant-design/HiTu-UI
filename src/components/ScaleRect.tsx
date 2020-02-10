/**
 * scale rect
 */

import React from 'react';
import DragWrapper from './DragWrapper';
import { HandlerWrapperProps } from './HandlerWrapper';

interface Props extends HandlerWrapperProps {
  position: 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
};


function getX(props: Props) {
  const {
    position,
    frameInfo: { x, originX, scaleX },
    shapeWidth
  } = props;
  const centerX = shapeWidth * originX;
  const displayWidth = scaleX * shapeWidth;
  const baseX = x - scaleX * centerX;
  if (['left', 'top-left', 'bottom-left'].indexOf(position) > -1) return baseX;
  if (['top', 'bottom'].indexOf(position) > -1) return baseX + displayWidth / 2;
  if (['top-right', 'right', 'bottom-right'].indexOf(position) > -1) return baseX + displayWidth;
  return baseX;
}

function getY(props: Props) {
  const {
    position,
    frameInfo: { y, originY, scaleY },
    shapeHeight
  } = props;
  const centerY = shapeHeight * originY;
  const displayHeight = shapeHeight * scaleY;  // display height
  const baseY = y - scaleY * centerY;
  if (['top', 'top-left', 'top-right'].indexOf(position) > -1) return baseY;
  if (['left', 'right'].indexOf(position) > -1) return baseY + displayHeight / 2;
  if (['bottom-left', 'bottom', 'bottom-right'].indexOf(position) > -1) return baseY + displayHeight;
  return baseY;
}

function getScaleX(props: Props, dx: number, dy: number) {
  const {
    position,
    frameInfo: { x, originX, scaleX },
    shapeWidth
  } = props;
  if (['right', 'top-right', 'bottom-right'].indexOf(position) > -1) return (x - dx) / ((originX - 1) * shapeWidth);
  if (['left', 'top-left', 'bottom-left'].indexOf(position) > -1) return (x - dx) / (originX * shapeWidth);
  return scaleX;
}

function getScaleY(props: Props, dx: number, dy: number) {
  const {
    position,
    frameInfo: { y, originY, scaleY },
    shapeHeight
  } = props;
  if (['top', 'top-left', 'top-right'].indexOf(position) > -1) return (y - dy) / (originY * shapeHeight);
  if (['bottom', 'bottom-left', 'bottom-right'].indexOf(position) > -1) return (y - dy) / ((originY - 1) * shapeHeight);
  return scaleY;
}

function getCursor(position: Props['position']) {
  if (['top', 'bottom'].indexOf(position) > -1) return 'ns-resize';
  if (['left', 'right'].indexOf(position) > -1) return 'ew-resize';
  if (['top-left', 'bottom-right'].indexOf(position) > -1) return 'nwse-resize';
  if (['top-right', 'bottom-left'].indexOf(position) > -1) return 'nesw-resize';
  return 'ns-resize';
}

const ScaleRect: React.FC<Props> = (props) => {
  const cx = getX(props);
  const cy = getY(props);

  const handleChangeScale = (dx: number, dy: number) => {
    props.setFrameInfo({
      ...props.frameInfo,
      scaleX: getScaleX(props, dx, dy),
      scaleY: getScaleY(props, dx, dy)
    });
  }

  return (
    <DragWrapper
      cursor={getCursor(props.position)}
      translateX={cx}
      translateY={cy}
      onDragging={handleChangeScale}
    >
      <rect
        x={cx - 3}
        y={cy - 3}
        width={6}
        height={6}
        stroke="#444"
        strokeWidth='0.4'
        fill="#fff"
      />
    </DragWrapper>
  )
}

export default ScaleRect;