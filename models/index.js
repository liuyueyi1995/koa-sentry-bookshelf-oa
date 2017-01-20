var ds = require('../datasource');

// Users表示可以登录到这个系统的用户
const Users = ds.bookshelf.Model.extend({
    tableName: 'users'
});

// UserApproles表示每个受管控系统的用户对应的角色，一个用户只能对应一个应用角色
const UserApproles = ds.bookshelf.Model.extend({
    tableName: 'user_approle'
});
// WebUsers表示被管控的应用的用户信息
const WebUsers = ds.bookshelf.Model.extend({
    tableName: 'webusers'
});

// AppRoles表示被管控的应用所设计的角色
const AppRoles = ds.bookshelf.Model.extend({
    tableName: 'approles'
});

// DbRoles表示被管控的应用所设计的角色
const DbRoles = ds.bookshelf.Model.extend({
    tableName: 'dbroles'
});

// WafLogs表示waf系统产生的日志
const WafLogs = ds.bookshelf.Model.extend({
    tableName: 'waf_logs'
});

// SqlrelayLogs表示sqlrelay系统产生的日志
const SqlrelayLogs = ds.bookshelf.Model.extend({
    tableName: 'sqlrelay_logs'
});
module.exports = {
    Users: Users,
    UserApproles: UserApproles,
    WebUsers: WebUsers,
    AppRoles: AppRoles,
    DbRoles: DbRoles, 
    WafLogs: WafLogs,
    SqlrelayLogs: SqlrelayLogs
}