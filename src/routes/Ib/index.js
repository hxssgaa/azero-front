import React, { Component } from 'react';
import { Button, Select, Row, Col, Progress, Table, Tabs, Modal, message, Popconfirm } from 'antd';
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
    stockData: (this.props.Ib && this.props.Ib.syncedSymbolsData && this.props.Ib.syncedSymbolsData.stocks) ? this.props.Ib.syncedSymbolsData.stocks : [],
    stockPopData: {},
    tabsIndex: "0",
    syncInfo: {},
    searchLoading: false,
  };

  componentDidMount() {
    // console.info(1111, this.props.Ib.syncedSymbolsData.stocks);
  }

  componentWillReceiveProps(nextProps) {
    // console.info(22222, nextProps);
    const { Ib: { syncedSymbolsData: { stocks } } } = this.props;
    this.setState({
      stockData: stocks,
    })
  }

  shouldComponentUpdate() {
    return true;
  }

  // on search stocks
  onSearchStocks = (value) => {
    console.info('搜索', value);
    const valueTrue = { code: value.toUpperCase(), isFuzzy: 1 };
    const { Ib: { syncedSymbolsData: { stocks } }, dispatch } = this.props;
    const stocksSymbols = stocks.map((item, index) => {
      return { 'symbol': item.symbol }
    });

    console.info('stocksSymbols', stocksSymbols);

    // Service.queryIbSymbolsInfoData(valueTrue)
    //   .then((res) => {
    //     if (res && res.success) {
    //       const { data: { data } } = res;
    //       this.setState({
    //         stockData: data,
    //       })
    //     } else {
    //       this.setState({
    //         stockData: {},
    //       })
    //     }
    //   });
  };

  // achieve the stock symbol
  getStockChildren() {
    const { Ib: { syncedSymbolsData: { stocks } } } = this.props;
    const children = [];
    if (stocks) {
      const dataSource = stocks;
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
    }
    return false;
  }

  // on search stocks
  handleChange = (value) => {
    const { stockData: { codeList } } = this.state;
    console.info('搜索OnChange', value);
    // this.setState({
    //   searchLoading: true,
    // });
    // const valueTrue = { code: codeList[value].symbol, isFuzzy: 0 };
    // Service.queryIbSymbolsInfoData(valueTrue)
    //   .then((res) => {
    //     if (res && res.success) {
    //       const { data: { data } } = res;
    //       this.setState({
    //         syncInfo: data,
    //         searchLoading: false,
    //       })
    //     } else {
    //       this.setState({
    //         syncInfo: {},
    //         searchLoading: false,
    //       })
    //     }
    //   });
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
    console.info(2222, value);
    const valueTrue = { code: value.toUpperCase(), isFuzzy: 1 };
    ServiceApi.queryTdSymbolsInfoData(valueTrue)
      .then((res) => {
        if (res && res.success) {
          const { data: { data } } = res;
          this.setState({
            stockPopData: data,
          })
        } else {
          this.setState({
            stockPopData: {},
          })
        }
      });
  };

  handlePopChange = (value) => {
    console.info(1111,value);
    const { stockPopData: { codeList }, tabsIndex } = this.state;
    const achieveSymbol = codeList[value].symbol;
    const { Ib: { syncedSymbolsData: { stocks } }, dispatch } = this.props;
    const stocksSymbols = stocks.map((item, index) => {
      return { 'symbol': item.symbol }
    });
    const stockAchieveJudge = stocksSymbols.some((item, index) => {
      if (achieveSymbol === item.symbol) return true; else return false;
    });
    if (!stockAchieveJudge) {
      stocksSymbols.push({ 'symbol': achieveSymbol });
      console.info(9999, stocksSymbols);
      dispatch({
        type: 'Ib/fetchAdd',
        payload: { stocksSymbols, tabsIndex },
      });
    } else {
      message.warning('请重新选择一支股票');
    }
  };

  // getStockChildren = (dataSource) => {
  //   // const { stockData } = this.state;
  //   // const { codeList = [] } = stockData;
  //   const children = [];
  //   if (dataSource.length !== 0) {
  //     const len = dataSource.length;
  //     for (let i = 0; i < len; i += 1) {
  //       children.push(<Option
  //         title={dataSource[i].symbol}
  //         className={Styles.stockSelectOption}
  //         key={i}
  //       >{`[${dataSource[i].symbol}]${dataSource[i].title}`}
  //       </Option>);
  //     }
  //     return children;
  //   }
  // };

  getPopStockChildren = () => {
    const { stockPopData } = this.state;
    const { codeList = [] } = stockPopData;
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

  onSymbolStockDelete = (record) => {
    console.info('删除', record);
    const achieveSymbol = record.symbol;
    const { Ib: { syncedSymbolsData: { stocks } }, dispatch } = this.props;
    const stocksSymbols = stocks.map((item, index) => {
      return { 'symbol': item.symbol }
    });

    let stockIndex = 0;
    stocksSymbols.findIndex((item, index) => {
      if (achieveSymbol === item.symbol) {
        stockIndex = index;
      }
    });
    stocksSymbols.splice(stockIndex, 1);
    // console.info(9999, stocksSymbols);
    dispatch({
      type: 'Ib/fetchAdd',
      payload: { stocksSymbols },
    });
  };

  // 取消删除按钮
  onSymbolStockCancelBtn = () => {
  };

  handleCancel() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { loading, Ib: { syncData, progressData, syncedSymbolsData: { stocks } } } = this.props;
    const { tabsIndex, visible, stockData } = this.state;
    // console.info(2222, stockData);
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
        width: '25%',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: '33%',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: '30%',
      },
      {
        title: 'Ope',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <div>
            <Popconfirm
              title="are you sure to delete this symbol?"
              onConfirm={() => this.onSymbolStockDelete(record)}
              onCancel={this.onSymbolStockCancelBtn}
              okText="confirm"
              cancelText="cancel"
            >
              <a style={{ cursor: 'point' }} href="">Del</a>
            </Popconfirm>
          </div>
        ),
        width: '12%',
      },
    ];

    // const test = [1, 3, 4, 5, 6];
    // const maxIndex = test.findIndex(val => val === Math.max(...test));
    //
    // console.info(111,maxIndex);

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
        width: '25%',
      },
      {
        title: 'Log',
        dataIndex: 'log',
        key: 'log',
        width: '75%',
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
            <Col
              xs={{ span: 7 }}
              sm={{ span: 7 }}
              md={{ span: 7, offset: 1 }}
              lg={{ span: 7, offset: 1 }}
              xl={{ span: 7, offset: 1 }}
              xxl={{ span: 7, offset: 1 }}
            >
              <div style={Object.assign({}, propertyStyle ? { height: 30, innerHeight: 30, marginTop: 10 } : {})}>{property}</div>
            </Col>
            <Col
              xs={{ span: 15 }}
              sm={{ span: 15 }}
              md={{ span: 15 }}
              lg={{ span: 15 }}
              xl={{ span: 15 }}
              xxl={{ span: 15 }}
            >
              <div style={Object.assign({}, propertyStyle ? { fontSize: 30, color: '#3b78e7' } : {})}>{detail}</div>
            </Col>
          </Row>
        </div>
      );
    };

    // first. Ib sync data switch
    const firstIbSyncData = () => {
      return (
        <div>
          <div className={Styles.subProperty}>Ib sync data switch</div>
          <div>
            <Row gutter={24}>
              <Col
                xs={{ span: 12 }}
                sm={{ span: 12 }}
                md={{ span: 9, offset: 1 }}
                lg={{ span: 9, offset: 1 }}
                xl={{ span: 9, offset: 1 }}
                xxl={{ span: 9, offset: 1 }}
              >
                <div>
                  {parseInt(status, 10) === 0 ? 'not turned on: ' : 'turned on:'}
                  {parseInt(status, 10) === 0 ? <img style={{ width: 16 }} alt={1} src={rhombusNo} /> : <img style={{ width: 16 }} alt={2} src={rhombus} />}
                </div>
              </Col>
              <Col
                xs={{ span: 12 }}
                sm={{ span: 12 }}
                md={{ span: 14 }}
                lg={{ span: 14 }}
                xl={{ span: 14 }}
                xxl={{ span: 14 }}
              >
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
        </div>
      );
    };

    // second.Ib search stock text
    const secondIbSyncData = () => {
      return (
        <div>
          <div className={Styles.subProperty}>Ib search stock text</div>
          <div>
            <Row gutter={24}>
              <Col
                xs={{ span: 16 }}
                sm={{ span: 16 }}
                md={{ span: 16, offset: 1 }}
                lg={{ span: 16, offset: 1 }}
                xl={{ span: 16, offset: 1 }}
                xxl={{ span: 16, offset: 1 }}
              >
                <Select
                  showSearch
                  filterOption={false}
                  placeholder="input search stock text"
                  onSearch={this.onSearchStocks.bind(this)}
                  onChange={this.handleChange.bind(this)}
                  style={{ width: '100%', marginBottom: 10 }}
                >
                  {this.getStockChildren()}
                </Select>
              </Col>
            </Row>
            <div>
              <Row gutter={24}>
                <Col
                  xs={{ span: 21 }}
                  sm={{ span: 21 }}
                  md={{ span: 19, offset: 1 }}
                  lg={{ span: 19, offset: 1 }}
                  xl={{ span: 19, offset: 1 }}
                  xxl={{ span: 19, offset: 1 }}
                >
                  <Table
                    loading={loading}
                    dataSource={stockData}
                    columns={columns}
                    pagination={{ showTotal: t => `Total ${t} Items` }}
                  />
                </Col>
                <Col
                  xs={{ span: 3 }}
                  sm={{ span: 3 }}
                  md={{ span: 4 }}
                  lg={{ span: 4 }}
                  xl={{ span: 4 }}
                  xxl={{ span: 4 }}
                >
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
        </div>
      );
    };

    // third.Ib synchronization data details
    const thirdIbSyncData = () => {
      return (
        <div>
          <div className={Styles.subProperty}>Ib synchronization data details</div>
          {singleSyncModel('1.progress :', <Progress
            percent={parseFloat(ToDecimal(histDataSyncProgress * 100))}
            status="active"
          />, false)}
          <div style={{ marginTop: 10 }}>
            <Row gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 9, offset: 1 }}
                lg={{ span: 9, offset: 1 }}
                xl={{ span: 9, offset: 1 }}
                xxl={{ span: 9, offset: 1 }}
              >
                <div style={{ height: 30, innerHeight: 30, marginTop: 10 }}>2.histDataSyncTrack of stocks :</div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 23, offset: 1 }}
                lg={{ span: 23, offset: 1 }}
                xl={{ span: 23, offset: 1 }}
                xxl={{ span: 23, offset: 1 }}
              >
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
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 11, offset: 1 }}
                lg={{ span: 11, offset: 1 }}
                xl={{ span: 11, offset: 1 }}
                xxl={{ span: 11, offset: 1 }}
              >
                <div style={{ height: 30, innerHeight: 30 }}>3.the latest synchronized symbols stock data :</div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 18, offset: 1 }}
                lg={{ span: 18, offset: 1 }}
                xl={{ span: 18, offset: 1 }}
                xxl={{ span: 18, offset: 1 }}
              >
                <Table
                  loading={loading}
                  columns={columnProgress}
                  dataSource={syncedSymbols}
                  pagination={{ showTotal: t => `Total ${t} Items` }}
                />
              </Col>
            </Row>
          </div>
        </div>
      );
    };

    // third.Ib synchronization data details(real model)
    const thirdIbSyncRealData = () => {
      return (
        <div>
          <div className={Styles.subProperty}>Ib synchronization data details</div>
          <div style={{ marginTop: 10 }}>
            <Row gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 9, offset: 1 }}
                lg={{ span: 9, offset: 1 }}
                xl={{ span: 9, offset: 1 }}
                xxl={{ span: 9, offset: 1 }}
              >
                <div style={{ height: 30, innerHeight: 30, marginTop: 10 }}>1.histDataSyncTrack of stocks :</div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 23, offset: 1 }}
                lg={{ span: 23, offset: 1 }}
                xl={{ span: 23, offset: 1 }}
                xxl={{ span: 23, offset: 1 }}
              >
                <Table
                  loading={loading}
                  columns={columnLogs}
                  dataSource={syncLogs.reverse()}
                  pagination={{ showTotal: t => `Total ${t} Items` }}
                />
              </Col>
            </Row>
          </div>
          <div>
            <Row gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 11, offset: 1 }}
                lg={{ span: 11, offset: 1 }}
                xl={{ span: 11, offset: 1 }}
                xxl={{ span: 11, offset: 1 }}
              >
                <div style={{ height: 30, innerHeight: 30 }}>2.the latest synchronized symbols stock data :</div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 24 }}
                md={{ span: 18, offset: 1 }}
                lg={{ span: 18, offset: 1 }}
                xl={{ span: 18, offset: 1 }}
                xxl={{ span: 18, offset: 1 }}
              >
                <Table
                  loading={loading}
                  columns={columnProgress}
                  dataSource={syncedSymbols}
                  pagination={{ showTotal: t => `Total ${t} Items` }}
                />
              </Col>
            </Row>
          </div>
        </div>
      );
    };

    return (
      <div>
        <Tabs
          defaultActiveKey="0"
          onChange={this.tabsOnClick.bind(this)}
        >
          <TabPane tab="1M" key="0">
            {/* first. Ib sync data switch  */}
            {firstIbSyncData()}
            {/* second.Ib search stock text */}
            {secondIbSyncData()}
            {/* third.Ib synchronization data details */}
            {thirdIbSyncData()}
          </TabPane>
          <TabPane tab="1S" key="1">
            {firstIbSyncData()}
            {secondIbSyncData()}
            {thirdIbSyncData()}
          </TabPane>
          <TabPane tab="TICK" key="2">
            {firstIbSyncData()}
            {secondIbSyncData()}
            {thirdIbSyncData()}
          </TabPane>
          <TabPane tab="REAL" key="3">
            {firstIbSyncData()}
            {secondIbSyncData()}
            {thirdIbSyncRealData()}
          </TabPane>
        </Tabs>
        <Modal
          title=""
          visible={visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={false}
          style={{ height: 200 }}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Select
                showSearch
                filterOption={false}
                placeholder="Please select"
                onSearch={this.onPopSearchStocks.bind(this)}
                onSelect={this.handlePopChange.bind(this)}
                style={{ width: '90%' }}
              >
                {this.getPopStockChildren()}
              </Select>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
