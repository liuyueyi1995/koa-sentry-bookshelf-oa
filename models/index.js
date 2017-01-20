var ds = require('../datasource');

// Users表示可以登录到这个系统的用户
const Users = ds.bookshelf.Model.extend({
    tableName: 'users'
});

// WebUsers表示被管控的应用的用户信息及其角色
const WebUsers = ds.bookshelf.Model.extend({
    tableName: 'webusers',
    approle: function() {
        return this.belongsTo(AppRoles)
    },
    dbrole: function() {
        return this.belongsTo(DbRoles)
    }
});

// AppRoles表示被管控的应用所设计的角色
const AppRoles = ds.bookshelf.Model.extend({
    tableName: 'approles',
    webuser: function() {
        return this.hasOne(WebUsers);
    }
});

// DbRoles表示被管控的应用所设计的角色
const DbRoles = ds.bookshelf.Model.extend({
    tableName: 'dbroles',
    webuser: function() {
        return this.hasOne(WebUsers)
    }
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
    WebUsers: WebUsers,
    AppRoles: AppRoles,
    DbRoles: DbRoles, 
    WafLogs: WafLogs,
    SqlrelayLogs: SqlrelayLogs
}