import React, { Component } from 'react';
import { Button, Select, Row, Col, Progress, Table } from 'antd';
import rhombus from '../../assets/sync/rhombus.png';
import rhombusNo from '../../assets/sync/rhombusNo.png';
import { connect } from 'dva';
import * as Service from '../../services/api';

@connect(({ Ib, loading }) => ({
  Ib,
  loading: loading.effects['Ib/fetch'],
}))

export default class IbForm extends Component {
  state = {};

  // componentDidMount() {
  //   console.info(1111);
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'Ib/fetch',
  //   });
  // }

  // componentWillUnmount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'futu/clear',
  //   });
  // }

  laoXiangButtonClick = () => {
    console.info(4444,'laoxiang');
    Service.queryTdStartData().then((res) => {
       console.info(3333,res);
      });
  };

  render() {
    console.info('laoxiang5555',this.props.Ib);
    return (
      <div>
        <div>Td sync data switch</div>
        <div>
          <Row gutter={24}>
            <Col span={10}>
              <Button
                type="primary"
                onClick={this.laoXiangButtonClick.bind(this)}
                style={{ marginRight: 20, marginBottom: 10 }}
              >open
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  console.info('laoxiangzhendehenhao')
                }}
                style={{ marginBottom: 10 }}
              >close
              </Button>
            </Col>
            <Col span={9} offset={1}>
              <div>
                {parseInt(status, 10) === 0 ? 'server is not turned on: ' : 'server is turned on:'}
                {parseInt(status, 10) === 0 ? <img style={{ width: 16 }} alt={1} src={rhombusNo} /> : <img style={{ width: 16 }} alt={2} src={rhombus} />}
              </div>
            </Col>

          </Row>
        </div>
      </div>
    );
  }
}
