const axios = require('axios');
const { currencyFormat, rangeFormat, numberFormat } = require('./formatters');

const getFinancialData = async () => {
  const { data } = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=TSLA');

  return data.quoteResponse.result[0];
}

const renderFinancials = async () => {
  const f = await getFinancialData();

  const map = [
    { id: 'pc-value', key: 'regularMarketPreviousClose', fmt: currencyFormat },
    { id: 'open-value', key: 'regularMarketOpen', fmt: currencyFormat },
    { id: 'day-range-value', key: 'regularMarketDayRange', fmt: rangeFormat },
    { id: 'year-range-value', key: 'fiftyTwoWeekRange', fmt: rangeFormat },
    { id: 'volume-value', key: 'regularMarketVolume', fmt: numberFormat },
    { id: 'avg-volume-value', key: 'averageDailyVolume3Month', fmt: numberFormat },
    { id: 'market-cap-value', key: 'marketCap', fmt: currencyFormat },
  ];

  map.forEach(({ id, key, fmt }) => {
    const element = document.getElementById(id);
    element.innerText = fmt(f[key])
  })
}

module.exports = { renderFinancials }