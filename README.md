#koa2-sentry-bookshelf-oa  
##简介
这是一个基于koa2的OA系统，作为我自学nodejs的练习以及成果展示

使用 PostgreSql 存储业务数据 
使用 bookshelf + knex 作为ORM和query builder  
使用 sentry 作为错误的收集反馈平台  
使用 mongodb 存储session  
目录结构和babel的配置参考了https://github.com/17koa/koa-demo  
网站的前端代码来源于我之前的一个项目  

---
##完成度  
基本的页面跳转逻辑已经实现  
登录注册以及session存储已经完成，不过还缺少如忘记密码等更进一步的功能  
简单数据库查询已经完成，目前已经完成/waf_log页的逻辑，/sqlrelay\_log页的逻辑是类似的  




---
##sentry客户端
###安装并运行

- git clone xxxx
- cd xxx
- npm install
- npm build
- npm start

通过本机的4000端口即可访问

---
##sentry管理端  
通过访问http://192.168.100.119:9000进入管理端，使用超级用户的身份登录。


---
##sentry的安装  
可以参考我写的博客http://blog.csdn.net/liuyueyi1995/article/details/53888312
