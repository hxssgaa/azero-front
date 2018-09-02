import React, { Component } from 'react';
import { Button, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ Td, loading }) => ({
  Td,
  loading: loading.effects['Td/fetch'],
}))

export default class TdForm extends Component {
  state = {
    buttonClick: false,
  };

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'Td/fetch',
    // });
  }

  shouldComponentUpdate() {
    return true;
  }

  // td同步数据按钮点击
  tdButtonClick = (status) => {
    const { buttonClick } = this.state;
    const { dispatch } = this.props;
    console.info(3333, status);
    if (parseInt(status, 10) === 0) {
      dispatch({
        type: 'Td/fetchStart',
      });
    } else if (parseInt(status, 10) === 1) {
      dispatch({
        type: 'Td/fetchStop',
      });
    }
    this.setState({
      buttonClick: !buttonClick,
    });
  };

  render() {
    const { buttonClick } = this.state;
    const { Td: { data } } = this.props;
    // const buttonData = true;
    console.info(111, data);
    const { status } = data;
    console.info(222, status);
    // const status = 2;
    let light;
    let buttonWord;
    let buttonDetail = 1;
    if (buttonClick) {
      if (parseInt(status, 10) === 0) {
        light = '服务器未开启';
        buttonWord = '开启';
        buttonDetail = '点击开启同步:';
      } else if (parseInt(status, 10) === 1) {
        light = '服务器已经开启';
        buttonWord = '关闭';
        buttonDetail = '当前数据已经是最新:';
      }
    } else {
      if (parseInt(status, 10) === 0) {
        light = '服务器未开启';
        buttonWord = '开启';
        buttonDetail = '点击开启同步:';
      } else if (parseInt(status, 10) === 1) {
        light = '服务器已经开启';
        buttonWord = '关闭';
        buttonDetail = '当前数据已经是最新:';
      }
    }

    return (
      <div>
        {/* td同步数据开关 */}
        <div className={styles.subProperty}>一.td同步数据开关</div>
        <Row gutter={24}>
          <Col span={6}>
            {buttonDetail}
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              style={{ marginRight: 20 }}
            >
              {light}
            </Button>
            <Button
              type="primary"
              onClick={this.tdButtonClick.bind(this, buttonWord)}
            >{buttonWord}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
