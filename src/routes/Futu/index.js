import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['futu/fetch'],
}))

export default class FutuForm extends Component {
  state = {
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'futu/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'futu/clear',
    });
  }

  render() {
    return (
      <div>
        11111
      </div>
    );
  }
}
