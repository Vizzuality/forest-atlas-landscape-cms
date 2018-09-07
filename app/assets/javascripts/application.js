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
//= require fitvids
//= require d3
//= require vega
//= require leaflet
//= require esri-leaflet
//= require PruneCluster/PruneCluster
//= require handlebars
//= require object-assign-polyfill
//= require datalib
//= require jiminy

//= require_self

// = require_tree ./helpers
// = require_tree ./routers/front
// = require_tree ./templates
// = require_tree ./blots
// = require_tree ./views/shared
// = require_tree ./views/front
// = require dispatchers/frontDispatcher

$(document).ready(function(){
  $(".close").click(function(){
    $(".flash_container").hide(); 
  });

  setTimeout(function() {
    $(".flash_container").hide();
  }, 5000);
});


(function () {
  'use strict';

  this.App = {
    Events: _.extend(Backbone.Events),
    View: {},
    Model: {},
    Router: {},
    Helper: {},
    Blot: {}
  };
}).call(this);