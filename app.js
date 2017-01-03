const Koa = require('koa');
const router = require('koa-router')();
const views = require('koa-views');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const co = require('co');
const crypto = require('crypto');
const Promise = require('bluebird');
const Raven = require('raven');
const config = require('./config');

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: config.host,
        user: config.username,
        password : config.password,
        database : config.database,
        port: config.port
    }
});
const bookshelf = require('bookshelf')(knex);

const Users = bookshelf.Model.extend({
    tableName: 'users'
});


//const index = require('./routes/index');
//const users = require('./routes/users');
//const login = require('./routes/login');
//const reg = require('./routes/reg');

const app = new Koa();
Raven.config('http://be75c559773e4e9f83faca1a4aebe7ea:1a5349ab38004ded9a737ce58ef8d2a3@192.168.100.119:9000/6').install();
/*
knex.schema.createTableIfNotExists('Users', function(table) {
  table.increments();
  table.string('username');
  table.string('password');
  table.timestamps();
});
*/


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

//router.use('/', index.routes(), index.allowedMethods());
//router.use('/users', users.routes(), users.allowedMethods());
//router.use('/login', login.routes(), login.allowedMethods());
//router.use('/reg', reg.routes(), reg.allowedMethods());

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'OA'
  };

  await ctx.render('index', {
  });
  await next();
});
router.get('/reg', async function (ctx, next) {
  ctx.state = {
    title: 'OA-注册'
  };
  
  await ctx.render('reg', {
  });
  await next();
});
router.get('/login', async function (ctx, next) {
  ctx.state = {
    title: 'OA-登录'
  };

  await ctx.render('login', {
  });
  await next();
});
router.get('/user_app', async function (ctx, next) {
  ctx.state = {
    title: 'OA-应用角色管理'
  };

  await ctx.render('user_app', {
  });
  await next();
});
router.get('/user_db', async function (ctx, next) {
  ctx.state = {
    title: 'OA-数据库角色管理'
  };

  await ctx.render('user_db', {
  });
  await next();
});

router.post('/reg', async function (ctx, next) {
  //判断两次密码是否一致
  if(ctx.request.body['password2'] !== ctx.request.body['password']) {
    console.log('两次密码不一致');
    return ctx.response.redirect('/reg');
  } else {
    //判断用户名是否存在
    var count = await Users.where('username', ctx.request.body['username']).count('username');
    if(count != 0) {
      console.log('用户名已存在！');
      return ctx.response.redirect('/reg');
    } else {
      var hmac = crypto.createHmac('sha256', 'liuyueyi');
      var password = hmac.update(ctx.request.body['password']).digest('hex');
      console.log(password);
      console.log(password.length);
      var newUser = new Users({
        username: ctx.request.body['username'],
        password: password
      })
      await newUser.save();
      console.log('注册成功，可以直接登录！');
      return ctx.response.redirect('/login');
    }
  }
  
  await next();
});

router.post('/login', async function (ctx, next) {
  //需要判断的逻辑：用户名不存在或者密码错误
  var count = await Users.where('username', ctx.request.body['username']).count('username');
  if(count == 0) {
    console.log('用户名不存在！');
    return ctx.response.redirect('/login');
  } else {
    var hmac = crypto.createHmac('sha256', 'liuyueyi');
    var password = hmac.update(ctx.request.body['password']).digest('hex');
    var user = await Users.where('username', ctx.request.body['username']).fetch();
    if (user.attributes.password == password) {
      console.log('登陆成功！');
      return ctx.response.redirect('/');
    } else {
      console.log('密码错误！');
      return ctx.response.redirect('/login');
    }
  }
  //await next();
});
app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err){
  //console.log(err)
  //log.error('server error', err, ctx);
  
  Raven.captureException(err);
});


module.exports = app;