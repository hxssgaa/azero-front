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

const children = [];
for (let i = 10; i < 36; i += 1) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

@connect(({ Futu, loading }) => ({
  Futu,
  loading: loading.effects['Futu/fetch'],
}))
@Form.create({})
export default class FutuForm extends Component {
  state = {
    stockData: {},
  };

  componentWillMount() {
    this.getStockList();
  }

  // componentDidMount() {
  //   this.delayTimeStock = this.delayTime(this.delayFetchStocks.bind(this));
  // }

  handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  onSearchStocks = (value) => {
    // Service.queryTdSymbolsInfoData(value.toUpperCase())
    //   .then((res) => {
    //     console.info(3333, res);
    //   });
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
  getStockChildrens() {
    const datas = this.state.Stocks;
    const children = [];
    if (datas.length !== 0) {
      const len = datas.length;
      for (let i = 0; i < len; i += 1) {
        children.push(<Option title={datas[i].StockName} className={Styles.stockSelectOption} key={datas[i].StockGuid}>{datas[i].StockName}</Option>);
      }
      return children;
    }
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { stockData } = this.state;
    console.info(666, stockData);
    return (
      <div>
        <div>
          <Row gutter={24}>
            <Col md={12} sm={24}>
              <Select
                mode="multiple"
                placeholder="Please select"
                onSearch={this.onSearchStocks.bind(this)}
                onChange={this.handleChange.bind(this)}
                style={{ width: '100%' }}
              >
                <Option value="1">Option 1</Option>
                <Option value="2">Option 2</Option>
                <Option value="3">Option 3</Option>
              </Select>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 50 }}>
          <Row gutter={24}>
            <Col md={12} sm={24}>
              <Search
                placeholder="input search stock text"
                onBlur={this.onBlurStocks.bind(this)}
                onSearch={this.onSearchStocks.bind(this)}
                style={{ width: 300 }}
              />
            </Col>
          </Row>
        </div>
        <div>
          {Object.keys(stockData).length >= 1 ?
            (
              <Row gutter={24}>
                <Col md={8} sm={24}>
                  <div style={{ display: 'block' }}>
                    <div style={{ width: '40%', float: 'left', fontSize: 30 }}>symbol:</div>
                    <div style={{ width: '60%', float: 'left', fontSize: 30, color: '#1890ff' }}>{stockData.codeList.symbol}</div>
                  </div>
                </Col>
                <Col md={8} sm={24}>
                  <div style={{ display: 'block' }}>
                    <div style={{ width: '40%', float: 'left', fontSize: 30 }}>title:</div>
                    <div style={{ width: '60%', float: 'left', fontSize: 30, color: '#1890ff' }}>{stockData.codeList.title}</div>
                  </div>
                </Col>
                <Col md={8} sm={24}>
                  <div style={{ display: 'block' }}>
                    <div style={{ width: '40%', float: 'left', fontSize: 30 }}>date:</div>
                    <div style={{ width: '60%', float: 'left', fontSize: 30, color: '#1890ff' }}>{stockData.codeList.date}</div>
                  </div>
                </Col>
              </Row>)
            : null}
        </div>

      </div>
    );
  }
}
