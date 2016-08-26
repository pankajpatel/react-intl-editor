if (process.env.NODE_ENV === 'production') {
  module.exports = require('./store/configureStore.production') // eslint-disable-line global-require
} else {
  module.exports = require('./store/configureStore.development') // eslint-disable-line global-require
}
