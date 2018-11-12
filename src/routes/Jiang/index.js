import React, { Component } from 'react';
import Styles from './index.less';

export default class JiangForm extends Component {
  render() {
    return (
      <div>
        <div className={Styles.first1}>布局1 两列的浮动布局 float:right</div>
        <div className={Styles.second1}>布局1 两列的浮动布局 float:left</div>

        <div className={Styles.first2}>
          <div className={Styles.first2_1}>布局2 三列的浮动布局 float:left</div>
          <div className={Styles.first2_2}>布局2 三列的浮动布局 float:right</div>
        </div>
        <div className={Styles.second2}>布局2 三列的浮动布局 float:left</div>
      </div>
    );
  }
}
