const axios = require('axios');

const getFinancialData = async () => {
  const { data } = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=TSLA');

  return data.quoteResponse.result[0];
}

const renderFinancials = async () => {
  const f = await getFinancialData();

  const numberFormat = Intl.NumberFormat('en-US').format;
  const currencyFormat = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;
  const rangeFormat = (str) => str.split('-').filter(Boolean).map(n => currencyFormat(Number(n))).join('-');

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