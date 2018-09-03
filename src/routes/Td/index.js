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
    // buttonClick: false,
  };

  componentDidMount() {
  }

  shouldComponentUpdate() {
    return true;
  }

  // td同步数据按钮点击
  tdButtonClick = (str) => {
    const { dispatch } = this.props;
    if (str === '开启') {
      dispatch({
        type: 'Td/fetchStart',
      });
    } else if (str === '关闭') {
      dispatch({
        type: 'Td/fetchStop',
      });
    }
  };

  render() {
    const { Td: { data } } = this.props;
    console.info(111, data);
    const { status } = data;
    let light;
    let buttonDetail;
    if (parseInt(status, 10) === 0) {
      light = '服务器未开启';
      buttonDetail = '当前服务器没有同步数据:';
    } else if (parseInt(status, 10) === 1) {
      light = '服务器已经开启';
      buttonDetail = '当前服务器正在同步数据:';
    }

    return (
      <div>
        {/* td同步数据开关 */}
        <div className={styles.subProperty}>一.td同步数据开关</div>
        <Row gutter={24}>
          <Col span={10}>
            <div
              style={{ marginRight: 20 }}
            >
              {buttonDetail + light}
            </div>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              onClick={this.tdButtonClick.bind(this, '开启')}
              style={{ marginRight: 20 }}
            >开启
            </Button>
            <Button
              type="primary"
              onClick={this.tdButtonClick.bind(this, '关闭')}
            >关闭
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
