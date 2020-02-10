/**
 * use d3-drag to make children draggable, modify position by props.onDrag
 */

import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

interface Props {
  translateX: number
  translateY: number
  onDragging: (x: number, y: number) => void
  cursor?: 'grab' | 'move' | 'rotate' | 'nwse-resize' | 'ns-resize' | 'ew-resize' | 'nesw-resize'
}

function makeDraggable(comp: React.Component<Props>) {
  let translateX = comp.props.translateX;
  let translateY = comp.props.translateY;
  let { cursor = 'move' } = comp.props;
  const handleDrag = d3.drag()
    .subject(function () {
      return { x: translateX, y: translateY }
    })
    .on('start', function () {
      if (cursor === 'grab') {
        const me = d3.select(this);
        me.style('cursor', 'grabbing')
      }
    })
    .on('drag', function () {
      translateX = d3.event.x;
      translateY = d3.event.y;
      comp.props.onDragging(translateX, translateY);
    })
    .on('end', function () {
      if (cursor === 'grab') {
        const me = d3.select(this);
        me.style('cursor', 'grab')
      }
    })
  const node = ReactDOM.findDOMNode(comp);
  const d3Node = d3.select(node as any)
  d3Node.on('mouseenter', function () {
    const me = d3.select(this);
    me.style('cursor', cursor === 'rotate' ? 'alias' : cursor)
  })
  handleDrag(d3.select(node as any));
}

class Anchor extends React.Component<Props> {
  componentDidMount() {
    makeDraggable(this);
  }
  componentDidUpdate() {
    makeDraggable(this);
  }
  render() {
    return this.props.children;
  }
}

export default Anchor;