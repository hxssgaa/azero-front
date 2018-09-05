import React, { Component } from 'react';
import { Button, Row, Col, Carousel, Progress, Table } from 'antd';
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
            <h3>{`symbol:${  symbol  };frequency:${  frequency  };syncDateTime:${  syncDateTime}`}</h3>
          </div>);
      });
    }

    const columns = [
      {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
      },
      {
        title: 'Frequency',
        dataIndex: 'frequency',
        key: 'frequency',
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: 'SyncDateTime',
        dataIndex: 'syncDateTime',
        key: 'syncDateTime',
      }];

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
        {/* first. Td sync data switch  */}
        <div className={styles.subProperty}>Td sync data switch</div>
        <Row gutter={24}>
          <Col span={12} offset={1}>
            <div
              style={{ marginRight: 20 }}
            >
              {buttonDetail + light}
            </div>
          </Col>
          <Col span={10}>
            <Button
              type="primary"
              onClick={this.tdButtonClick.bind(this, 'open')}
              style={{ marginRight: 20, marginBottom: 10 }}
            >open
            </Button>
            <Button
              type="primary"
              onClick={this.tdButtonClick.bind(this, 'close')}
              style={{ marginBottom: 10 }}
            >close
            </Button>
          </Col>
        </Row>

        {/* second.Td synchronization data details */}
        <div className={styles.subProperty}>Td synchronization data details</div>
        <div>
          <Row gutter={24}>
            <Col span={9} offset={1}>
              <div style={{ height: 50, innerHeight: 50, marginTop: 10 }}>1.latest state of stocks :</div>
            </Col>
            <Col span={12}>
              <div style={{ fontSize: 40, color: '#1890ff' }}>{syncedSymbol}</div>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 10 }}>
          <Row gutter={24}>
            <Col span={9} offset={1}>
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
            <Col span={9} offset={1}>
              <div style={{ height: 50, innerHeight: 50, marginTop: 10 }}>3.the latest synchronized 25 stock data:</div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={23} offset={1}>
              <Table
                columns={columns}
                dataSource={lastSyncStocks}
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
