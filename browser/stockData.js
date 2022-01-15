const axios = require('axios');

axios.defaults.headers = {
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Expires': '0',
};

const preMarketMock = async () => {
  const data =  require('../mocks/preMarket.json') ;
  return Promise.resolve(data.quoteResponse.result[0])
}

const getFinancialData = async (symbol, fields) => {
  const { data } = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}${fields ? `&fields=${fields}` : ''}`);

  return data.quoteResponse.result[0];
}

const getChartData = async (symbol) => {
  const { data } = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
  const { meta, timestamp, indicators } = data.chart.result[0];

  return { meta, timestamp, indicators };
}

const getStockData = async (symbol = 'TSLA') => {
  const financials = await getFinancialData(symbol);
  // const financials = await preMarketMock(symbol);
  const chart = await getChartData(symbol);

  return {
    financials,
    chart,
  };
}

module.exports = {
  getFinancialData,
  getStockData,
};
