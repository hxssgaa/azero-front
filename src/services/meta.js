import request from '../utils/request';

// query td sync data
export async function queryMetaSyncData() {
  // return request('/td/getSyncProgress');
  return request('/api/queryFutuData');
  return request('/td/syncStatus.do');
}

// query td sync progress data
export async function queryMetaSyncProgressData() {
  // return request('/td/getSyncProgress');
  return request('/api/queryFutuData');
  return request('/td/getSyncProgress.do');
}

// query td symbols info data
export async function queryMetaSymbolsInfoData(params) {
  // return request('/td/getSyncProgress');
  return request('/api/queryFutuData');
  const { code, isFuzzy } = params;
  return request(`/td/getSymbolsInfo.do?isFuzzy=${isFuzzy}&code=${code}`);
}

export async function queryMetaConfigSyncSymbols() {
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
export async function queryMetaStartData() {
  return request('/api/queryFutuData');
  return request('/td/startSync.do');
}

// query td stop data
export async function queryMetaStopData() {
  return request('/api/queryFutuData');
  return request('/td/stopSync.do');
}
