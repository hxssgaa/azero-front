import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ Meta, loading }) => ({
  Meta,
  loading: loading.effects['Meta/fetch'],
}))

export default class MetaForm extends Component {
  state = {};

  componentDidMount() {
    console.info(1111);
    const { dispatch } = this.props;
    dispatch({
      type: 'Meta/fetch',
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
        3333
      </div>
    );
  }
}
