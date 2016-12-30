'use strict';

var Promise = require('bluebird');
const config = require('./config');

var knex = require('knex')({
    client: 'pg',
    connection: {
        host: config.host,
        user: config.username,
        password : config.password,
        database : config.database
    }
});

var bookshelf = require('bookshelf')(knex);

var save = bookshelf.Model.prototype.save;
bookshelf.Model.prototype.save = function () {
    if(arguments[1] && arguments[1].transacting){
        return save.apply(this, arguments).then(function (model) {
            return model;
        })
    }
    else{
        return save.apply(this, arguments).then(function (model) {
            var id = model.id; //bad
            return model ? model.clear().set('id', id).fetch() : model;
        })
    }
};

bookshelf.Model.prototype.findOrCreate = function (options) {
    var cloned = this.clone();

    return this
        .fetch({
            require: true
        })
        .then(null, function (err) {
            if (err.message === 'EmptyResponse') {
                if (options != null) {
                    return cloned.save(null, options).then(()=> {
                        cloned.justCreated = true
                        return cloned;
                    });
                } else {
                    return cloned.save().then(()=> {
                        cloned.justCreated = true
                        return cloned;
                    });
                }
            }
            throw err;
        });
};

module.exports = {
    knex: knex,
    bookshelf: bookshelf
};
