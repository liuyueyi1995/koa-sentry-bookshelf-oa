const Koa = require('koa');
const router = require('./routes/index');
const koaBody = require('koa-body');
const views = require('koa-views');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const session = require('koa-session-store');
const mongoStore = require('koa-session-mongo');
const co = require('co');
const Promise = require('bluebird');
const Raven = require('raven');

const app = new Koa();
Raven.config('http://be75c559773e4e9f83faca1a4aebe7ea:1a5349ab38004ded9a737ce58ef8d2a3@192.168.100.119:9000/6').install();

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(convert(require('koa-static')(__dirname + '/public')));
app.keys = ['liuyueyi'];
app.use(convert(session({
  store: mongoStore.create({
    db: 'oa-session'
  })
})));

// views
app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(router.routes());

// error
app.on('error', function(err){
  //console.log(err)
  //log.error('server error', err, ctx);
  
  Raven.captureException(err);
});


module.exports = app;