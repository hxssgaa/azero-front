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
    if (str === 'open') {
      dispatch({
        type: 'Td/fetchStart',
      });
    } else if (str === 'close') {
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
      light = 'server is not turned on';
      buttonDetail = 'The current server does not have synchronization data:';
    } else if (parseInt(status, 10) === 1) {
      light = 'Server is turned on';
      buttonDetail = 'Current server is synchronizing data:';
    }

    return (
      <div>
        {/* 一. Td sync data switch  */}
        <div className={styles.subProperty}>一.Td sync data switch</div>
        <Row gutter={24}>
          <Col span={12}>
            <div
              style={{ marginRight: 20 }}
            >
              {buttonDetail + light}
            </div>
          </Col>
          <Col span={12}>
            <Button
              type="primary"
              onClick={this.tdButtonClick.bind(this, 'open')}
              style={{ marginRight: 20 }}
            >open
            </Button>
            <Button
              type="primary"
              onClick={this.tdButtonClick.bind(this, 'close')}
            >close
            </Button>
          </Col>
        </Row>

        {/* 二.Td synchronization data details */}
        <div className={styles.subProperty}>二.Td synchronization data details</div>
        <div>1.the latest synchronized 25 stock data:</div>
        <Carousel
          autoplay
        >
          {lastSyncStocksModel}
        </Carousel>
        <div style={{ marginTop: 20 }}>
          <Row gutter={24}>
            <Col span={8}>
              <div>2.synchronization progress:</div>
            </Col>
            <Col span={12}>
              <Progress
                percent={ToDecimal(currentProgress * 100)}
                status="active"
              />
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 20 }}>
          <Row gutter={24}>
            <Col span={8}>
              <div style={{ height: 50, innerHeight: 50, marginTop: 10 }}>3.the number of stocks that are already in the latest state:</div>
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
