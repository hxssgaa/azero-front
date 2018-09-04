import React, { Component } from 'react';
import { Button, Row, Col, Carousel, Progress } from 'antd';
import { connect } from 'dva';
import { ToDecimal } from '../../components/CommonModal/Common';
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
    const { Td: { data, progressData } } = this.props;
    const { lastSyncStocks, currentProgress, isSyncing, eta, syncedSymbol } = progressData;
    const { status } = data;
    let lastSyncStocksModel;
    if (lastSyncStocks) {
      lastSyncStocksModel = lastSyncStocks.map((item, index) => {
        const { symbol, frequency, syncDateTime } = item;
        return (
          <div>
            <h3>{`symbol:${  symbol  };frequency:${  frequency  };syncDataTime:${  syncDateTime}`}</h3>
          </div>);
      });
    }

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
        {/* 一.td同步数据开关 */}
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

        {/* 二.td同步数据详情 */}
        <div className={styles.subProperty}>二.td同步数据详情</div>
        <div>1.最新同步的25条股票数据:</div>
        <Carousel
          autoplay
        >
          {lastSyncStocksModel}
        </Carousel>
        <div style={{ marginTop: 20 }}>
          <Row gutter={24}>
            <Col span={8}>
              <div>2.同步进度:</div>
            </Col>
            <Col span={12}>
              <Progress percent={ToDecimal(currentProgress * 100)} status="active" />
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 20 }}>
          <Row gutter={24}>
            <Col span={8}>
              <div style={{ height: 50, innerHeight: 50, marginTop: 18 }}>3.已经是最新状态的股票数:</div>
            </Col>
            <Col span={12}>
              <div style={{ fontSize: 40, color: '#1890ff' }}>{syncedSymbol}</div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
