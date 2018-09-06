import React, { Component } from 'react';
import { Form, Select, Input, Row, Col } from 'antd';
import cx from 'classnames';
import Styles from './Stock.less';
import * as Service from '../../services/api';

const FormItem = Form.Item;
const Option = Select.Option;
const isChineseReg = /[\u4e00-\u9fa5]/g;

export default class StockSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banks: [],                      // 总行列表数据
      subBanks: [],                   // 支行列表数据
      bankPageInfo: {},               // 当前总行分页信息
      branchPageInfo: {},             // 当前支行分页信息
      subBankDisabled: true,          // 当无银行数据的时候，支行为disabled状态
      searchValue: '',                // 总行当前搜索的值
      searchBranchValue: '',          // 支行当前搜索的值
      stopbankPage: 1,                // 总行阻止页面
      stopSubBankPage: 1,             // 支行阻止页面
    };
  }

  componentWillMount() {
    this.getBankList();
  }

  componentDidMount() {
    this.delayTimeBank = this.delayTime(this.delayFetchBanks.bind(this));
  }

  componentWillReceiveProps(nextprops) {
    const bankGuid = nextprops.form.getFieldValue(this.props.bankGuid);
    if (bankGuid) {
      this.setState({
        subBankDisabled: false,
      });
    } else {
      this.setState({
        subBankDisabled: true,
      });
    }
  }

  // 比较列表数组是否相等的方法
  compareArray = (arr1 = [], arr2 = []) => {
    arr1 = arr1.sort();
    arr2 = arr2.sort();
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  // 实时请求方法的封装
  delayTime(callback) {
    const date = new Date();
    let strotime = date.getTime();
    const callbacktemp = callback;
    let timeID = null;
    return function (value) {
      const date2 = new Date();
      const strotime2 = date2.getTime();
      if ((strotime2 - strotime) > 1000) {
        callbacktemp(value);
        strotime = strotime2;
        clearTimeout(timeID);
      } else {
        if (timeID) {
          clearTimeout(timeID);
        }
        timeID = setTimeout(() => {
          callbacktemp(value);
        }, 100);
      }
    };
  }

  /** ************************************************总行方法开始*************************************************** */
  // 获取总行列表数据
  getBankList(value) {
    this.setState({
      stopbankPage: 1,
    });
    const obj = value ? { bankName: value } : {};
    Service.queryTdSymbolsInfoData(obj)
      .then((res) => {
        if (res.datas && res.isSuccess) {
          const list = res.datas.data;
          const bankInfo = JSON.parse(list);
          const bankList = bankInfo.Entities;
          const pageInfo = bankInfo.PageInfo;
          this.setState({
            banks: bankList,
            bankPageInfo: pageInfo,
          });
        }
      });
  }

  // delay 获取银行总行数据
  fetchBanks = (value) => {
    this.setState({
      searchValue: value,
      stopbankPage: 1,
    });
    this.delayTimeBank(value);
  };

  // onFocous方法获取总行数据
  onFocusBanks() {
    this.setState({
      searchValue: '',
    });
    this.getBankList();
  }

  // delay 获取银行总行数据
  delayFetchBanks(value) {
    if (value === '') { // 容错率
      this.getBankList();
    } else if (value.match(isChineseReg)) { // 性能优化
      if (value.length === value.match(isChineseReg).length) {
        this.getBankList(value);
      } else if (!(/^[\u4e00-\u9fa5]{1,}[a-zA-Z]{0,}/g).test(value)) {
        this.setState({
          banks: [],
        });
      }
    }
  }

  // 总行change事件
  handleBankChange(value) {
    this.setState({
      subBanks: [],
      stopSubBankPage: 1,
    });
    const currentBank = this.state.banks.find((item) => {
      return item.BankGuid === value;
    });
    // 存bankGuid
    const bankGuidObj = {};
    bankGuidObj[this.props.bankGuid] = value;
    this.props.form.setFieldsValue(bankGuidObj);
    // 存bankName
    const bankNameObj = {};
    bankNameObj[this.props.bankRealName] = currentBank.BankName;
    this.props.form.setFieldsValue(bankNameObj);
    Service.queryTdSymbolsInfoData({ bankGuid: value })
      .then((res) => {
        if (res.datas && res.isSuccess) {
          const list = res.datas.data;
          const bankInfo = JSON.parse(list);
          const bankBranchList = bankInfo.Entities;
          const branchPageInfo = bankInfo.PageInfo;
          this.setState({
            subBanks: bankBranchList,
            subBankDisabled: false,
            haveSubBank: true,
            branchPageInfo,
          }, () => {
            const error = this.props.form.getFieldError(this.props.subBankName);
            this.props.form.resetFields([this.props.subBankName]);
            this.props.form.resetFields([this.props.subBankGuid]);
            this.props.form.resetFields([this.props.subBankRealName]);
            const obj = {};
            obj[this.props.subBankName] = { errors: [new Error('此项必填')] };
            if (error) {
              this.props.form.setFields(obj);
            }
          });
        }
      });
  }

  // 总行滚动加载数据
  bankOnPopupScroll = (e) => {
    const target = e.target;
    if (target.scrollHeight - target.scrollTop - target.offsetHeight < 1) {
      this.scrollFetchBanks();
    }
  };

  // 具体的下拉获取总行数据的方法
  scrollFetchBanks = () => {
    const { bankPageInfo, banks, stopbankPage, searchValue } = this.state;
    const currentPage = bankPageInfo.CurrentPage;
    const totalRows = bankPageInfo.TotalRows;
    const pageSize = bankPageInfo.PageSize;
    const totalPages = bankPageInfo.TotalPages;
    const bank = searchValue;
    if (totalPages > 1 && totalRows > currentPage * pageSize && stopbankPage === currentPage) {
      Service.queryTdSymbolsInfoData({ bankName: bank, pageNum: currentPage + 1 })
        .then((res) => {
          if (res.datas && res.isSuccess) {
            const list = res.datas.data;
            const bankInfo = JSON.parse(list);
            const bankList = bankInfo.Entities;
            const pageInfo = bankInfo.PageInfo;
            if (!this.compareArray(bankList, banks.slice(-30))) {
              const banksArray = banks.concat(bankList);
              this.setState({
                banks: banksArray,
                bankPageInfo: pageInfo,
                stopbankPage: pageInfo.CurrentPage,
              });
            }
          }
        });
    }
  };

  /** ************************************************总行方法结束*************************************************** */

  // 所有总行
  getBankChildrens() {
    const datas = this.state.banks;
    const children = [];
    if (datas.length !== 0) {
      const len = datas.length;
      for (let i = 0; i < len; i += 1) {
        children.push(<Option title={datas[i].BankName} className={Styles.bankSelectOption} key={datas[i].BankGuid}>{datas[i].BankName}</Option>);
      }
      return children;
    }
  }

  render() {
    const { subBankDisabled } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 14 },
      },
    };
    return (
      <div className={cx(Styles.cityWrap, Styles.clearFix)}>
        <Row gutter={24}>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label={this.props.bankLabel}>
              {getFieldDecorator(this.props.bankName, {
                rules: [{
                  required: true,
                  message: '此项必填',
                }],
              })(
                <Select
                  showSearch
                  filterOption={false}
                  placeholder="请选择"
                  onSearch={this.fetchBanks.bind(this)}
                  onChange={this.handleBankChange.bind(this)}
                  onSelect={() => {
                    this.getBankList();
                  }}
                  onFocus={() => {
                    this.onFocusBanks();
                  }}
                  onPopupScroll={this.bankOnPopupScroll}
                >
                  {this.getBankChildrens()}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24} style={{ display: 'none' }}>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label={this.props.bankLabel}>
              {getFieldDecorator(this.props.bankGuid)(
                <Input
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24} style={{ display: 'none' }}>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label={this.props.bankLabel}>
              {getFieldDecorator(this.props.bankRealName)(
                <Input
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem {...formItemLayout} label={this.props.subBankLabel}>
              {getFieldDecorator(this.props.subBankRealName)(
                <Input
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}

