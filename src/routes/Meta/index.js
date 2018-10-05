import React, { Component } from 'react';
import { Row, Col, Progress } from 'antd';
import { connect } from 'dva';
import { ToDecimal } from '../../components/CommonModal/Common';
import styles from './index.less';

@connect(({ Meta, loading }) => ({
  Meta,
  loading: loading.effects['Meta/fetch'],
}))

export default class MetaForm extends Component {
  state = {};

  componentDidMount() {
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    const { Meta: { syncData = {} } } = this.props;
    let usedSizeTrue = 0;
    let totalSizeTrue = 0;
    if (Object.keys(syncData).length >= 1) {
      const { capacity: { usedSize, totalSize } } = syncData;
      usedSizeTrue = usedSize;
      totalSizeTrue = totalSize;
    }

    return (
      <div>
        {/* first.Meta synchronization data details */}
        <div className={styles.subProperty}>Get how much capacity used in syncing:</div>
        <div style={{ marginTop: 10 }}>
          <Row gutter={24}>
            <Col span={13} offset={1}>
              <div style={{ height: 120, lineHeight: '120px', textAlign: 'center' }}>synchronization capacity :</div>
            </Col>
            <Col span={10}>
              <Progress
                percent={ToDecimal((usedSizeTrue / totalSizeTrue) * 100)}
                status="active"
                type="circle"
                format={percent => `${percent}% capacity`}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
