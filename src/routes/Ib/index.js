import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ Ib, loading }) => ({
  Ib,
  loading: loading.effects['Ib/fetch'],
}))

export default class IbForm extends Component {
  state = {};

  componentDidMount() {
    console.info(1111);
    const { dispatch } = this.props;
    dispatch({
      type: 'Ib/fetch',
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
        2222
      </div>
    );
  }
}
