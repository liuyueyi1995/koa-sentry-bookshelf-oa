var router = require('koa-router')();
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
router.get('/login', async function (ctx) {
  ctx.state = {
    title: 'OA-登录'
  };

  await ctx.render('login', {
  });
  await next();
});

module.exports = router;
