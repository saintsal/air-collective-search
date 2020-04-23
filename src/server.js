import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const { SSL_PORT=3001 } = process.env;

const dev = NODE_ENV === 'development';
const { createServer } = require('https');

const { readFileSync } = require('fs');

const options = {
	key: readFileSync('ssl/foobar.key'),
	cert: readFileSync('ssl/foobar.crt')
};


const { handler } =  polka(options) // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});

// Mount Polka to HTTPS server
createServer(options, handler).listen(SSL_PORT, _ => {
	console.log(`> Running on https://localhost:${SSL_PORT}`);
});
