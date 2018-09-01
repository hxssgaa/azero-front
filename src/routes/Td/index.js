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
    buttonData: true,
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
  tdButtonClick = () => {
    const { buttonData } = this.state;
    this.setState({
      buttonData: !buttonData,
    })
  };

  render() {
    const { buttonData } = this.state;
    console.info(222, buttonData);
    return (
      <div>
        {/* td同步数据开关 */}
        <div className={styles.subProperty}>一.td同步数据开关1</div>
        <Row gutter={24}>
          <Col span={4}>
            td同步数据开关:
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={this.tdButtonClick.bind(this)}>{buttonData ? '开启' : '关闭'}</Button>
          </Col>
        </Row>
        {/* td同步数据开关 */}
        <div className={styles.subProperty}>一.td同步数据开关2</div>
        <Row gutter={24}>
          <Col span={4}>
            td同步数据开关:
          </Col>
          <Col span={12}>
            <Button type="primary">开关</Button>
          </Col>
        </Row>
        {/* td同步数据开关 */}
        <div className={styles.subProperty}>一.td同步数据开关3</div>
        <Row gutter={24}>
          <Col span={4}>
            td同步数据开关:
          </Col>
          <Col span={12}>
            <Button type="primary">开关</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
