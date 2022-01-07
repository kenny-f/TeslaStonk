const { renderChart } = require('./browser/chart');
const { renderFinancials } = require('./browser/financials');
const { renderExchangeData } = require('./browser/exchanges');
const { getNews } = require('./browser/teslaratiFeed');
const { ipcRenderer } = require('electron');

const dayjs = require('dayjs');
const utcPlugin = require('dayjs/plugin/utc');
const timezonePlugin = require('dayjs/plugin/timezone');

dayjs.extend(utcPlugin)
dayjs.extend(timezonePlugin)

let chartInstance;

document.getElementById('news-tab').onclick = () => {
  document.getElementById('stock').style.display = 'none';
  document.getElementById('articles').style.display = 'block';
}

document.getElementById('stock-tab').onclick = () => {
  document.getElementById('articles').style.display = 'none';
  document.getElementById('stock').style.display = 'block';
}

document.getElementById('resume').onclick = () => {
  ipcRenderer.send('resume-ws')
}

document.getElementById('pause').onclick = () => {
  ipcRenderer.send('pause-ws')
}

document.getElementById('reconnect').onclick = () => {
  ipcRenderer.send('reconnect-ws')
}

ipcRenderer.on('render-data', async () => {
  await renderExchangeData();
  chartInstance = await renderChart();
  await renderFinancials();
  await getNews();
})

ipcRenderer.on('window-hide', () => {
  chartInstance.destroy();
})