const environment = require('./environment')

environment.mode = 'production';
environment.devtool = 'source-map';

module.exports = environment.toWebpackConfig()
