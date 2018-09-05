import React, { Component } from 'react';
import { Button, Row, Col, Progress, Table } from 'antd';
import { connect } from 'dva';
import { ToDecimal } from '../../components/CommonModal/Common';
import rhombus from '../../assets/sync/rhombus.png';
import rhombusNo from '../../assets/sync/rhombusNo.png';
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
    const { lastSyncStocks, currentProgress, eta, syncedSymbol } = progressData;
    const { status } = data;
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

    // single model for synchronization data details
    const singleModel = (property, detail, propertyStyle) => {
      return (
        <div style={Object.assign({}, propertyStyle ? {} : { marginTop: 10 })}>
          <Row gutter={24}>
            <Col span={9} offset={1}>
              <div style={Object.assign({}, propertyStyle ? { height: 40, innerHeight: 40, marginTop: 10 } : {})}>{property}</div>
            </Col>
            <Col span={12}>
              <div style={Object.assign({}, propertyStyle ? { fontSize: 30, color: '#1890ff' } : {})}>{detail}</div>
            </Col>
          </Row>
        </div>
      );
    };

    return (
      <div>
        {/* first. Td sync data switch  */}
        <div className={styles.subProperty}>Td sync data switch</div>
        <div>
          <Row gutter={24}>
            <Col span={9} offset={1}>
              <div>
                {parseInt(status, 10) === 0 ? 'server is not turned on: ' : 'server is turned on:'}
                {parseInt(status, 10) === 0 ? <img style={{ width: 16 }} alt={1} src={rhombusNo} /> : <img style={{ width: 16 }} alt={2} src={rhombus} />}
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
        </div>
        {/* second.Td synchronization data details */}
        <div className={styles.subProperty}>Td synchronization data details</div>
        {singleModel('1.latest state of stocks :', syncedSymbol, true)}
        {singleModel('2. how long remains :', eta ? `${(ToDecimal(eta / 3600)).toString()  }h` : 0, true)}
        {singleModel('3.synchronization progress :', <Progress
          percent={ToDecimal(currentProgress * 100)}
          status="active"
        />, false)}
        <div style={{ marginTop: 20 }}>
          <Row gutter={24}>
            <Col span={9} offset={1}>
              <div style={{ height: 40, innerHeight: 40, marginTop: 10 }}>4.the latest synchronized 25 stock data :</div>
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
