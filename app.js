const rp = require('request-promise')
const fs = require('fs')
const config = require('./config.js')

let list = []
rp.get({
  uri: `https://api.github.com/repos/${config.user}/${config.repo}/issues?client_id=${config.client_id}&client_secret=${config.client_secret}`,
  headers: {
    'User-Agent': 'Request-Promise',
    'Accept': 'application/vnd.github.VERSION.html+json'
  },
  json: true
}).then(articles => {
  for (let article of articles) {
    list.push({
      title: article.title,
      id: article.id,
      date: article.created_at
    })
    fs.writeFile(`./articles/${article.id}.html`, article.body_html, () => console.log(article.id))
  }
  fs.writeFile('./articles/list.json', JSON.stringify(list), () => console.log('list.json'))
})
