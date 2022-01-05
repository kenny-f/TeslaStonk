const axios = require('axios');
const ApexCharts = require('apexcharts');

const dayjs = require('dayjs');
const utcPlugin = require('dayjs/plugin/utc');
const timezonePlugin = require('dayjs/plugin/timezone');

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

const getChartData = async () => {
  const { data } = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/TSLA');

  return data;
}

const formatLocalTime = (timestamp, timezone) => dayjs.tz(timestamp * 1000, timezone).tz('GMT').format('HH:mm');

const renderChart = async () => {
  const data = await getChartData();
  const { meta, timestamp, indicators } = data.chart.result[0];
  const { currentTradingPeriod, timezone, previousClose, regularMarketPrice } = meta;

  const isGreen = regularMarketPrice > previousClose;

  const { open } = indicators.quote[0];
  var options = {
    chart: {
      type: 'line',
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      offsetX: -6
    },
    stroke: {
      width: 1,
      curve: 'straight',
    },
    colors: [isGreen ? '#00873c' : '#eb0f29'],
    series: [{
      name: '',
      data: open.filter(o => o !== null),
    }],
    xaxis: {
      type: 'datetime',
      categories: timestamp.filter(t => t !== null),
      labels: {
        formatter: (value) => dayjs.tz(value * 1000, timezone).format('HH:mm'),
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(2),
      },
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
        },
      }],
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value) => `$${value.toFixed(2)}`,
        title: { formatter: () => '' },
      },
      marker: { show: false },
    },
  }

  const chart = new ApexCharts(document.querySelector("#chart"), options);

  chart.render();

  const mt = document.getElementById('market-time');
  const { regular: { start, end } } = currentTradingPeriod;
  mt.innerText = `Market Hours: ${formatLocalTime(start, timezone)} - ${formatLocalTime(end, timezone)}`;

  return chart;
};

module.exports = { renderChart };
