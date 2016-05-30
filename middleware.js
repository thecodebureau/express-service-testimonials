'use strict';

const mw = {
  formatQuery: require('warepot/format-query'),
  paginate: require('warepot/paginate')
};

const Testimonial = require('./model');

const mongoose = require('mongoose');

function create(req, res, next) {
  Testimonial.create(req.body, function (err, testimonial) {
    if (err) return next(err);

    res.status(201).json(testimonial);
  });
}

function find(req, res, next) {
  //const page = Math.max(0, req.query.page) || 0;
  //const perPage = Math.max(0, req.query.limit) || res.locals.perPage;

  const query = Testimonial.find(_.omit(req.query, 'limit', 'sort', 'page'),
    null,
    { sort: req.query.sort || 'order', lean: true });

  query.exec(function (err, testimonials) {
    res.locals.testimonials = testimonials;
    next(err);
  });
}

function findById(req, res, next) {
  if (req.params.id === 'new') return next();

  const query = {};

  query[mongoose.Types.ObjectId.isValid(req.params.id) ? '_id' : '_hid'] = req.params.id;

  return Testimonial.findOne(query, function (err, testimonial) {
    if (err) return next(err);
    res.locals.testimonial = testimonial;
    next();
  });
}

function getAll(req, res, next) {
  Testimonial.find().exec(function (err, testimonials) {
    if (err) return next(err);

    res.locals.testimonials = testimonials;
    next();
  });
}

function getLatest(limit) {
  return function (req, res, next) {
    Testimonial.find({}).sort({ date: -1 }).limit(limit).exec(function (err, testimonials) {
      res.locals.testimonials = testimonials;
      next(err);
    });
  };
}


function getPublished(req, res, next) {
  Testimonial.find({ datePublished: { $ne: null } }).sort('order').exec(function (err, testimonials) {
    if (err) return next(err);

    res.locals.testimonials = testimonials;
    next();
  });
}

function patch(req, res, next) {
  const query = {};

  query[mongoose.Types.ObjectId.isValid(req.params.id) ? '_id' : '_hid'] = req.params.id;

  Testimonial.findOne(query, function (err, testimonial) {
    delete req.body._id;
    delete req.body.__v;

    _.extend(testimonial, req.body);

    return testimonial.save(function (err) {
      if (err) return next(err);

      return res.status(200).json(testimonial);
    });
  });
}

function put(req, res, next) {
  const query = {};

  query[mongoose.Types.ObjectId.isValid(req.params.id) ? '_id' : '_hid'] = req.params.id;

  Testimonial.findOne(query, function (err, testimonial) {
    _.difference(_.keys(testimonial.toObject()), _.keys(req.body)).forEach(function (key) {
      testimonial[key] = undefined;
    });

    _.extend(testimonial, _.omit(req.body, '_id', '__v'));

    return testimonial.save(function (err) {
      if (err) return next(err);

      return res.status(200).json(testimonial);
    });
  });
}

function remove(req, res, next) {
  return Testimonial.findById(req.params.id, function (err, testimonial) {
    if (err) return next(err);

    return testimonial.remove(function (err) {
      if (err) return next(err);
      return res.sendStatus(200);
    });
  });
}

module.exports = {
  create,
  find,
  findById,
  formatQuery: mw.formatQuery([ 'limit', 'sort', 'page' ]),
  getAll,
  getLatest,
  getPublished,
  paginate: mw.paginate(Testimonial, 20),
  patch,
  put,
  remove
};
