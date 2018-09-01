import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ Futu, loading }) => ({
  Futu,
  loading: loading.effects['Futu/fetch'],
}))

export default class FutuForm extends Component {
  state = {};

  componentDidMount() {
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
        11111呃呃呃呃呃呃2222
      </div>
    );
  }
}
