import React, { PureComponent } from 'react';
// 组件定义
import G6 from '@antv/g6';
import { DataSet, createView } from '@antv/data-set';
import stockData from './stockData';

export default class SliderModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: '2015-01-07',
    };
  }

  static getDerivedStateFromProps() {
    console.info(3333, 'getDerivedStateFromProps');
  }

  componentDidMount() {
    this.renderG6Graph(stockData);
  }

  componentDidUpdate() {
    this.renderG6Graph(stockData);
  }

  renderG6Graph = () => {
    const data = {
      nodes: [
        {
          id: 'node1',
          aaa: 'node1',
          x: 100,
          y: 200
        },
        {
          id: 'node2',
          aaa: 'node2node2node2node2node2node2',
          x: 300,
          y: 200
        },
        {
          id: 'node3',
          aaa: 'node3',
          x: 500,
          y: 200
        },
        {
          id: 'node4',
          aaa: 'node4',
          x: 700,
          y: 200
        },
        {
          id: 'node5',
          aaa: 'node5',
          x: 700,
          y: 400
        },
        {
          id: 'node6',
          aaa: 'node6',
          x: 700,
          y: 600
        }
      ],
      edges: [
        {
          id: 'edge1',
          target: 'node2',
          source: 'node1',
          color: 'red',          // 颜色
          style: {
            endArrow: true,
          },
        },
        {
          id: 'edge2',
          target: 'node3',
          source: 'node2',
          color: 'red',          // 颜色
          style: {
            endArrow: true,
          },
        },
        {
          id: 'edge3',
          target: 'node4',
          source: 'node3',
          color: 'red',          // 颜色
          style: {
            endArrow: true,
          },
        },
        {
          id: 'edge4',
          target: 'node5',
          source: 'node4',
          color: 'red',          // 颜色
          style: {
            endArrow: true,
          },
        },
        // {
        //   id: 'edge5',
        //   target: 'node1',
        //   source: 'node5',
        //   color: 'red',          // 颜色
        //   style: {
        //     endArrow: true,
        //   },
        // },
        {
          id: 'edge6',
          target: 'node6',
          source: 'node5',
          color: 'red',          // 颜色
          style: {
            endArrow: true,
          },
        },
        {
          id: 'edge7',
          target: 'node1',
          source: 'node6',
          color: 'red',          // 颜色
          style: {
            endArrow: true,
          },
        },
      ]
    };
    const graph = new G6.Graph({
      container: 'mountNode',
      fitView: 'cc',
      radius: 1,
      height: 800,
      width: 852,
    });
    graph.node({
      label(model) {
        let labelObj;
        if (model.aaa.length >= 6) {
          labelObj = model.aaa.substr(0, 6) + '...';
        } else {
          labelObj = model.aaa;
        }
        return labelObj;
      },
      // shape: 'rect',
      size: [100, 100],
    });
    graph.edge({
      style: {
        endArrow: true,
      },
    });
    graph.read(data);
    // setInterval(() => {
    //   graph.update('node1', {
    //     x: 10000
    //   });
    // }, 1000);
  };

  render() {
    return (
      <div id="mountNode" />
    );
  }
}