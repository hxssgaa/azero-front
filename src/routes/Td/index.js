import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ Td, loading }) => ({
  Td,
  loading: loading.effects['Td/fetch'],
}))

export default class IdForm extends Component {
  state = {};

  componentDidMount() {
    console.info(1111);
    const { dispatch } = this.props;
    dispatch({
      type: 'Td/fetch',
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
        4444
      </div>
    );
  }
}
