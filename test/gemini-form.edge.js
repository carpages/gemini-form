/* eslint key-spacing: ["error", { "align": "colon" }] */
requirejs.config({
  baseUrl: '../',
  paths  : {
    'underscore'           : 'bower_components/underscore/underscore',
    'jquery'               : 'bower_components/jquery/dist/jquery',
    'handlebars'           : 'bower_components/handlebars/handlebars.runtime',
    'jquery.boiler'        : 'bower_components/jquery-boiler/jquery.boiler',
    'jquery.mockjax'       : 'bower_components/jquery-mockjax/src/jquery.mockjax',
    'gemini.support'       : 'bower_components/gemini-support/gemini.support',
    'gemini'               : 'bower_components/gemini-loader/gemini',
    'gemini.form.templates': 'templates'
  }
});

require([
  'gemini',
  'gemini.form',
  'jquery.mockjax'
], function( G ) {
  $.mockjax({
    url         : '/edge/test',
    responseText: {
      status : 'success',
      fortune: 'Are you a mock turtle?'
    }
  });

  G( '#js-ajax-form' ).form({
    inputAlertTarget: '.field__errors'
  });
});
