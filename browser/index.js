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
  const appContentElement = document.getElementById('app-content');

  const newsRect = document
    .getElementById('news')
    .getBoundingClientRect();

  appContentElement.scrollTo({left: newsRect.left, behavior: 'smooth' });
}

document.getElementById('stock-tab').onclick = () => {
  const appContentElement = document.getElementById('app-content');

  const stockRect = document
    .getElementById('stock')
    .getBoundingClientRect();

  appContentElement.scrollTo({left: stockRect.left, behavior: 'smooth' });
}

let observerOptions = {
  root: document.getElementById('app-content'),
  rootMargin: '0px',
  threshold: 1.0
}

const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    const id = entry.target.id;

    const tab = document.getElementById(`${id}-tab`);
    if (entry.isIntersecting) {
      tab.classList.add('tab-active')
    } else {
      tab.classList.remove('tab-active')
    }

  });
}

let observer = new IntersectionObserver(observerCallback, observerOptions);

observer.observe(document.getElementById('news'))
observer.observe(document.getElementById('stock'))

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