import React, { Component } from 'react';
import { FmtDate } from '../../components/CommonModal/Common';

// 时钟显示组件
class ShowTimeModel extends Component {
  timer = 0;

  interval = 1000;

  constructor(props) {
    super(props);
    // 初始化时间
    this.state = {
      currentTime: props.currentTime || '',
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const currentTimeProps = nextProps.currentTime;
    const currentTimeState = preState.currentTime;
    if (currentTimeProps !== currentTimeState) {
      return {
        currentTime: currentTimeState,
      };
    }
    return null;
  }

  componentDidMount() {
    this.tick();
  }

  componentDidUpdate(prevProps) {
    const { currentTime } = this.props;
    if (currentTime !== prevProps.currentTime) {
      clearTimeout(this.timer);
      this.tick();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  tick = () => {
    let { currentTime } = this.state;
    this.timer = setTimeout(() => {
      currentTime += 1;
      this.setState(
        {
          currentTime,
        },
        () => {
          this.tick();
        }
      );
    }, this.interval);
  };

  render() {
    const { currentTime } = this.state;

    return (
      <div>
        <div>{FmtDate(currentTime)}</div>
      </div>

    );
  }
}

export default ShowTimeModel;
