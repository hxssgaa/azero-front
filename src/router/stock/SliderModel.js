import React, { PureComponent } from 'react';
// 组件定义
import G2 from '@antv/g2';
import { DataSet, createView } from '@antv/data-set';
import Slider from '@antv/g2-plugin-slider';
import stockData from './stockData';

const first = stockData.slice(0, 200);
const second = stockData.slice(50, 100);
const third = stockData.slice(100, 150);
const fourth = stockData.slice(150, 200);
const fifth = stockData.slice(200, 214);

export default class SliderModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: '2015-01-07',
    };
  }

  static getDerivedStateFromProps() {
    console.info(2222, 'getDerivedStateFromProps');
  }

  componentDidMount() {
    // setInterval(() => {
    // const stockDataTrue = getRandomArrayElements(stockData, 200);
    // const stockDataTrue = getRandom({ 'arry': stockData, 'range': 200 });
    // console.info(2222, stockDataTrue);
    // this.renderG6Graph(stockData);
    // }, 100);
    // setInterval(() => {
    // const dateStart = '2015-01-07';
    // const dateEnd = '2015-07-07';
    this.renderG6Graph(stockData);
    // }, 1000);
    // setTimeout(() => {
    //   const dateStart = '2015-0' + Math.floor(Math.random() * 10 + 1) + '-07';
    //   const dateEnd = '2015-11-07';
    //   console.info(2222, dateStart);
    //   this.renderG6Graph(stockData, dateStart, dateEnd);
    // }, 2000);
  }

  // componentWillReceiveProps() {
  //   return true;
  // }

  componentDidUpdate() {
    // setInterval(() => {
    const dateStart = Math.random() * 999;
    const dateEnd = dateStart + Math.random() * 999;
    this.renderG6Graph(stockData);
    // this.renderG6Graph(stockData, dateStart, dateEnd);
    // }, 1000);
  }

  renderG6Graph = (stockDataModel) => {
    const data = stockDataModel;
    let dateStart = '2015-01-07';
    const dateEnd = '2015-06-07';
    // setInterval(() => {
    //   dateStart = '2015-0' + Math.floor(Math.random() * 10 + 1) + '-07';
    //   console.info(2222, dateStart);
    // }, 20000);

    // 设置状态量，时间格式建议转换为时间戳，转换为时间戳时请注意区间
    const ds = new DataSet({
      state: {
        start: '2015-04-07',
        end: '2015-07-28'
      }
    });
    const dv = ds.createView();
    dv.source(data).transform({
      type: 'filter',
      callback: function callback(obj) {
        const date = obj.time;
        return date <= ds.state.end && date >= ds.state.start;
      }
    }).transform({
      type: 'map',
      callback: function callback(obj) {
        obj.trend = obj.start <= obj.end ? '上涨' : '下跌';
        obj.range = [obj.start, obj.end, obj.max, obj.min];
        return obj;
      }
    });

    const chart = new G2.Chart({
      container: 'mountNode',
      forceFit: true,
      height: window.innerHeight - 50,
      animate: false,
      padding: [10, 40, 40, 40]
    });
    chart.source(dv, {
      'time': {
        type: 'timeCat',
        nice: false,
        range: [0, 1]
      },
      trend: {
        values: ['上涨', '下跌']
      },
      'volumn': {
        alias: '成交量'
      },
      'start': {
        alias: '开盘价'
      },
      'end': {
        alias: '收盘价'
      },
      'max': {
        alias: '最高价'
      },
      'min': {
        alias: '最低价'
      },
      'range': {
        alias: '股票价格'
      }
    });
    chart.legend({
      offset: 20
    });
    chart.tooltip({
      showTitle: false,
      itemTpl: '<li data-index={index}>' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '{name}{value}</li>'
    });
    // chart.coord('polar', {
    //   radius: 0.5, // 设置半径，值范围为 0 至 1
    //   innerRadius: 0.3, // 空心圆的半径，值范围为 0 至 1
    //   startAngle: -1 * Math.PI / 2, // 极坐标的起始角度，单位为弧度
    //   endAngle: 3 * Math.PI / 2 // 极坐标的结束角度，单位为弧度
    // });


    const kView = chart.view({
      end: {
        x: 1,
        y: 0.5
      }
    });
    kView.source(dv);
    kView.schema().position('time*range').color('trend', function (val) {
      if (val === '上涨') {
        return '#f04864';
      }

      if (val === '下跌') {
        return '#2fc25b';
      }
    }).shape('candle').tooltip('time*start*end*max*min', function (time, start, end, max, min) {
      return {
        name: time,
        value: '<br><span style="padding-left: 16px">开盘价：' + start + '</span><br/>' + '<span style="padding-left: 16px">收盘价：' + end + '</span><br/>' + '<span style="padding-left: 16px">最高价：' + max + '</span><br/>' + '<span style="padding-left: 16px">最低价：' + min + '</span>'
      };
    });

    // const barView = chart.view({
    //   start: {
    //     x: 0,
    //     y: 0.65
    //   }
    // });
    // barView.source(dv, {
    //   volumn: {
    //     tickCount: 2
    //   }
    // });
    // barView.axis('time', {
    //   tickLine: null,
    //   label: null
    // });
    // barView.axis('volumn', {
    //   label: {
    //     formatter: function formatter(val) {
    //       return parseInt(val / 1000, 10) + 'k';
    //     }
    //   }
    // });
    // barView.interval().position('time*volumn').color('trend', function (val) {
    //   if (val === '上涨') {
    //     return '#f04864';
    //   }
    //
    //   if (val === '下跌') {
    //     return '#2fc25b';
    //   }
    // }).tooltip('time*volumn', function (time, volumn) {
    //   return {
    //     name: time,
    //     value: '<br/><span style="padding-left: 16px">成交量：' + volumn + '</span><br/>'
    //   };
    // });

    chart.render();

    // 生成 slider
    // const slider = new Slider({
    //   container: 'mountNode', // DOM id
    //   width: 'auto',
    //   height: 26,
    //   padding: [20, 40, 20, 40],
    //   start: ds.state.start, // 和状态量对应
    //   end: ds.state.end,
    //   data: data, // 源数据
    //   xAxis: 'time', // 背景图的横轴对应字段，同时为数据筛选的字段
    //   yAxis: 'volumn', // 背景图的纵轴对应字段，同时为数据筛选的字段
    //   scales: {
    //     time: {
    //       type: 'timeCat',
    //       nice: false
    //     }
    //   },
    //   onChange: function onChange(_ref) {
    //     const startText = _ref.startText,
    //       endText = _ref.endText;
    //     ds.setState('start', startText);
    //     ds.setState('end', endText);
    //   }
    // });
    // slider.render();
  };

  render() {
    return (
      <div id="mountNode" />
    );
  }
}

function getRandomArrayElements(arr, count) {
  let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

function getRandom(opt) {
  let old_arry = opt.arry,
    range = opt.range;
  //防止超过数组的长度
  range = range > old_arry.length ? old_arry.length : range;
  let newArray = [].concat(old_arry), //拷贝原数组进行操作就不会破坏原数组
    valArray = [];
  for (let n = 0; n < range; n++) {
    let r = Math.floor(Math.random() * (newArray.length));
    valArray.push(newArray[r]);
    //在原数组删掉，然后在下轮循环中就可以避免重复获取
    newArray.splice(r, 1);
  }
  return valArray;
}