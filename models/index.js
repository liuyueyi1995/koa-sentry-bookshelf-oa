var ds = require('../datasource');

const Users = ds.bookshelf.Model.extend({
    tableName: 'users'
});
const WafLogs = ds.bookshelf.Model.extend({
    tableName: 'waf_logs'
});
module.exports = {
    Users: Users,
    WafLogs: WafLogs
}