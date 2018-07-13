import React, { PureComponent } from 'react';
// 组件定义
import HigherChart from './HigherChart';
import data from './data.json';

export default class Workplace extends PureComponent {
  // componentDidMount() {
  //   Service.queryStockCandle().then((data) => {
  //     console.info(555, data);
  //     if (data) {
  //       this.renderG6Graph(data);
  //     } else {
  //       message.error('有问题');
  //     }
  //   });
  // }
  //
  // componentDidUpdate() {
  //   Service.queryStockCandle().then((data) => {
  //     if (data) {
  //       this.renderG6Graph(data);
  //     } else {
  //       message.error('有问题');
  //     }
  //   });
  // }

  state = {
    shape: 'spline',
    data: data.slice(0, data.length / 2 - 1),
    width: 500,
    height: 250,
    plotCfg: {
      margin: [10, 100, 50, 120],
    },
  };
  changeHandler = () => {
    this.setState({
      shape: 'line',
    });
  };

  render() {
    return (
      <div>
        <HigherChart
          shape={this.state.shape}
          data={this.state.data}
          width={this.state.width}
          height={this.state.height}
          plotCfg={this.state.plotCfg}
        />
        <button onClick={this.changeHandler}>Change shape</button>
      </div>
    );
  }
}
