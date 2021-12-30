const axios = require('axios');
const ApexCharts = require('apexcharts');
const {ipcRenderer} = require('electron');

const dayjs = require('dayjs');
const utcPlugin = require('dayjs/plugin/utc');
const timezonePlugin = require('dayjs/plugin/timezone');

dayjs.extend(utcPlugin)
dayjs.extend(timezonePlugin)

document.getElementById('resume').onclick = () => {
  ipcRenderer.send('resume-ws')
}

document.getElementById('pause').onclick = () => {
  ipcRenderer.send('pause-ws')
}

document.getElementById('reconnect').onclick = () => {
  ipcRenderer.send('reconnect-ws')
}

const getChartData = async () => {
  const { data } = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/TSLA');

  return data;
}

const getFinancialData = async () => {
  const { data } = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=TSLA');

  return data.quoteResponse.result[0];
}

(async () => {
  const data = await getChartData();
  const {meta, timestamp, indicators} = data.chart.result[0];
  const {timezone, previousClose, regularMarketPrice} = meta;

  const isGreen = regularMarketPrice > previousClose;

  const open = indicators.quote[0].open;
  var options = {
    chart: {
      type: 'line',
    },
    stroke: {
      width: 1,
      curve: 'straight',
    },
    colors: [isGreen? '#00873c': '#eb0f29'],
    series: [{
      data: open
    }],
    xaxis: {
      type: 'datetime',
      categories: timestamp,
      labels: {
        formatter: function(value) {
          const date = dayjs.tz(value * 1000, timezone).format('HH:mm')
          return date
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function(value) {
          return value.toFixed(2)
        }
      }
    },
    annotations: {
      yaxis: [{
        y: previousClose,
        borderColor: '#7D02EB',
        label: {
          borderColor: '#7D02EB',
          style: {
            color: '#fff',
            background: '#7D02EB',
          },
        }
      }],
    }
  }
  
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  
  chart.render();

  // render financials
  const f = await getFinancialData();
  
  const numberFormat = Intl.NumberFormat('en-US').format;
  const currencyFormat = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format;
  const rangeFormat = (str) => str.split('-').filter(Boolean).map(n => currencyFormat(Number(n))).join('-');
  
  const map = [
    { id: 'pc-value', key: 'regularMarketPreviousClose', fmt: currencyFormat },
    { id: 'open-value', key: 'regularMarketOpen', fmt: currencyFormat  },
    { id: 'day-range-value', key: 'regularMarketDayRange', fmt: rangeFormat },
    { id: 'year-range-value', key: 'fiftyTwoWeekRange', fmt: rangeFormat },
    { id: 'volume-value', key: 'regularMarketVolume', fmt: numberFormat },
    { id: 'avg-volume-value', key: 'averageDailyVolume3Month', fmt: numberFormat  },
    { id: 'market-cap-value', key: 'marketCap', fmt: currencyFormat },
  ];

  map.forEach(({id, key, fmt}) => {
    const element = document.getElementById(id);
    element.innerText = fmt(f[key])
  })
})()

