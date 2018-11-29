import React, { Component } from 'react';
import { FmtDate } from '../CommonModal/Common';

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

// const initTime = props => {
//   let lastTime = 0;
//   let targetTime = 0;
//   console.info(1111, props);
//   try {
//     if (Object.prototype.toString.call(props.target) === '[object Date]') {
//       targetTime = props.target.getTime();
//     } else {
//       targetTime = new Date(props.target).getTime();
//     }
//   } catch (e) {
//     throw new Error('invalid target prop', e);
//   }
//
//   lastTime = targetTime;
//   console.info('lastTime',lastTime);
//   return {
//     lastTime: lastTime < 0 ? 0 : lastTime,
//   };
// };

class CountDown extends Component {
  timer = 0;

  interval = 1000;

  constructor(props) {
    super(props);
    const  lastTime  = props.target;
    this.state = {
      lastTime,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    console.info('nextProps',nextProps);
    const  lastTime  = nextProps.target;
    console.info('lastTime',lastTime);
    console.info(preState.lastTime !== lastTime);
    if (preState.lastTime !== lastTime) {
      return {
        lastTime,
      };
    }
    return null;
  }

  componentDidMount() {
    // this.tick();
  }

  componentDidUpdate(prevProps) {
    const { target } = this.props;
    console.info(2222,target !== prevProps.target);
    if (target !== prevProps.target) {
      clearTimeout(this.timer);
      // this.tick();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // tick = () => {
  //   let { lastTime } = this.state;
  //   this.timer = setTimeout(() => {
  //     console.info(3333,lastTime);
  //     lastTime += this.interval;
  //     this.setState(
  //       {
  //         lastTime,
  //       },
  //       () => {
  //         this.tick();
  //       }
  //     );
  //   }, this.interval);
  // };

  render() {
    const { ...rest } = this.props;
    const { lastTime } = this.state;
    const result = FmtDate(lastTime);
    return <span {...rest}>{result}</span>;
  }
}

export default CountDown;
