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
    }
  }
  
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  
  chart.render();
})()

