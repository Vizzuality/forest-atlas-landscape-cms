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

module.exports = environment;
