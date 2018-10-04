import React, { Component } from 'react';
import { Button, Select, Row, Col, Progress, Table, Tabs, Modal } from 'antd';
import { connect } from 'dva';
import { ToDecimal, ResultToSign } from '../../components/CommonModal/Common';
import rhombus from '../../assets/sync/rhombus.png';
import rhombusNo from '../../assets/sync/rhombusNo.png';
import add from '../../../public/add.png';
import * as Service from '../../services/ib';
import * as ServiceApi from '../../services/api';
import Styles from './index.less';

const { Option } = Select;
const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;

@connect(({ Ib, loading }) => ({
  Ib,
  loading: loading.effects['Ib/fetch'],
}))

export default class IbForm extends Component {
  state = {
    visible: false,
    stockData: {},
    tabsIndex: "0",
    syncInfo: {},
    searchLoading: false,
  };

  componentDidMount() {
  }

  shouldComponentUpdate() {
    return true;
  }

  // on search stocks
  onSearchStocks = (value) => {
    const valueTrue = { code: value.toUpperCase(), isFuzzy: 1 };
    Service.queryIbSymbolsInfoData(valueTrue)
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
          className={Styles.stockSelectOption}
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
    this.setState({
      searchLoading: true,
    });
    const valueTrue = { code: codeList[value].symbol, isFuzzy: 0 };
    Service.queryIbSymbolsInfoData(valueTrue)
      .then((res) => {
        if (res && res.success) {
          const { data: { data } } = res;
          this.setState({
            syncInfo: data,
            searchLoading: false,
          })
        } else {
          this.setState({
            syncInfo: {},
            searchLoading: false,
          })
        }
      });
  };

  // Ib sync data button click
  IbButtonClick = (str) => {
    const { dispatch } = this.props;
    const { tabsIndex } = this.state;
    if (str === 'open') {
      dispatch({
        type: 'Ib/fetchStart',
        payload: tabsIndex,
      });
    } else if (str === 'close') {
      dispatch({
        type: 'Ib/fetchStop',
        payload: tabsIndex,
      });
    }
  };

  // Ib tabs click
  tabsOnClick = (key) => {
    const { dispatch } = this.props;
    this.setState({
      tabsIndex: key,
    });
    dispatch({
      type: 'Ib/fetch',
      payload: key,
    });
  };

  onPopSearchStocks = (value) => {
    const valueTrue = { code: value.toUpperCase(), isFuzzy: 1 };
    ServiceApi.queryTdSymbolsInfoData(valueTrue)
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

  handlePopChange = (value) => {
    const { stockData: { codeList } } = this.state;
    const valueTrue = { code: codeList[value].symbol, isFuzzy: 0 };
    console.info(666, valueTrue);
    ServiceApi.queryTdSymbolsInfoData(valueTrue)
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

  getStockChildren = (dataSource) => {
    // const { stockData } = this.state;
    // const { codeList = [] } = stockData;
    const children = [];
    if (dataSource.length !== 0) {
      const len = dataSource.length;
      for (let i = 0; i < len; i += 1) {
        children.push(<Option
          title={dataSource[i].symbol}
          className={Styles.stockSelectOption}
          key={i}
        >{`[${dataSource[i].symbol}]${dataSource[i].title}`}
        </Option>);
      }
      return children;
    }
  };

  getPopStockChildren = () => {
    const { stockData } = this.state;
    const { codeList = [] } = stockData;
    const children = [];
    if (codeList.length !== 0) {
      const len = codeList.length;
      for (let i = 0; i < len; i += 1) {
        children.push(<Option
          title={codeList[i].symbol}
          className={Styles.stockSelectOption}
          key={i}
        >{`[${codeList[i].symbol}]${codeList[i].title}`}
        </Option>);
      }
      return children;
    }
  };

  onImgAdd = () => {
    console.info('3333');
    this.setState({
      visible: true,
    });
  };

  handleOk() {
    console.log('点击了确定');
    this.setState({
      visible: false,
    });
  }

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { loading, Ib: { syncData, progressData } } = this.props;
    const { syncInfo, searchLoading, tabsIndex, visible } = this.state;
    let progressDataDetail = {};
    let syncLogs = [];
    let histDataSyncProgress = '';
    let syncedSymbols = [];
    if (Object.keys(progressData).length >= 1) {
      if (tabsIndex === '0') {
        progressDataDetail = progressData['1M'];
      } else if (tabsIndex === '1') {
        progressDataDetail = progressData['1S'];
      } else if (tabsIndex === '2') {
        progressDataDetail = progressData.TICK;
      } else if (tabsIndex === '3') {
        progressDataDetail = progressData.REAL;
      }
      const { histDataSyncTrack } = progressDataDetail;
      if (Object.keys(histDataSyncTrack).length >= 1) {
        syncLogs = histDataSyncTrack.syncLogs;
        histDataSyncProgress = histDataSyncTrack.histDataSyncProgress;
        syncedSymbols = histDataSyncTrack.syncedSymbols;
      }
    }

    const { status } = syncData;

    const dataSource = [
      {
        key: '1',
        symbol: 'US.APPL',
        title: '苹果',
        date: '2018-1-1',
      },
      {
        key: '2',
        symbol: 'US.HUYA',
        title: '虎牙',
        date: '2018-1-1',
      },
      {
        key: '3',
        symbol: 'US.APPL2',
        title: '苹果',
        date: '2018-1-1',
      },
      {
        key: '4',
        symbol: 'US.HUYA2',
        title: '虎牙',
        date: '2018-1-1',
      },
      {
        key: '5',
        symbol: 'US.APPL3',
        title: '苹果',
        date: '2018-1-1',
      },
      {
        key: '6',
        symbol: 'US.HUYA3',
        title: '虎牙',
        date: '2018-1-1',
      },
    ];

    const columns = [
      {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
    ];

    // search column
    const columnSearch = [
      {
        title: 'Sync Frequency',
        dataIndex: 'time',
        render: (text, record) => {
          const { time } = record;
          let timeStr;
          if (record.time === '1M') {
            timeStr = '1min';
          } else {
            timeStr = `${time  }ins`;
          }
          return (<span>{ResultToSign(timeStr)}</span>);
        },
        key: 'time',
      },
      {
        title: 'Sync Datetime range',
        dataIndex: 'startDate',
        render: (text, record) => {
          return (<a>{ResultToSign(`${record.startDate}-${record.endDate}`)}</a>);
        },
        key: 'startDate',
      }];

    // histDataSyncTrack column
    const columnLogs = [
      {
        title: 'DateTime',
        dataIndex: 'datetime',
        key: 'datetime',
      },
      {
        title: 'Log',
        dataIndex: 'log',
        key: 'log',
      },
    ];

    // progress column
    const columnProgress = [
      {
        title: 'Symbol',
        dataIndex: 'symbol',
        key: 'symbol',
      }];

    // let syncInfoTrueOk = [];
    // if (Object.keys(syncInfo).length >= 1) {
    //   const syncInfoTrue = syncInfo.syncInfo;
    //   syncInfoTrueOk = Object.keys(syncInfoTrue).map((e) => {
    //     return { 'time': e, 'startDate': syncInfoTrue[e].startDate, 'endDate': syncInfoTrue[e].endDate }
    //   });
    // }

    // single sync model for synchronization data details
    const singleSyncModel = (property, detail, propertyStyle) => {
      return (
        <div style={Object.assign({}, propertyStyle ? {} : { marginTop: 10 })}>
          <Row gutter={24}>
            <Col span={9} offset={1}>
              <div style={Object.assign({}, propertyStyle ? { height: 40, innerHeight: 40, marginTop: 10 } : {})}>{property}</div>
            </Col>
            <Col span={12}>
              <div style={Object.assign({}, propertyStyle ? { fontSize: 30, color: '#3b78e7' } : {})}>{detail}</div>
            </Col>
          </Row>
        </div>
      );
    };

    return (
      <div>
        <Tabs
          defaultActiveKey="0"
          onChange={this.tabsOnClick.bind(this)}
        >
          <TabPane tab="1M" key="0" />
          <TabPane tab="1S" key="1" />
          <TabPane tab="TICK" key="2" />
          <TabPane tab="REAL" key="3" />
        </Tabs>
        {/* first. Ib sync data switch  */}
        <div className={Styles.subProperty}>Ib sync data switch</div>
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
                onClick={this.IbButtonClick.bind(this, 'open')}
                style={{ marginRight: 20, marginBottom: 10 }}
              >open
              </Button>
              <Button
                type="primary"
                onClick={this.IbButtonClick.bind(this, 'close')}
                style={{ marginBottom: 10 }}
              >close
              </Button>
            </Col>
          </Row>
        </div>
        {/* second.Ib search stock text */}
        <div className={Styles.subProperty}>Ib search stock text</div>
        <div style={{ marginLeft: 40 }}>
          <Row gutter={24}>
            <Col md={12} sm={24}>
              <Select
                showSearch
                filterOption={false}
                placeholder="input search stock text"
                onSearch={this.onSearchStocks.bind(this)}
                onChange={this.handleChange.bind(this)}
                style={{ width: '100%', marginBottom: 10 }}
              >
                {this.getStockChildren(dataSource)}
              </Select>
            </Col>
          </Row>
          <div>
            <Row gutter={24}>
              <Col md={12} sm={24}>
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={{ showTotal: t => `Total ${t} Items` }}
                />
              </Col>
              <Col md={12} sm={24}>
                <img
                  alt="0"
                  src={add}
                  style={{ width: 16, cursor: 'pointer' }}
                  onClick={this.onImgAdd.bind(this)}
                />
              </Col>
            </Row>
          </div>
        </div>
        {/* third.Ib synchronization data details */}
        <div className={Styles.subProperty}>Ib synchronization data details</div>
        {singleSyncModel('1.synchronization progress :', <Progress
          percent={ToDecimal(histDataSyncProgress * 100)}
          status="active"
        />, false)}
        <div style={{ marginTop: 10 }}>
          <Row gutter={24}>
            <Col span={9} offset={1}>
              <div style={{ height: 40, innerHeight: 40, marginTop: 10 }}>2.histDataSyncTrack of stocks :</div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={19} offset={1}>
              <Table
                loading={loading}
                columns={columnLogs}
                dataSource={syncLogs}
                pagination={{ showTotal: t => `Total ${t} Items` }}
              />
            </Col>
          </Row>
        </div>
        <div>
          <Row gutter={24}>
            <Col span={10} offset={1}>
              <div style={{ height: 40, innerHeight: 40 }}>3.the latest synchronized symbols stock data :</div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={16} offset={1}>
              <Table
                loading={loading}
                columns={columnProgress}
                dataSource={syncedSymbols}
                pagination={{ showTotal: t => `Total ${t} Items` }}
              />
            </Col>
          </Row>
          <Modal
            title=""
            visible={visible}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            footer={false}
            style={{ height: 200 }}
          >
            <Row gutter={24}>
              <Col md={12} sm={24}>
                <Select
                  showSearch
                  filterOption={false}
                  placeholder="Please select"
                  onSearch={this.onPopSearchStocks.bind(this)}
                  onChange={this.handlePopChange.bind(this)}
                  style={{ width: '100%' }}
                >
                  {this.getPopStockChildren()}
                </Select>
              </Col>
            </Row>
          </Modal>
        </div>
      </div>
    );
  }
}
