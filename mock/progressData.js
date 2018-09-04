const progressData = {
  "success": true,  // 当前接口是否成功
  "data": {
    "lastSyncStocks": [  // 最新同步的25条股票数据
      {
        "symbol": "HUYA1",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA2",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA3",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA4",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA5",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA6",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA7",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA8",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA9",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA10",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA11",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA12",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA13",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA14",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA15",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA16",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA17",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA18",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA19",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA20",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA21",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA22",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA23",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA24",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
      {
        "symbol": "HUYA25",
        "frequency": "1M",
        "syncDateTime": "2018-08-14 11:10:00", // 我们所有的时间都是New York Region时间
      },
    ], // 最新的同步的股票数据
    "currentProgress": "0.223",  // 表示当前同步的进度比例为22.3%
    "isSyncing": true,  // 表示当前股票是否在同步，如果出现异常则为false，并且进程就会关闭
    "eta": "3600",  // 表示当前股票还需3600s=1h的时间才能同步完毕.
    "syncedSymbol": 200, // 表示有200支股票已经是最新状态.
  },
};

export default {
  progressData,
};
