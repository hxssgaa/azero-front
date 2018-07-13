import React, { PureComponent } from 'react';
// 组件定义
import G2 from '@antv/g2';
import { DataSet, createView } from '@antv/data-set';
import Slider from '@antv/g2-plugin-slider';

export default class SliderModel extends PureComponent {
  componentDidMount() {
    this.renderG6Graph();
  }

  componentDidUpdate() {
    this.renderG6Graph();
  }

  renderG6Graph = () => {
    const data = [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 },
    ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。


    // !!! 创建 DataSet，并设置状态量 start end
    const ds = new DataSet({
      state: {
        start: '2004-01-01',
        end: '2007-09-24'
      }
    });
    // !!! 通过 ds 创建 DataView
    const dv = ds.createView();
    dv.source(data)
      .transform({ // !!! 根据状态量设置数据过滤规则，
        type: 'filter',
        callback: obj => {
          return obj.date <= ds.state.end && obj.date >= ds.state.start;
        }
      });
    const chart = new G2.Chart({
      id: 'c1',
      forceFit: true,
      height: 400,
      animate: false
    });

    chart.scale({
      date: {
        type: 'time',
        mask: 'MM-DD',
        alias: '日期'
      }
    });

    const view1 = chart.view({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 1,
        y: 0.45
      }
    });
    view1.source(dv);  // !!! 注意数据源是 ds 创建 DataView 对象
    view1.line().position('date*aqi');

    const view2 = chart.view({
      start: {
        x: 0,
        y: 0.55
      },
      end: {
        x: 1,
        y: 1
      }
    });
    view2.source(dv); // !!! 注意数据源是 ds 创建 DataView 对象
    view2.interval().position('date*aqi');
    chart.render();

    // !!! 创建 slider 对象
    const slider = new Slider({
      container: 'slider',
      start: '2004-01-01',
      end: '2007-09-24',
      data, // !!! 注意是原始数据，不要传入 dv
      xAxis: 'date',
      yAxis: 'aqi',
      onChange: ({ startText, endText }) => {
        // !!! 更新状态量
        ds.setState('start', startText);
        ds.setState('end', endText);
      }
    });
    slider.render();
  };

  render() {
    return (
      <div id="c1" />
    );
  }
}
