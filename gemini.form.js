/* global Templates */
/**
 * @fileoverview

A Gemini plugin that can validate forms on the front-end as well as submit them
using ajax.

### Notes
- The plugin follows the [JSend standard](http://labs.omniti.com/labs/jsend).
- Alerted results are generated using an [alert template](https://github.com/carpages/gemini-form/blob/master/templates/alert.hbs)
- The form's action is used to make the ajax request
- You can specify where the result is targeted per input using `data-form-alert`

 *
 * @namespace gemini.form
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires gemini
 *
 * @prop {function} onSubmit {@link gemini.form#onSubmit}
 * @prop {function} onResponse {@link gemini.form#onResponse}
 * @prop {string} formAlertTarget {@link gemini.form#formAlertTarget}
 * @prop {object} customTests {@link gemini.form#customTests}
 * @prop {function} defaultTest {@link gemini.form#defaultTest}
 * @prop {object} templates {@link gemini.form#templates}
 * @prop {object} customResponseHandlers {@link gemini.form#customResponseHandlers}
 * @prop {object} disableBuiltInResponseHandlers {@link gemini.form#disableBuiltInResponseHandlers}
 *
 * @example
  <html>
    <form id="js-ajax-form" action="http://fake.carpages.ca/ajax/url/" method="post">
      <div>
           <label for="name">Name:</label>
           <input type="text" name="name" id="name" value="" tabindex="1" />
      </div>

      <div>
        <label for="select-choice">Select Dropdown Choice:</label>
        <select name="select-choice" id="select-choice">
          <option value="Choice 1">Choice 1</option>
          <option value="Choice 2">Choice 2</option>
          <option value="Choice 3">Choice 3</option>
        </select>
      </div>

      <div>
        <label for="textarea">Textarea:</label>
        <textarea cols="40" rows="8" name="textarea" id="textarea"></textarea>
      </div>

      <label>
        <input type="checkbox" name="checkbox" id="checkbox" />
        Checkbox
      </label>

      <input class="button" type="submit" value="Submit" />
    </form>
  </html>
 *
 * @example
  G('#js-ajax-form').form();
 */

( function( factory ) {
  if ( typeof define === 'function' && define.amd ) {
    // AMD. Register as an anonymous module.
    define([ 'gemini', 'gemini.form.templates' ], factory );
  } else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    module.exports = factory(
      require( 'gemini-loader' ),
      require( './templates.js' )
    );
  } else {
    // Browser globals
    factory( G, Templates.Default.Form );
  }
})( function( $, T ) {
  $.boiler( 'form', {
    defaults: {
      /**
       * Weather to send ajax request
       *
       * @name gemini.form#ajax
       * @type boolean
       * @default true
       */
      ajax: true,

      /**
       * Callback function after the user has submitted the form
       *
       * @name gemini.form#onSubmit
       * @type function
       * @default false
       */
      onSubmit: false,

      /**
       * Callback function after the server has returned a response
       *
       * @name gemini.form#onResponse
       * @param {jqXHR} jqXHR The XHR object from the AJAX request.
       * @param {string} textStatus The status of the AJAX response.
       * @type function
       * @default false
       */
      onResponse: false,

      /**
       * Selector of container for the form alert message
       *
       * *Note:* By default, it asserts it before the submit buttons
       *
       * @name gemini.form#formAlertTarget
       * @type string
       * @default false
       */
      formAlertTarget: false,

      /**
       * Selector of container for the input alert message
       *
       * *Note:* By default, it asserts it after the input itself
       *
       * @name gemini.form#inputAlertTarget
       * @type string
       * @default false
       */
      inputAlertTarget: false,

      /**
       * Selector of parent for the input alert container
       *
       * @name gemini.form#inputAlertParent
       * @type string
       * @default ''
       */
      inputAlertParent: '',

      /**
       * Determines whether server validation errors should be shown on the
       * coordinating input, or only in the form alert bucket.
       *
       * @name gemini.form#showServerValidationErrorOnInput
       * @type boolean
       * @default false
       */
      showServerValidationErrorOnInput: false,

      /**
       * Determines the class that gets added to the submit button when ajax
       * is true and the form is submitting.
       *
       * @name gemini.form#loadingButtonClass
       * @type string
       * @default 'is-loading'
       */
      loadingButtonClass: 'is-loading',

      /**
       * Allows passing of custom messages to show for different form states.
       *
       * @name gemini.form#messages
       * @type object
       * @default {
       *   submittingTitle: 'Submitting',
       *   localValidationFail: 'There are errors with your form submission. Please see below.',
       *   requiredField: 'This field is required',
       *   serverValidationFail: 'Please correct the following:',
       *   success: 'Your message was successfully sent.',
       *   fallbackError: 'Something went wrong. Please try again later. Sorry for any inconvenience.'
       * }
       */
      messages: {},

      /**
       * The CSS module names associated with a node type. This module
       * is passed to the template
       *
       * @name gemini.form#moduleNames
       * @type object
       * @default {
       *   "default":   "alert",
       *   "input":     "alert-input",
       *   "form":      "alert-form"
       * }
       */
      moduleNames: {
        default: 'alert',
        input: 'alert-input',
        form: 'alert-form'
      },

      /**
       * The CSS class to be added to the input that has an error.
       *
       * @name gemini.form#errorClass
       * @type string
       * @default 'is-error'
       */
      errorClass: 'is-error',

      /**
       * Whether or not select dropdowns are wrapped with a styling div
       *
       * @name gemini.form#selectWrapper
       * @type boolean
       * @default false
       */
      selectWrapper: false,

      /**
       * The class of the select wrapping div
       *
       * @name gemini.form#selectWrapperClass
       * @type string
       * @default '.select'
       */
      selectWrapperClass: '.select',

      /**
       * The event associated with a node type. This event is bound on errors.
       *
       * @name gemini.form#eventTypes
       * @type object
       * @default {
       *   "default":   "change",
       *   "input":     "keyup"
       * }
       */
      eventTypes: {
        default: 'change',
        input: 'keyup'
      },

      /**
       * Map of selectors pointing to functions for writing custom tests. These
       * functions can either return boolean for pass or fail, or a data object
       * that will be passed to the alert function.
       *
       * @name gemini.form#customTests
       * @type object
       * @default {}
       */
      customTests: {},

      /**
       * The default test that runs for input objects. It can return either a
       * boolean, or an object to be passed to the alert template
       *
       * @name gemini.form#defaultTest
       * @type function
       * @default return !!$(this).val();
       */
      defaultTest: function() {
        return !!$( this ).val();
      },

      /**
       * An object of custom response handlers for handling your own responses
       * from the server.
       *
       * Expects functions that get passed the response data.
       * Expected keys:
       *  - response: Overall response handler. Overwrites entire built-in
       *              response handler.
       * The following do not affect built-in handling of responses. They
       * instead get called alongside the built-in handling. You can disable
       * built-in handling of responses by setting the disable flags described below.
       *  - success:  Success status response handler.
       *  - fail:     Validation fail status response handler.
       *  - error:    Error status response handler.
       *  - fallback: Fallback response handler when unhandled status is
       *              received from server.
       *
       * @name gemini.form#customResponseHandlers
       * @type object
       * @default {}
       */
      customResponseHandlers: {
        /**
         * A function that allows you to take full control of what happens when
         * the ajax response comes back. This function gets passed the response
         * data from the server.
         *
         * @name gemini.form#customResponseHandlers.response
         * @type function
         * @default false
         */
        response: false,

        /**
         * A function that allows you to take full control of what happens when
         * the ajax response comes back with a success status. This function gets
         * passed the response data from the server.
         *
         * @name gemini.form#customResponseHandlers.success
         * @type function
         * @default false
         */
        success: false,

        /**
         * A function that allows you to take full control of what happens when
         * the ajax response comes back with validation errors. This function gets
         * passed the response data from the server.
         *
         * @name gemini.form#customResponseHandlers.fail
         * @type function
         * @default false
         */
        fail: false,

        /**
         * A function that allows you to take full control of what happens when
         * the ajax response comes back with a server error. This function gets
         * passed the response data from the server.
         *
         * @name gemini.form#customResponseHandlers.error
         * @type function
         * @default false
         */
        error: false,

        /**
         * A function that allows you to take full control of what happens when
         * the ajax response comes back with a status other than 'success', 'fail',
         * or 'error'. This function gets passed the response data from the server.
         *
         * @name gemini.form#customResponseHandlers.fallback
         * @type function
         * @default false
         */
        fallback: false
      },

      /**
       * An object that has keys to disable built-in handling of AJAX
       * server responses.
       *
       * @name gemini.form#disableBuiltInResponseHandlers
       * @type object
       * @default {}
       */

      disableBuiltInResponseHandlers: {
        success: false,
        fail: false,
        error: false,
        fallback: false,
        all: false
      },

      /**
       * Precompiled Handlebar templates to replace default.
       * Expecting 'alert' for the alert message.
       *
       * @name gemini.form#templates
       * @type object
       * @default {}
       */
      templates: {}
    },

    defaultMessages: {
      submittingTitle: 'Submitting',
      localValidationFail:
        'There are errors with your form submission. Please see below.',
      requiredField: 'This field is required',
      serverValidationFail: 'Please correct the following:',
      success: 'Your message was successfully sent.',
      fallbackError:
        'Something went wrong. Please try again later. Sorry for any inconvenience.'
    },

    lifecycleHooks: {
      success: [],
      fail: [],
      error: [],
      fallback: [],
      init: []
    },

    init: function() {
      var plugin = this;

      // extend the templates
      plugin.T = $.extend( T, plugin.settings.templates );

      // cache
      plugin.$submit = plugin.$el.find( '[type="submit"]' );
      plugin.submitTitle = plugin.$submit.text();
      plugin.messages = $.extend(
        plugin.defaultMessages,
        plugin.settings.messages
      );

      // cache requirements and their tests
      plugin.requirements = [];

      $.each( plugin.settings.customTests, function( key, value ) {
        $( key ).each( function() {
          var $el = $( this );
          $el.data( 'usesCustomTest', true );

          var eventType =
            plugin.settings.eventTypes[this.nodeName.toLowerCase()] ||
            plugin.settings.eventTypes['default'];

          plugin.requirements.push({
            el: this,
            $el: $el,
            test: value,
            eventName: eventType + '.geminiform'
          });
        });
      });

      plugin.$el.find( '[required]' ).each( function() {
        var $el = $( this );

        var eventType =
          plugin.settings.eventTypes[this.nodeName.toLowerCase()] ||
          plugin.settings.eventTypes['default'];

        if ( !$el.data( 'usesCustomTest' )) {
          plugin.requirements.push({
            el: this,
            $el: $( this ),
            test: null,
            eventName: eventType + '.geminiform'
          });
        }
      });

      // user has set custom form alert target
      if ( plugin.settings.formAlertTarget ) {
        plugin.$el.data(
          'form-alert-cache',
          plugin.$el.find( plugin.settings.formAlertTarget ).hide()
        );
      }

      // user has set custom input alert target
      if ( plugin.settings.inputAlertTarget ) {
        plugin.$el.find( plugin.settings.inputAlertTarget ).hide();
      }

      // use button click to byPass default submit
      plugin.$submit.click( function( e ) {
        e.preventDefault();
        plugin._onSubmit();
      });

      plugin._runLifecycleHooks( 'init' );
    },

    addLifecycleHook: function( lifecycleEvent, callback ) {
      var plugin = this;

      if ( typeof callback !== 'function' ) {
        return;
      }

      plugin.lifecycleHooks[lifecycleEvent].push( callback );
      return plugin;
    },

    _runLifecycleHooks: function( lifecycleEvent, response ) {
      var plugin = this;
      var fallbackLifecycleHooks = plugin.lifecycleHooks[lifecycleEvent];

      if ( fallbackLifecycleHooks.length > 0 ) {
        $.each( fallbackLifecycleHooks, function( _index, callback ) {
          callback.call( plugin, response );
        });
      }
    },

    /**
     * Callback function when the user submits the form
     *
     * @private
     * @method
     * @name gemini.form#_onSubmit
     * @param {object} e Event object
     **/
    _onSubmit: function() {
      var plugin = this;

      if ( plugin.settings.onSubmit ) plugin.settings.onSubmit.call( plugin );

      var validationStatus = plugin._checkRequirements();

      // meets requirements
      if ( validationStatus.pass ) {
        if ( plugin.settings.ajax ) {
          plugin._setSubmitting( true );

          // Use ajax
          $.ajax({
            url: plugin.$el.attr( 'action' ),
            data: plugin.$el.serialize(),
            type: 'POST',
            dataType: 'json',
            error: plugin._handleResponse.bind( plugin ),
            success: plugin._handleResponse.bind( plugin ),
            complete: function( jqXHR, textStatus ) {
              if ( plugin.settings.onResponse ) {
                plugin.settings.onResponse.call( plugin, jqXHR, textStatus );
              }
              plugin._setSubmitting( false );
            }
          });
        } else {
          // Don't use ajax
          plugin.$el.submit();
        }
      } else {
        plugin._handleResponse({
          status: 'error',
          message: plugin.messages.localValidationFail
        });
      }
    },

    _setSubmitting: function( isSubmitting ) {
      var plugin = this;
      var loadingClass = plugin.settings.loadingButtonClass;

      plugin.submitting = isSubmitting;

      if ( plugin.submitting ) {
        // Disable submit button while ajax-ing
        plugin.$submit
          .prop( 'disabled', true )
          .text( plugin.messages.submittingTitle )
          .addClass( loadingClass );
      } else {
        // Reenable submit button when complete
        plugin.$submit
          .prop( 'disabled', false )
          .text( plugin.submitTitle )
          .removeClass( loadingClass );
      }
    },

    /**
     * Check if the form requirements pass
     *
     * @private
     * @method
     * @name gemini.form#_checkRequirements
     * @return {array} Whether the requirements pass or not
     **/
    _checkRequirements: function() {
      var plugin = this;
      var pass = true;
      var failedInputs = {};

      $.each( plugin.requirements, function( i, requirement ) {
        var thisPasses = plugin._checkInput( requirement.el, requirement.test );

        if ( !thisPasses ) {
          var failedInputSelector = '[name="' + requirement.el.name + '"]';
          failedInputs[failedInputSelector] = requirement.el;

          // Add change listener if failed
          requirement.$el.on( requirement.eventName, function() {
            var secondPass = plugin._checkInput(
              requirement.el,
              requirement.test
            );

            if ( secondPass ) {
              delete failedInputs[failedInputSelector];
              requirement.$el.off( requirement.eventName );
            }
          });
        }

        pass = pass && thisPasses;
      });

      return {
        pass: pass,
        failedInputs: failedInputs
      };
    },

    /**
     * Check if a specific input has a value and append alert if it doesn't
     *
     * @private
     * @method
     * @name gemini.form#_checkInput
     * @param {object} el The element that you're checking
     * @return {boolean} Weather the input has a value or not
     **/
    _checkInput: function( el, test ) {
      var plugin = this;
      var $el = $( el );

      // Default test
      if ( typeof test === 'undefined' || !test ) {
        test = plugin.settings.defaultTest;
      }

      var results = test.call( el );

      // If results is false, or object
      if ( !results || typeof results === 'object' ) {
        // Create alert using results object with fallback
        plugin.alert(
          results || {
            message: plugin.messages.requiredField
          },
          el
        );

        if ( $el.is( 'select' ) && plugin.settings.selectWrapper ) {
          $el
            .parent( plugin.settings.selectWrapperClass )
            .addClass( plugin.settings.errorClass );
        } else {
          // Set status
          $el.addClass( plugin.settings.errorClass );
        }

        return false;
      } else {
        // Remove alert
        plugin.alert( false, el );

        if ( $el.is( 'select' ) && plugin.settings.selectWrapper ) {
          $el
            .parent( plugin.settings.selectWrapperClass )
            .removeClass( plugin.settings.errorClass );
        } else {
          // Remove status
          $el.removeClass( plugin.settings.errorClass );
        }

        return true;
      }
    },

    /**
     * Handles the response from the server when the form is sent
     *
     * @private
     * @method
     * @name gemini.form#_handleResponse
     * @param {object} response The ajax object returned from the server
     **/
    _handleResponse: function( response ) {
      var plugin = this;
      var customHandlers = plugin.settings.customResponseHandlers;
      var disabledHandlers = plugin.settings.disableBuiltInResponseHandlers;

      if ( typeof customHandlers.response === 'function' ) {
        customHandlers.response.call( plugin, response );
      } else {
        // Ajax request based on JSON standard http://labs.omniti.com/labs/jsend
        switch ( response.status ) {
          // when call is successful
          case 'success':
            if ( typeof customHandlers.success === 'function' ) {
              customHandlers.success.call( plugin, response );
            }

            if ( disabledHandlers.success || disabledHandlers.all ) {
              return;
            }

            plugin._runLifecycleHooks( 'success', response );
            plugin._defaultSuccessHandler( response );
            break;

          // when call is rejected due to invalid data or call conditions
          case 'fail':
            if ( typeof customHandlers.fail === 'function' ) {
              customHandlers.fail.call( plugin, response );
            }

            if ( disabledHandlers.fail || disabledHandlers.all ) {
              return;
            }

            plugin._runLifecycleHooks( 'fail', response );
            plugin._defaultFailHandler( response );
            break;

          // when call fails due to an error on the server
          case 'error':
            if ( typeof customHandlers.error === 'function' ) {
              customHandlers.error.call( plugin, response );
            }

            if ( disabledHandlers.error || disabledHandlers.all ) {
              return;
            }

            plugin._runLifecycleHooks( 'error', response );
            plugin._defaultErrorHandler( response );
            break;

          // when server doesn't pass right data
          default:
            if ( typeof customHandlers.fallback === 'function' ) {
              customHandlers.fallback.call( plugin, response );
            }

            if ( disabledHandlers.fallback || disabledHandlers.all ) {
              return;
            }

            plugin._runLifecycleHooks( 'fallback', response );
            plugin._defaultFallbackHandler( response );
        }
      }
    },

    _defaultSuccessHandler: function( response ) {
      var plugin = this;

      plugin.alert({
        success: true,
        message: plugin.messages.success
      });

      plugin.el.reset();
    },

    _defaultErrorHandler: function( response ) {
      var plugin = this;

      plugin.alert({
        message: response.message
      });
    },

    _defaultFailHandler: function( response ) {
      var plugin = this;

      plugin.alert({
        message: plugin.messages.serverValidationFail,
        errors: response.data
      });

      if ( plugin.settings.showServerValidationErrorOnInput ) {
        var errors = response.data;

        Object.keys( errors ).map( function( inputName ) {
          var $inputEl = G( '[name*="' + inputName + '"]' );
          plugin.alert(
            {
              message: errors[inputName]
            },
            $inputEl[0]
          );
        });
      }
    },

    _defaultFallbackHandler: function( response ) {
      var plugin = this;

      plugin.alert({
        message: plugin.messages.fallbackError
      });
    },

    /**
     * Alerts the user with a message
     *
     * @method
     * @name gemini.form#alert
     * @param {object} data The data to send to the alert template
     **/
    alert: function( data, el ) {
      var plugin = this;
      var isEl = typeof el !== 'undefined';
      var isForm = !isEl;

      if ( isForm ) {
        plugin._formAlert( data );
      } else {
        plugin._inputAlert( data, el );
      }
    },

    _formAlert: function( data ) {
      var plugin = this;

      var $el = plugin.$el;
      var el = plugin.$el[0];
      var $alertParent = $el.find( plugin.settings.formAlertTarget );
      var $alert = plugin._getCachedAlert( $el );

      if ( $alertParent ) {
        // insert into input alert target when set
        $alertParent.append( $alert );
      } else {
        // prepend button for form
        plugin.$submit.before( $alert );
      }

      plugin._showAlertOrHide( $alert, data, el );
    },

    _inputAlert: function( data, el ) {
      var plugin = this;

      var $el = $( el );
      var $alertParent = $el.closest( plugin.settings.inputAlertParent );
      var $alertTarget = $alertParent.find( plugin.settings.inputAlertTarget );

      var $alert = plugin._getCachedAlert( $alertTarget );

      if ( $alertTarget ) {
        // insert into input alert target when set
        $alertTarget.append( $alert );
      } else {
        // append for input
        $el.after( $alert );
      }

      plugin._showAlertOrHide( $alertTarget, data, el );
    },

    _getCachedAlert: function( $el ) {
      var plugin = this;

      var $cachedAlert = $el.data( 'form-alert-cache' );
      if ( $cachedAlert ) return $cachedAlert;

      // cache alert if it doesn't exist yet
      var id = $el.data( 'form-alert' );

      // grab set id, or generate new div
      var $alert = id ? plugin.$el.find( id ) : $( '<div>' );

      $el.data( 'form-alert-cache', $alert );
      return $alert;
    },

    _showAlertOrHide: function( $alert, data, el ) {
      var plugin = this;

      // show alert if successful
      if ( data ) {
        data.module =
          plugin.settings.moduleNames[el.nodeName.toLowerCase()] ||
          plugin.settings.moduleNames['default'];

        $alert.html( plugin.T.alert( data )).show();
      } else {
        $alert.hide();
      }
    }
  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;
});
