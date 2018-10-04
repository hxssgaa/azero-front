import request from '../utils/request';

// query td sync data
export async function queryIbSyncData(payload) {
  // return request('/td/getSyncProgress');
  // return request('/api/queryFutuData');
  // const { type = '0' } = payload;
  // console.info(111, payload);
  // const payloadTrue = !payload ? '0' : payload;
  return request(`/ib/getSyncStatus.do?type=${payload}`);
}

// query td sync progress data
export async function queryIbSyncProgressData() {
  // return request('/td/getSyncProgress');
  // return request('/api/queryFutuData');
  return request('/ib/getProgress.do');
}

// query td symbols info data
export async function queryIbSymbolsInfoData(params) {
  // return request('/td/getSyncProgress');
  return request('/api/queryFutuData');
  const { code, isFuzzy } = params;
  return request(`/td/getSymbolsInfo.do?isFuzzy=${isFuzzy}&code=${code}`);
}


export async function queryIbSyncSymbols() {
  // return request('/td/getSyncProgress');
  // return request('/api/queryFutuData');
  // const { code, isFuzzy } = params;
  return request('/ib/getSyncSymbols.do');
}

export async function queryIbConfigSyncSymbols() {
  // return request('/td/getSyncProgress');
  return request('/api/queryFutuData');
  // const { code, isFuzzy } = params;
  const newParams = Object.assign({}, { codeList: [{ symbol: 'US.HUYA' }, { symbol: 'US.HMI' }] });
  return request('/ib/configSyncSymbols.do', {
    method: 'POST',
    body: {
      ...newParams,
    },
  });
}

// query ib start data
export async function queryIbStartData(payload) {
  return request(`/ib/startSync.do?type=${payload}`);
}

// query td stop data
export async function queryIbStopData(payload) {
  // return request('/api/queryFutuData');
  return request(`/ib/stopSync.do?type=${payload}`);
}
