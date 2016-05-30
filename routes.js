'use strict';

const isAuthenticated = require('express-module-membership/passport/authorization-middleware').isAuthenticated;

const mw = require('./middleware');

module.exports = [
  [ '/api/testimonials/', 'get', [ mw.formatQuery, mw.paginate, mw.find ]],
  [ '/api/testimonials/', 'post', [ isAuthenticated, mw.create ]],
  [ '/api/testimonials/:id', 'get', mw.findById ],
  [ '/api/testimonials/:id', 'put', [ isAuthenticated, mw.put ]],
  [ '/api/testimonials/:id', 'patch', [ isAuthenticated, mw.patch ]],
  [ '/api/testimonials/:id', 'delete', [ isAuthenticated, mw.remove ]]
];
