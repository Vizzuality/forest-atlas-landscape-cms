require('dotenv').config({ silent: true });

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { environment } = require('@rails/webpacker');

environment.plugins.prepend(
  'Provide',
  new CopyWebpackPlugin([
    {
      from: 'node_modules/widget-editor/dist/images',
      to: 'images/'
    }
  ])
);

environment.plugins.append('definePlugin', new webpack.DefinePlugin({
  'ENV.API_URL': JSON.stringify(process.env.API_URL),
  'ENV.API_ENV': JSON.stringify(process.env.API_ENV),
  'ENV.API_APPLICATIONS': JSON.stringify(process.env.API_APPLICATIONS)
}));

module.exports = environment;
