import React, { Component } from 'react';
import { Button, Select, Row, Col, Progress, Table } from 'antd';
import { connect } from 'dva';
import { ToDecimal, ResultToSign } from '../../components/CommonModal/Common';
import rhombus from '../../assets/sync/rhombus.png';
import rhombusNo from '../../assets/sync/rhombusNo.png';
import * as Service from '../../services/meta';
import styles from './index.less';

const { Option } = Select;

@connect(({ Meta, loading }) => ({
  Meta,
  loading: loading.effects['Meta/fetch'],
}))

export default class MetaForm extends Component {
  state = {
    stockData: {},
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
    Service.queryMetaSymbolsInfoData(valueTrue)
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
    this.setState({
      searchLoading: true,
    });
    const valueTrue = { code: codeList[value].symbol, isFuzzy: 0 };
    Service.queryMetaSymbolsInfoData(valueTrue)
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

  // Meta sync data button click
  metaButtonClick = (str) => {
    const { dispatch } = this.props;
    if (str === 'open') {
      dispatch({
        type: 'Meta/fetchStart',
      });
    } else if (str === 'close') {
      dispatch({
        type: 'Meta/fetchStop',
      });
    }
  };

  render() {
    const { Meta: { syncData = {} } } = this.props;
    // const { lastSyncStocks, currentProgress, eta, syncedSymbol } = progressData;
    let usedSizeTrue = 0;
    let totalSizeTrue = 0;
    if (Object.keys(syncData).length >= 1) {
      const { capacity: { usedSize, totalSize } } = syncData;
      usedSizeTrue = usedSize;
      totalSizeTrue = totalSize;
    }

    return (
      <div>
        {/* third.Meta synchronization data details */}
        <div className={styles.subProperty}>Get how much capacity used in syncing:</div>
        <div style={{ marginTop: 10 }}>
          <Row gutter={24}>
            <Col span={9} offset={1}>
              <div style={{ height: 120, lineHeight: '120px' }}>synchronization capacity :</div>
            </Col>
            <Col span={12}>
              <div style={{}}>
                <Progress
                  percent={ToDecimal((usedSizeTrue / totalSizeTrue) * 100)}
                  status="active"
                  type="circle"
                  format={percent => `${percent}% capacity`}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
