import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ futu, loading }) => ({
  futu,
  loading: loading.effects['Futu/fetch'],
}))

export default class FutuForm extends Component {
  state = {};

  componentDidMount() {
    console.info(1111);
    const { dispatch } = this.props;
    dispatch({
      type: 'Futu/fetch',
    });
  }

  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'futu/clear',
  //   });
  // }

  render() {
    return (
      <div>
        11111
      </div>
    );
  }
}
