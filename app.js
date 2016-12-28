const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const Raven = require('raven');
Raven.config('http://be75c559773e4e9f83faca1a4aebe7ea:1a5349ab38004ded9a737ce58ef8d2a3@192.168.100.119:9000/6').install();

const index = require('./routes/index');
const users = require('./routes/users');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(convert(require('koa-static')(__dirname + '/public')));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

// app.use(views(__dirname + '/views-ejs', {
//   extension: 'ejs'
// }));


// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err){
  //console.log(err)
  //log.error('server error', err, ctx);
  Raven.captureException(err);
  //Raven.showReportDialog();
});


module.exports = app;