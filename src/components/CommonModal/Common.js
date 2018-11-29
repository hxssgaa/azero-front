import React from 'react';
import { Icon, Popover, Tooltip } from 'antd';
import moment from 'moment';
import style from './Common.less';

// 搜索块图标
const searchPrefix = (
  <Icon className={style.searchPrefix} type="search" />
);

// 时间日志格式化
export function StandardDate(StrDate, formatDate) {
  return new Date(StrDate).Format(formatDate);
}

export function NCRightTitleToShow(content) {
  return (
    <div
      className={style.cardTitle}
    >
      {content}
    </div>
  );
}

// 返回的key为undefined,统一转化为'-'
export function ResultToSign(objKey) {
  if (objKey === ' ') {
    return '-';
  }
  return !objKey ? '-' : objKey;
}

// 返回的key为undefined,统一转化为'-'
export function ResultToSignIndex(objKey) {
  if (objKey === ' ') {
    return '-';
  }
  if (objKey === '非数字') {
    return '-';
  }
  return !objKey ? '-' : objKey;
}

// 借款人管理、借款项目管理的table中借款人的数据展示
export function BorrowerResultToSign(objBorrower) {
  const end = objBorrower.length;
  if (end > 19) {
    const objBorrowerTrue = objBorrower.substring(0, 19);
    const str = '  ...';
    const objBorrowerTrueOk = objBorrowerTrue + str;
    return objBorrowerTrueOk;
  } else {
    return objBorrower;
  }
}

// 返回的key为undefined,统一转化为'0'
export function ResultToZero(objKey) {
  return !objKey ? '0' : objKey;
}

// 返回的key为undefined,统一转化为null
export function ResultToSingleList(objKey) {
  return !objKey ? null : objKey;
}

// 返回的key为undefined,统一转化为''
export function ResultToNullTrue(objKey) {
  return !objKey ? '' : objKey;
}

// 返回的key为undefined,统一转化为'0'
export function TotalRowsToResult(totalRows) {
  return !totalRows ? 0 : totalRows;
}

// 日期组件统一初始化
export function DatePickerCommon(LitigationInfoDateRange) {
  return (LitigationInfoDateRange !== undefined) ? [moment(LitigationInfoDateRange[0]), moment(LitigationInfoDateRange[1])] : [null, null];
}

// menu组件统一初始化
export function CaseTypeCommon(LitigationInfoCaseType) {
  return (LitigationInfoCaseType !== undefined) ? LitigationInfoCaseType.toString() : '0';
}

// head块  判断null 、undefined
export function DataListToResultHead(isSuccess, data) {
  return isSuccess && data.data.datas.list && data.data.datas.list.length === 0;
}

// fetch块  判断null 、undefined
export function DataListToResultFetch(isSuccess, data) {
  return isSuccess && data.data.datas.page.dataList && data.data.datas.page.dataList.length === 0;
}

export function DataListToResultNCFetch(isSuccess, data) {
  if (!data.Data) {
    return true;
  }
  return isSuccess && data.Data.Entities && data.Data.Entities.length === 0;
}

// 统一判断null 、undefined 、0 、'' 、NaN
export function IsEmpty(str) {
  return !str;
}

// 判断对象是否为空
export function IsEmptyObj(obj) {
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  } else {
    return !obj;
  }
}

// 判断对象是否为空
export function IsEmptyObjToShow(obj) {
  if (typeof obj === 'object') {
    return true;
  } else {
    return false;
  }
}

// 将undefined全部转为空
export function undefinedToNull(str) {
  return !str ? '' : str;
}

// 选择日期不能大于今天
export function disabledDate(current) {
  return Date.now() < current.valueOf();
}

// patch块  判断null 、undefined
export function DataListToResultPatch(isSuccess, data) {
  return isSuccess && data.data.datas && data.data.datas.length === 0;
}

// 把数字修改成大写
export function NumberToCapitalNumber(key) {
  switch (parseInt(key, 10)) {
    case 1:
      return '一';
    case 2:
      return '二';
    case 3:
      return '三';
    case 4:
      return '四';
    case 5:
      return '五';
    default:
      break;
  }
}

// 解析参数(网址带参数)
export function GetParam(name) {
  const regExpLeft = '(^|&)';
  const regExpRight = '=([^&]*)(&|$)';
  const reg = new RegExp(regExpLeft + name + regExpRight);
  const result = window.location.search.substr(1).match(reg);
  return result ? decodeURIComponent(result[2]) : null;
}

// 对应字段显示
export function VoucherStrToShow(str, num) {
  str = str.trim();
  if (str.length > num) {
    const remarkContent = `${str.slice(0, num - 1)}...`;
    return <Popover key={str.Id} content={str} placement="top"> {remarkContent} </Popover>;
  } else {
    return str;
  }
}

// 类型权重、字数来显示条目
export function ResultWeightNumberToShow(objResult, lenOk) {
  let lenOkTrue;
  if (lenOk) {
    lenOkTrue = lenOk;
  } else {
    lenOkTrue = 50;
  }
  let len;
  let objResultTrue;
  if (objResult) {
    len = objResult.length;
    if (len > lenOkTrue) {
      objResultTrue = `${objResult.substring(0, lenOkTrue - 1)} ...`;
      return (
        <Tooltip title={objResult}>
          <div>{objResultTrue}</div>
        </Tooltip>
      );
    }
  }
  return !objResult ? '-' : <div>{objResult}</div>;
}

// exchange the obj to another obj
export function ObjectExchangeToAnother(obj) {
  const fieldsArray = Object.keys(obj);
  const fieldsKey = fieldsArray[0];
  const value = obj[fieldsKey].value;
  return { [fieldsKey]: value };
}

// 将浮点数四舍五入，取小数点后2位
export function ToDecimal(obj) {
  if (obj.length > 22) {
    return obj;
  }
  let str = parseFloat(obj);
  if (isNaN(str)) {
    return;
  }
  if (!str.toString().split('.')[1]) {
    return str;
  }
  const len = str.toString().split('.')[1].length;
  if (len === 1 || len === 2) {
    return str;
  }
  str = Math.round(str * 100) / 100;
  return str.toFixed(2);
}

// 将undefined全部转为操作失败
export function UndefinedToHandleFail(str) {
  return !str ? '操作失败' : str;
}

// 设置合并行
export function SetRowCol(record, commonStr) {
  const valueTrue = ResultToSign(commonStr);
  const lengthTrue = parseInt(record.count, 10);
  return {
    children: <span>{valueTrue}</span>,
    props: {
      rowSpan: lengthTrue,
    },
  };
}

// 数组扁平化
export function Flatten(arr) {
  const str = JSON.stringify(arr).replace(/\[|\]/g, '');
  return JSON.parse(Array.of(`[${str}]`)[0]);
}

// 格式化时间戳
export function FmtDate(obj) {
  const d = new Date(obj * 1000);    // 根据时间戳生成的时间对象
  return `${d.getFullYear()}-${
  d.getMonth() + 1}-${
    (new Array(2).join('0') + d.getDate()).slice(-2)}
    ${(new Array(2).join('0') + d.getHours()).slice(-2)}:${
    (new Array(2).join('0') + d.getMinutes()).slice(-2)}:${(
      new Array(2).join('0') + d.getSeconds()).slice(-2)}`;
}

export default {
  searchPrefix,
  NCRightTitleToShow,
  StandardDate,
  ResultToSign,
  ResultToSignIndex,
  BorrowerResultToSign,
  ResultToZero,
  ResultToNullTrue,
  disabledDate,
  DataListToResultHead,
  DataListToResultFetch,
  DataListToResultPatch,
  DataListToResultNCFetch,
  IsEmpty,
  IsEmptyObj,
  IsEmptyObjToShow,
  TotalRowsToResult,
  ResultToSingleList,
  DatePickerCommon,
  CaseTypeCommon,
  undefinedToNull,
  NumberToCapitalNumber,
  GetParam,
  VoucherStrToShow,
  ResultWeightNumberToShow,
  ObjectExchangeToAnother,
  ToDecimal,
  UndefinedToHandleFail,
  SetRowCol,
  Flatten,
  FmtDate,
};
