// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require underscore
//= require jquery
//= require jquery_ujs
//= require backbone
//= require turbolinks
//= require d3
//= require vega
//= require leaflet
//= require handlebars
//= require jquery-ui
//= require jquery-nested-sortable
//= require sir-trevor
//= require fuse.js/fuse
//= require object-assign-polyfill
//= require jiminy
//= require select2

//= require_self

// = require_tree ./helpers
// = require_tree ./routers/management
// = require_tree ./templates
// = require_tree ./blocks
// = require_tree ./views/shared
// = require_tree ./views/management
// = require dispatchers/managementDispatcher

(function () {
  'use strict';

  this.App = {
    Events: _.extend(Backbone.Events),
    View: {},
    Model: {},
    Router: {},
    Helper: {},
    Block: {}
  };
}).call(this);
