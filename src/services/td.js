import request from '../utils/request';

// query td sync data
export async function queryTdSyncData() {
  // return request('/td/getSyncProgress');
  // return request('/api/queryFutuData');
  return request('/td/syncStatus.do');
}

// query td sync progress data
export async function queryTdSyncProgressData() {
  // return request('/td/getSyncProgress');
  return request('/td/getSyncProgress.do');
}

// query td symbols info data
export async function queryTdSymbolsInfoData(params) {
  // return request('/td/getSyncProgress');
  const { code, isFuzzy } = params;
  return request(`/td/getSymbolsInfo.do?isFuzzy=${isFuzzy}&code=${code}`);
}

// query td start data
export async function queryTdStartData() {
  return request('/td/startSync.do');
}

// query td stop data
export async function queryTdStopData() {
  return request('/td/stopSync.do');
}
