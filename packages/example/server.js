const Koa = require('koa')
const Router = require('koa-router')
const send = require('koa-send')

const render = require('./build/server/main').default
const manifest = require('./build/client/manifest.json')

const renderPage = () =>
	`<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<div id="root">${render()}</div>
		<script src="/static/${manifest['main.js']}"></script>
	</body>
	</html>`

const app = new Koa()

const router = new Router()
	.get('/', ctx => {
		ctx.body = renderPage()
	})
	.get('/static/:path', ctx =>
		send(ctx, ctx.params.path, { root: './build/client' })
	)

app
	.use(router.routes())
	.listen('8080', () => console.log('Server is listening on port 8080'))
