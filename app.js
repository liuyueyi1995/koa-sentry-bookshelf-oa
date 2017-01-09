const Koa = require('koa');
const router = require('koa-router')();
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
const crypto = require('crypto');
const Promise = require('bluebird');
const Raven = require('raven');
const config = require('./config');
//const settings = require('./settings')
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
const WafLogs = bookshelf.Model.extend({
    tableName: 'waf_logs'
});

//const index = require('./routes/index');
//const users = require('./routes/users');
//const login = require('./routes/login');
//const reg = require('./routes/reg');

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

//router.use('/', index.routes(), index.allowedMethods());
//router.use('/users', users.routes(), users.allowedMethods());
//router.use('/login', login.routes(), login.allowedMethods());
//router.use('/reg', reg.routes(), reg.allowedMethods());

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'OA',
    user: ctx.session.user
  };

  await ctx.render('index', {
  });
  //await next();
});
router.get('/reg', async function (ctx, next) {
  ctx.state = {
    title: 'OA-注册'
  };
  
  await ctx.render('reg', {
  });
  //await next();
});
router.get('/login', async function (ctx, next) {
  ctx.state = {
    title: 'OA-登录'
  };

  await ctx.render('login', {
  });
  //await next();
});
router.get('/logout', async function (ctx, next) {
  ctx.session.user = null;
  return ctx.redirect('/');
  //await next();
});
router.get('/user_app', async function (ctx, next) {
  ctx.state = {
    title: 'OA-应用角色管理'
  };

  await ctx.render('user_app', {
  });
  //await next();
});
router.get('/user_db', async function (ctx, next) {
  ctx.state = {
    title: 'OA-数据库角色管理'
  };

  await ctx.render('user_db', {
  });
  //await next();
});
router.get('/waf_log', async function (ctx, next) {
  var wafLogs = await WafLogs.fetchAll();//从数据库中查询所有的日志信息
  var logs = {};
  for(var i = 0;i < wafLogs.length;i++){
    logs[i] = wafLogs.models[i].attributes;
  }
  //console.log(logs);
  
  await ctx.render('waf_log', {
    title: 'OA-waf日志',
    logs: logs
  });
  
  //await next();
});
//采用AJAX处理对waf_log表的查询
router.post('/waf_log',async function(ctx,next) {
  console.log(ctx.request.body);
  var content = ctx.request.body.content;
  console.log(content);
  var result = await WafLogs.where('id','=',content).fetchAll();       
  var logs = {};
  for(var len = 0;len < result.length;len++){
    logs[len] = result.models[len].attributes;
  }
  ctx.body = {logs,len};
});
router.get('/sqlrelay_log', async function (ctx, next) {
  ctx.state = {
    title: 'OA-sqlrelay日志'
  };

  await ctx.render('sqlrelay_log', {
  });
  //await next();
});
router.post('/reg', async function (ctx, next) {
  if(ctx.request.body['username'].length > 25) {
    //判断用户名是否过长，数据库设置username字段为varchar(25)
    await ctx.render('reg', {
      title: 'OA-注册',
      error: '用户名不得超过25个字符'
    });
  } else if(ctx.request.body['password2'] !== ctx.request.body['password']) {
    //判断两次密码是否一致
    console.log('两次密码不一致');
    //return ctx.response.redirect('/reg');
    await ctx.render('reg', {
      title: 'OA-注册',
      error: '两次密码不一致'
    });
  } else {
    //判断用户名是否存在
    var count = await Users.where('username', ctx.request.body['username']).count('username');
    if(count != 0) {
      console.log('用户名已存在！');
      //return ctx.response.redirect('/reg');
      await ctx.render('reg', {
        title: 'OA-注册',
        error: '用户名已存在'
      });
    } else {
      var hmac = crypto.createHmac('sha256', 'liuyueyi');
      var password = hmac.update(ctx.request.body['password']).digest('hex');
      console.log(password);
      console.log(password.length);
      var newUser = new Users({
        username: ctx.request.body['username'],
        password: password
      });
      await newUser.save();
      console.log('注册成功，可以直接登录！');
      ctx.session.user = newUser;
      await ctx.render('reg', {
        title: 'OA-注册',
        success: '注册成功，可以直接登录'
      });
      return ctx.redirect('/login');
    }
  }
  
  //await next();
});

router.post('/login', async function (ctx, next) {
  //需要判断的逻辑：用户名不存在或者密码错误
  var count = await Users.where('username', ctx.request.body['username']).count('username');
  if(count == 0) {
    console.log('用户名不存在！');
    //return ctx.response.redirect('/login');
    await ctx.render('login', {
      title: 'OA-登录',
      error: '用户名不存在'
    });
  } else {
    var hmac = crypto.createHmac('sha256', 'liuyueyi');
    var password = hmac.update(ctx.request.body['password']).digest('hex');
    var user = await Users.where('username', ctx.request.body['username']).fetch();
    if (user.attributes.password == password) {
      console.log('登陆成功！'+ user.attributes.username);
      ctx.session.user = user.attributes.username;
      //console.log(currentUser);
      return ctx.response.redirect('/');
    } else {
      console.log('密码错误！');
      //return ctx.response.redirect('/login');
      await ctx.render('login', {
        title: 'OA-登录',
        error: '密码错误'
      });
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