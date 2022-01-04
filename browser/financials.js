const axios = require('axios');
const { currencyFormat, rangeFormat, numberFormat } = require('./formatters');

const preMarketMock = async () => {
  const data =  require('../mocks/preMarket.json') ;
  return Promise.resolve(data.quoteResponse.result[0])
}

const getFinancialData = async () => {
  const { data } = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=TSLA');

  return data.quoteResponse.result[0];
}

const renderFinancials = async () => {
  const f = await getFinancialData();

  if (f.preMarketPrice) {
    document.getElementById('pm').style.display = 'block';
    document.getElementById('pm-price').innerText = currencyFormat(f.preMarketPrice)
    document.getElementById('pm-change').innerText = numberFormat(f.preMarketChange)
    document.getElementById('pm-change-percent').innerText = `(${numberFormat(Number(f.preMarketChangePercent.toFixed(2)))}%)`

    if(f.preMarketChange < 0) {
      document.getElementById('pm-change').classList.add('negative')
      document.getElementById('pm-change-percent').classList.add('negative')
    } else {
      document.getElementById('pm-change').classList.add('positive')
      document.getElementById('pm-change-percent').classList.add('positive')
    }
  }

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