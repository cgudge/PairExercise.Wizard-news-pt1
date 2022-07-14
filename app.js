const express = require('express');
const morgan = require('morgan');
const postBank = require('./postBank');

const app = express();

app.use(express.static('public'));

app.use(morgan('dev'));

app.get('/', (req, res) => {
	const posts = postBank.list();

	const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel = "stylesheet" href = "/style.css"></link>
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts
			.map(
				(post) => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span> <a href = '/posts/${post.id}'>${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
			)
			.join('')}
    </div>
  </body>
  </html>
  
  
  `;
	res.send(html);
});

app.get('/posts/:id', (req, res) => {
	const id = req.params.id;
	const post = postBank.find(id);

	if (!post.id) {
		res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel = "stylesheet" href = "/style.css"></link>
  </head>
  <body>
    <header><img src="/logo.png"/>Wizard News </header>
    <div class="not-found">
        <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
        <img src="/dumbledore-404.gif" />
        <a href = "/"><h2>Home?</h2></a>
      </div>
  </body>`);
	} else {
		res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel = "stylesheet" href = "/style.css"></link>
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      <div class='news-item'>
          <p>
            ${post.title}
            <div>
             <p>${post.content}</p>
            </div>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            <a href = '/'>Home</a> ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>
      </div>
  </body>`);
	}
});

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
	console.log(`App listening in port ${PORT}`);
});
