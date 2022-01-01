const axios = require('axios');
const { numberFormat } = require('./formatters');

const exchanges = [
  { symbol: '%5EGSPC', name: 'S&P 500' },
  { symbol: '%5EDJI', name: 'Dow Jones 30' },
  { symbol: '%5EIXIC', name: 'Nasdaq' },
  { symbol: '%5EFTSE', name: 'FTSE 100' },
]

const getData = async () => {
  return Promise.all(exchanges.map(({ symbol, name }) => axios
    .get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,currency`)
    .then(({ data }) => ({
      name,
      ...data.quoteResponse.result[0]
    }))))
}

const renderExchangeData = async () => {
  const data = await getData();

  const exhangesDiv = document.getElementById('exchanges')
  
  while (exhangesDiv.firstChild) {
    exhangesDiv.removeChild(exhangesDiv.firstChild);
  }

  data.forEach(d => {
    const containerDiv = document.createElement('div')
    containerDiv.classList.add('ex-container')

    const nameDiv = document.createElement('div')
    nameDiv.classList.add('ex-name')
    nameDiv.innerText = d.name

    const priceDiv = document.createElement('div')
    priceDiv.classList.add('ex-price')
    priceDiv.innerText = numberFormat(Number(d.regularMarketPrice.toFixed(2)))

    const changeDiv = document.createElement('div')
    changeDiv.classList.add('ex-change')
    changeDiv.innerText = `${d.regularMarketChange.toFixed(2)} (${d.regularMarketChangePercent.toFixed(2)}%)`
    if (d.regularMarketChangePercent < 0) {
      changeDiv.classList.add('negative')
    }

    containerDiv.appendChild(nameDiv)
    containerDiv.appendChild(priceDiv)
    containerDiv.appendChild(changeDiv)

    exhangesDiv.appendChild(containerDiv)
  })
}

module.exports = { renderExchangeData }