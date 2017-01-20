# koa2-sentry-bookshelf-oa  
## 简介
这是一个基于koa2的OA系统，作为我自学nodejs的练习以及成果展示

使用 PostgreSql 存储业务数据   
使用 mongodb 存储session  
使用 bookshelf + knex 作为ORM和Query Builder  
使用 Sentry 作为错误信息的收集反馈平台   
   

目录结构和babel的配置参考了 https://github.com/17koa/koa-demo   
原链接似乎已经被删掉了，这个是我fork过来的版本 https://github.com/liuyueyi1995/koa2-demo    
网站的前端代码来源于我之前的一个项目  https://github.com/liuyueyi1995/oa 

---
## 完成度  
采用MVC的结构，将model和route从`app.js`中分离出来  
基本的页面跳转逻辑已经实现  
登录注册以及session存储已经完成，不过还缺少如忘记密码等更进一步的功能  
数据库查询已经完成，目前已经完成`/waf_log页`和`/sqlrelay_log页`  
实现了多表查询`user_app`和`user_db`的查询  
通过AJAX实现搜索功能，并动态修改网页内容     
通过`where 'xxx' like 'yyy'`类型的语句实现了针对日志数据的全字段的模糊搜索      

--- 
## TODOs  
利用AJAX实现点击每一行之后的修改时，将表格的行改成表单的形式，修改好之后，实时保存。  
利用AJAX实现对表格内容的搜索，这一部分因为涉及多表查询，所以和`/waf_log页`的搜索逻辑不太一样。  

---
## Sentry客户端
### 安装并运行

- git clone xxxx
- cd xxx
- npm install
- npm build
- npm start

通过本机的4000端口即可访问

---
## Sentry管理端  
通过访问 http://192.168.100.119:9000 进入管理端，使用超级用户的身份登录。


---
## Sentry的安装  
可以参考我写的博客 http://blog.csdn.net/liuyueyi1995/article/details/53888312
