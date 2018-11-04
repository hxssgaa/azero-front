import React, { Component } from 'react';
import { Button, Select, Row, Col, Progress, Table, Tabs, Modal, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import { ToDecimal, FmtDate } from '../../components/CommonModal/Common';
import rhombus from '../../assets/sync/rhombus.png';
import rhombusNo from '../../assets/sync/rhombusNo.png';
import add from '../../../public/add.png';
import * as Service from '../../services/ib';
import Styles from './index.less';

const { Option } = Select;
const { TabPane } = Tabs;

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
    searchType: "0",
    syncInfo: {},
  };

  componentDidMount() {
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
  onSearchClick = (value) => {
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

  // on pop search click
  onPopSearchStocks = (value) => {
    const valueTrue = { code: value.toUpperCase(), isFuzzy: 1 };
    Service.queryTdSymbolsInfoData(valueTrue)
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

  // on search add click
  onSearchAddClick = () => {
    console.info('3333');
    this.setState({
      visible: true,
    });
  };

  // on symbol delete click
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

  // on symbol cancel click
  onSymbolStockCancelBtn = () => {
  };

  // Ib sync data button click
  onOpenCloseClick = (str) => {
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

  // on pop select click
  onPopSelectStocks = (value) => {
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
      dispatch({
        type: 'Ib/fetchAdd',
        payload: { stocksSymbols, tabsIndex },
      });
    } else {
      message.warning('请重新选择一支股票');
    }
  };

  // Ib tabs click
  onTabsClick = (key) => {
    const { dispatch } = this.props;
    this.setState({
      tabsIndex: key,
      syncInfo: {},
    });
    if (key !== '4') {
      dispatch({
        type: 'Ib/fetch',
        payload: key,
        syncInfo: {},
      });
    }
  };

  // on search stocks
  onSearchChangeClick = (value) => {
    const { stockData, searchType } = this.state;
    // const achieveSymbol = stockData[value].symbol;
    const valueTrue = { code: stockData[value].symbol, type: searchType };
    Service.queryIbSymbolsInfoData(valueTrue)
      .then((res) => {
        if (res && res.success) {
          const { data: { syncInfo } } = res;
          this.setState({
            syncInfo,
          })
        } else {
          this.setState({
            syncInfo: {},
          })
        }
      });
  };

  // on type click search
  onSearchTypeClick = (value) => {
    this.setState({
      searchType: value,
    })
  };

  // on pop model ok
  onPopModelOk() {
    console.log('点击了确定');
    this.setState({
      visible: false,
    });
  }

  // on pop model cancel
  onPopModelCancel() {
    this.setState({
      visible: false,
    });
  }

  // get search child text
  getSearchChildText() {
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

  // get pop stock child
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

  render() {
    const { loading, Ib: { syncData, progressData, syncedSymbolsData: { stocks }, currentTime } } = this.props;
    const { tabsIndex, visible, stockData, syncInfo } = this.state;
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
      if (histDataSyncTrack && Object.keys(histDataSyncTrack).length >= 1) {
        syncLogs = histDataSyncTrack.syncLogs;
        histDataSyncProgress = histDataSyncTrack.histDataSyncProgress;
        syncedSymbols = histDataSyncTrack.syncedSymbols;
      }
    }

    const { status } = syncData;

    const columnsSearch = [
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

    // zero. Ib sync current data
    const zeroIbSyncData = () => {
      return (
        <div>
          <div className={Styles.subProperty}>Ib sync current time</div>
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
                  {currentTime ? 'ib server is ok: ' : 'ib server is not ok:'}
                  {currentTime ? <img style={{ width: 16 }} alt={1} src={rhombus} /> : <img style={{ width: 16 }} alt={2} src={rhombusNo} />}
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
                <div>{currentTime && FmtDate(currentTime)}</div>
              </Col>
            </Row>
          </div>
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
                  onClick={this.onOpenCloseClick.bind(this, 'open')}
                  style={{ marginRight: 20 }}
                >open
                </Button>
                <Button
                  type="primary"
                  onClick={this.onOpenCloseClick.bind(this, 'close')}
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
                xs={{ span: 3 }}
                sm={{ span: 3 }}
                md={{ span: 2, offset: 1 }}
                lg={{ span: 2, offset: 1 }}
                xl={{ span: 2, offset: 1 }}
                xxl={{ span: 2, offset: 1 }}
              >
                <div style={{ width: '100%', height: 32, lineHeight: '32px' }}>type:</div>
              </Col>
              <Col
                xs={{ span: 6 }}
                sm={{ span: 6 }}
                md={{ span: 4 }}
                lg={{ span: 4 }}
                xl={{ span: 4 }}
                xxl={{ span: 4 }}
              >
                <Select
                  style={{ width: '100%' }}
                  defaultValue="1M"
                  onChange={this.onSearchTypeClick.bind(this)}
                >
                  <Option value="0">1M</Option>
                  <Option value="1">1S</Option>
                  <Option value="2">TICK</Option>
                  <Option value="3">REAL</Option>
                </Select>
              </Col>
              <Col
                xs={{ span: 4 }}
                sm={{ span: 4 }}
                md={{ span: 2 }}
                lg={{ span: 2 }}
                xl={{ span: 2 }}
                xxl={{ span: 2 }}
              >
                <div style={{ width: '100%', height: 32, lineHeight: '32px' }}>symbol:</div>
              </Col>
              <Col
                xs={{ span: 11 }}
                sm={{ span: 11 }}
                md={{ span: 15 }}
                lg={{ span: 15 }}
                xl={{ span: 15 }}
                xxl={{ span: 15 }}
              >
                <Select
                  showSearch
                  filterOption={false}
                  placeholder="input search stock text"
                  onSearch={this.onSearchClick.bind(this)}
                  onChange={this.onSearchChangeClick.bind(this)}
                  style={{ width: '100%', marginBottom: 10 }}
                >
                  {this.getSearchChildText()}
                </Select>
              </Col>
            </Row>
            {syncInfo && Object.keys(syncInfo).length >= 1 ? (
              <Row gutter={24}>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 16, offset: 1 }}
                  lg={{ span: 16, offset: 1 }}
                  xl={{ span: 16, offset: 1 }}
                  xxl={{ span: 16, offset: 1 }}
                >
                  <div style={{ color: '#3b78e7', marginBottom: 10 }}>{`${syncInfo.startDate  }-${  syncInfo.endDate}`}</div>
                </Col>
              </Row>
            ) : null}
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
                    columns={columnsSearch}
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
                    onClick={this.onSearchAddClick.bind(this)}
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
        <div style={{ marginBottom: 10 }}>
          {zeroIbSyncData()}
        </div>
        <div style={{ width: '100%', border: '1px solid #3b78e7' }} />
        <Tabs
          defaultActiveKey="0"
          onChange={this.onTabsClick.bind(this)}
        >
          <TabPane tab="1M" key="0">
            {/* first. Ib sync data switch  */}
            {firstIbSyncData()}
            {/* third.Ib synchronization data details */}
            {thirdIbSyncData()}
          </TabPane>
          <TabPane tab="1S" key="1">
            {firstIbSyncData()}
            {thirdIbSyncData()}
          </TabPane>
          <TabPane tab="TICK" key="2">
            {firstIbSyncData()}
            {thirdIbSyncData()}
          </TabPane>
          <TabPane tab="REAL" key="3">
            {firstIbSyncData()}
            {thirdIbSyncRealData()}
          </TabPane>
          <TabPane tab="OPTION" key="4">
            {/* second.Ib search stock text */}
            {secondIbSyncData()}
          </TabPane>
        </Tabs>
        <Modal
          title=""
          visible={visible}
          onOk={this.onPopModelOk.bind(this)}
          onCancel={this.onPopModelCancel.bind(this)}
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
                onSelect={this.onPopSelectStocks.bind(this)}
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
