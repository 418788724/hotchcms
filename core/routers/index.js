const _ = require('lodash');
const account = require('./account.router');
const install = require('./install.router');

const routes = [account, install];

module.exports = app => {
  _.forEach(routes, route => {
    app
      .use(route.routes())
      .use(route.allowedMethods({
        throw: true
      }));
  });
};

module.exports.routes = routes;