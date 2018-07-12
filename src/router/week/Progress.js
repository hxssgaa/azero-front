// 使用requestAnimationFrame改变state
import React, { Component } from 'react';
import styles from './index.less';

export default class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: 10
    };
  }

  increase = () => {
    const percent = this.state.percent;
    const targetPercent = percent >= 90 ? 100 : percent + 10;
    const speed = (targetPercent - percent) / 400;
    let start = null;
    const animate = timestamp => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const currentProgress = Math.min(parseInt(speed * progress + percent, 10), targetPercent);
      this.setState({
        percent: currentProgress
      });
      if (currentProgress < targetPercent) {
        window.requestAnimationFrame(animate);
      }
    };
    window.requestAnimationFrame(animate);
  };

  decrease = () => {
    const percent = this.state.percent;
    const targetPercent = percent < 10 ? 0 : percent - 10;
    const speed = (percent - targetPercent) / 400;
    let start = null;
    const animate = timestamp => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const currentProgress = Math.max(parseInt(percent - speed * progress, 10), targetPercent);
      this.setState({
        percent: currentProgress
      });
      if (currentProgress > targetPercent) {
        window.requestAnimationFrame(animate);
      }
    };
    window.requestAnimationFrame(animate);
  };

  render() {
    const { percent } = this.state;

    return (
      <div>
        <div className="progress">
          <div style={{ width: '100 %', height: '100 %', fontSize: 500 }}>{percent}%</div>
        </div>
        <div className="btns">
          <button style={{ width: 300, height: 100, fontSize: 50 }} onClick={this.increase}>addition</button>
          <button style={{ width: 300, height: 100, fontSize: 50 }} onClick={this.decrease}>subtraction</button>
        </div>
      </div>
    );
  }
}
