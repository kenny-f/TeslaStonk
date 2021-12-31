const axios = require('axios');
const ApexCharts = require('apexcharts');

const dayjs = require('dayjs');
const utcPlugin = require('dayjs/plugin/utc');
const timezonePlugin = require('dayjs/plugin/timezone');

dayjs.extend(utcPlugin)
dayjs.extend(timezonePlugin)

const getChartData = async () => {
  const { data } = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/TSLA');

  return data;
}

const renderChart = async () => {
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
};

module.exports = { renderChart }