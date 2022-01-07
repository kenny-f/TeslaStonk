const axios = require('axios');
const dayjs = require('dayjs');
const { shell } = require('electron');

const getNews = async () => {
  return axios
    .get('https://www.teslarati.com/feed/')
    .then(response => response.data)
    .then(data => new DOMParser().parseFromString(data, "text/xml"))
    .then(doc => {
      const items = doc.querySelectorAll('item');

      const container = document.createElement('div');

      Array.from(items).map(item => {
        const title = item.querySelector('title').textContent;
        const link = item.querySelector('link').textContent;
        const description = item.querySelector('description').textContent;
        const pubDate = item.querySelector('pubDate').textContent; //Wed, 05 Jan 2022 10:20:06 +0000

        const temp = document.createElement('div')
        temp.innerHTML = description;

        const html = `
          <article>
            <h2 class="article-title">${title}</h2>
            <span class="article-pubdate">${dayjs(pubDate).format('MMM D, YYYY')}</span>
            <p class="artile-description">${temp.querySelectorAll('p')[0].textContent}</p>
          </article>
        `;

        const dom = new DOMParser().parseFromString(html, 'text/html');

        dom.querySelector('article').onclick = () => shell.openExternal(link);

        container.append(dom.querySelector('article'));
      })

      document.getElementById('articles').replaceChildren(container);
    })
}

module.exports = {
  getNews,
}