import React, { Component } from 'react';
import { Select, Input, Form, Row, Col } from 'antd';
import { connect } from 'dva';
import Stock from '../../components/Stock/Stock';
import Styles from './index.less';
import * as Service from '../../services/api';

const Option = Select.Option;
const Search = Input.Search;
const FormItem = Form.Item;
const isChineseReg = /[\u4e00-\u9fa5]/g;

// const children = [];
// for (let i = 10; i < 36; i += 1) {
//   children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
// }

@connect(({ Futu, loading }) => ({
  Futu,
  loading: loading.effects['Futu/fetch'],
}))
@Form.create({})
export default class FutuForm extends Component {
  state = {
    stockData: {},
    syncInfo: {},
  };

  componentWillMount() {
    this.getStockList();
  }

  // componentDidMount() {
  //   this.delayTimeStock = this.delayTime(this.delayFetchStocks.bind(this));
  // }

  shouldComponentUpdate() {
    return true;
  }

  handleChange = (value) => {
    const { stockData: { codeList } } = this.state;
    const valueTrue = { code: codeList[value].symbol, isFuzzy: 0 };
    console.info(666, valueTrue);
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

  onBlurStocks = (e) => {
    Service.queryTdSymbolsInfoData(e.target.value.toUpperCase())
      .then((res) => {
        console.info(3333, res);
        if (res && res.success) {
          const { data: { data } } = res;
          console.info(5555, data);
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

  getStockList(value) {
    this.setState({
      stopStockPage: 1,
    });
    const obj = value ? { StockName: value } : {};
    Service.queryTdSymbolsInfoData(obj)
      .then((res) => {
        if (res.datas && res.isSuccess) {
          const list = res.datas.data;
          const StockInfo = JSON.parse(list);
          const StockList = StockInfo.Entities;
          const pageInfo = StockInfo.PageInfo;
          this.setState({
            Stocks: StockList,
            StockPageInfo: pageInfo,
          });
        }
      });
  }

  // delay 获取stock数据
  delayFetchStocks(value) {
    if (value === '') { // 容错率
      this.getStockList();
    } else if (value.match(isChineseReg)) { // 性能优化
      if (value.length === value.match(isChineseReg).length) {
        this.getStockList(value);
      } else if (!(/^[\u4e00-\u9fa5]{1,}[a-zA-Z]{0,}/g).test(value)) {
        this.setState({
          stocks: [],
        });
      }
    }
  }

  // h
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

  render() {
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
            <div style={{ width: '88%', float: 'left', fontSize: 20, color: '#1890ff' }}>{`startDate:${startDate};endDate:${endDate}`}</div>
          </div>)
      });
    };
    return (
      <div>
        <div>
          <Row gutter={24}>
            <Col md={12} sm={24}>
              <Select
                showSearch
                filterOption={false}
                placeholder="Please select"
                onSearch={this.onSearchStocks.bind(this)}
                onChange={this.handleChange.bind(this)}
                style={{ width: '100%' }}
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
      </div>
    );
  }
}
