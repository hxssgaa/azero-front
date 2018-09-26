import request from '../utils/request';

// query td sync data
export async function queryIbSyncData() {
  // return request('/td/getSyncProgress');
  return request('/api/queryFutuData');
  return request('/td/syncStatus.do');
}

// query td sync progress data
export async function queryIbSyncProgressData() {
  // return request('/td/getSyncProgress');
  return request('/api/queryFutuData');
  return request('/td/getSyncProgress.do');
}

// query td symbols info data
export async function queryIbSymbolsInfoData(params) {
  // return request('/td/getSyncProgress');
  return request('/api/queryFutuData');
  const { code, isFuzzy } = params;
  return request(`/td/getSymbolsInfo.do?isFuzzy=${isFuzzy}&code=${code}`);
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

// query td start data
export async function queryIbStartData() {
  return request('/api/queryFutuData');
  return request('/td/startSync.do');
}

// query td stop data
export async function queryIbStopData() {
  return request('/api/queryFutuData');
  return request('/td/stopSync.do');
}
