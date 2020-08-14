require('dotenv').config({ silent: true });


const vegaPackage = require('vega/package.json');
const webpack = require('webpack');
const { environment } = require('@rails/webpacker');

environment.plugins.append('definePlugin', new webpack.DefinePlugin({
  'ENV.API_URL': JSON.stringify(process.env.API_URL),
  'ENV.WEBSHOT_API_URL': JSON.stringify(process.env.WEBSHOT_API_URL),
  'ENV.API_ENV': JSON.stringify(process.env.API_ENV),
  'ENV.API_APPLICATIONS': JSON.stringify(process.env.API_APPLICATIONS),
  'ENV.VEGA_VERSION': JSON.stringify(vegaPackage.version)
}));

module.exports = environment;
