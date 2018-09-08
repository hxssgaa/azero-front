import React, { Component } from 'react';
import { Button,Select, Row, Col, Progress, Table } from 'antd';
import { connect } from 'dva';
import { ToDecimal } from '../../components/CommonModal/Common';
import rhombus from '../../assets/sync/rhombus.png';
import rhombusNo from '../../assets/sync/rhombusNo.png';
import * as Service from '../../services/api';
import styles from './index.less';

const { Option } = Select;

@connect(({ Td, loading }) => ({
  Td,
  loading: loading.effects['Td/fetch'],
}))

export default class TdForm extends Component {
  state = {
    stockData: {},
    syncInfo: {},
  };

  componentDidMount() {
  }

  shouldComponentUpdate() {
    return true;
  }

  // on search stocks
  onSearchStocks = (value) => {
    const valueTrue = { code: value.toUpperCase(), isFuzzy: 1 };
    Service.queryTdSymbolsInfoData(valueTrue)
      .then((res) => {
        if (res && res.success) {
          const { data: { data } } = res;
          this.setState({
            stockData: data,
          })
        } else {
          this.setState({
            stockData: {},
          })
        }
      });
  };

  // achieve the stock symbol
  getStockChildren() {
    const { stockData } = this.state;
    const { codeList = [] } = stockData;
    const children = [];
    if (codeList.length !== 0) {
      const len = codeList.length;
      for (let i = 0; i < len; i += 1) {
        children.push(<Option
          title={codeList[i].symbol}
          className={styles.stockSelectOption}
          key={i}
        >{`[${codeList[i].symbol}]${codeList[i].title}`}
        </Option>);
      }
      return children;
    }
  }

  // on search stocks
  handleChange = (value) => {
    const { stockData: { codeList } } = this.state;
    const valueTrue = { code: codeList[value].symbol, isFuzzy: 0 };
    Service.queryTdSymbolsInfoData(valueTrue)
      .then((res) => {
        if (res && res.success) {
          const { data: { data } } = res;
          this.setState({
            syncInfo: data,
          })
        } else {
          this.setState({
            syncInfo: {},
          })
        }
      });
  };


  // td sync data button click
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
    const { Td: { syncData, progressData } } = this.props;
    const { lastSyncStocks, currentProgress, eta, syncedSymbol } = progressData;
    const { status } = syncData;
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

    const { syncInfo } = this.state;
    // single search model for search input text
    const searchShowModel = (info) => {
      const syncInfoTrue = info.syncInfo;
      const syncInfoTrueOk = Object.keys(syncInfoTrue).map((e) => {
        return { 'time': e, 'startDate': syncInfoTrue[e].startDate, 'endDate': syncInfoTrue[e].endDate }
      });
      return syncInfoTrueOk.map((item, index) => {
        const { time, startDate, endDate } = item;
        return (
          <div style={{ display: 'block' }}>
            <div style={{ width: '12%', float: 'left', fontSize: 20 }}>{time}:</div>
            <div style={{ width: '88%', float: 'left', fontSize: 20, color: '#1890ff' }}>{`${startDate}-${endDate}`}</div>
          </div>)
      });
    };

    // single sync model for synchronization data details
    const singleSyncModel = (property, detail, propertyStyle) => {
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
        {/* second.Td search stock text */}
        <div className={styles.subProperty}>Td search stock text</div>
        <div style={{ marginLeft: 40 }}>
          <Row gutter={24}>
            <Col md={12} sm={24}>
              <Select
                showSearch
                filterOption={false}
                placeholder="input search stock text"
                onSearch={this.onSearchStocks.bind(this)}
                onChange={this.handleChange.bind(this)}
                style={{ width: '100%', marginBottom: 10  }}
              >
                {this.getStockChildren()}
              </Select>
            </Col>
          </Row>
        </div>
        <div style={{ marginLeft: 40 }}>
          {Object.keys(syncInfo).length >= 1 ?
            (
              <div>
                {searchShowModel(syncInfo)}
              </div>)
            : null}
        </div>
        {/* third.Td synchronization data details */}
        <div className={styles.subProperty}>Td synchronization data details</div>
        {singleSyncModel('1.latest state of stocks :', syncedSymbol, true)}
        {singleSyncModel('2.how long remains :', eta ? `${(ToDecimal(eta / 3600)).toString()  }h` : 0, true)}
        {singleSyncModel('3.synchronization progress :', <Progress
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
