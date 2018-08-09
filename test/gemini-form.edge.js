requirejs.config({
  baseUrl: '../',
  paths: {
    underscore: 'bower_components/underscore/underscore',
    jquery: 'bower_components/jquery/dist/jquery',
    handlebars: 'bower_components/handlebars/handlebars.runtime',
    'jquery.boiler': 'bower_components/jquery-boiler/jquery.boiler',
    'jquery.mockjax': 'bower_components/jquery-mockjax/src/jquery.mockjax',
    'gemini.support': 'bower_components/gemini-support/gemini.support',
    gemini: 'bower_components/gemini-loader/gemini',
    'gemini.form.templates': 'templates'
  }
});

require([ 'gemini', 'gemini.form', 'jquery.mockjax' ], function( G ) {
  G.mockjax({
    url: '/edge/test',
    responseTime: 1500,
    response: function( settings ) {
      var responseData = settings.data
        .split( '&' )
        .reduce( function( accumulator, current ) {
          var [ key, value ] = current.split( '=' );
          accumulator[key] = value;
          return accumulator;
        }, {});

      var responseType = responseData['response-type'];

      var rtn = {
        status: responseType
      };

      if ( responseType === 'error' ) {
        rtn.message = decodeURIComponent( responseData['response-message']);
      }

      if ( responseType !== 'success' && responseData['checkbox'] !== 'on' ) {
        rtn = {
          status: 'fail',
          data: {
            checkbox: 'Checkbox must be checked.'
          }
        };
      }

      this.responseText = rtn;
    }
  });

  G( '#js-ajax-form' ).form({
    formAlertTarget: '.form__alerts',
    inputAlertTarget: '.field__errors',
    inputAlertParent: '.field',
    showServerValidationErrorOnInput: true
  });
});
