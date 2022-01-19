const { getFinancialData } = require('./stockData');
const { currencyFormat, rangeFormat, numberFormat } = require('./formatters');

const renderFinancials = async () => {
  const financials = await getFinancialData('TSLA');
  const { preMarketPrice, preMarketChange, preMarketChangePercent } = financials;

  if (preMarketPrice) {
    document.getElementById('pm').style.display = 'block';
    document.getElementById('pm-price').innerText = currencyFormat(preMarketPrice)
    document.getElementById('pm-change').innerText = numberFormat(preMarketChange)
    document.getElementById('pm-change-percent').innerText = `(${numberFormat(Number(preMarketChangePercent.toFixed(2)))}%)`

    if(preMarketChange < 0) {
      document.getElementById('pm-change').classList.add('negative')
      document.getElementById('pm-change-percent').classList.add('negative')
    } else {
      document.getElementById('pm-change').classList.add('positive')
      document.getElementById('pm-change-percent').classList.add('positive')
    }
  } else {
    const pmDiv = document.getElementById('pm');
    while (pmDiv.firstChild) {
      pmDiv.removeChild(pmDiv.firstChild);
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
    element.innerText = fmt(financials[key])
  })
}

module.exports = { renderFinancials }
