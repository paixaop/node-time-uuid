module.exports = process.env.COVERAGE
  ? require('./lib-cov/objectid')
  : require('./lib/objectid');
