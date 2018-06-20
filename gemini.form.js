/**
 * @fileoverview

A Gemini plugin that submits forms using ajax, and returns results based on the
[JSend standard](http://labs.omniti.com/labs/jsend).

### Notes
- Alerted results are generated using an [alert template](https://github.com/carpages/gemini-form/blob/master/templates/alert.hbs)
- The form's action is used to make the ajax request

 *
 * @namespace gemini.form
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires gemini
 *
 * @prop {function} onSubmit {@link gemini.form#onSubmit}
 * @prop {function} onResponse {@link gemini.form#onResponse}
 * @prop {string} alertTarget {@link gemini.form#alertTarget}
 * @prop {object} templates {@link gemini.form#templates}
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

define([ 'gemini', 'gemini.form.templates' ], function( $, T ) {
  $.boiler( 'form', {
    defaults: {
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
       * @type function
       * @default false
       */
      onResponse: false,
      /**
       * Callback function after the server has returned a successful response
       *
       * @name gemini.form#onSuccess
       * @type function
       * @default false
       */
      onSuccess: false,
      /**
       * Callback function after the server has returned an error
       *
       * @name gemini.form#onError
       * @type function
       * @default false
       */
      onError: false,
      /**
       * Selector of container for the alert message
       *
       * *Note:* By default, it prepends it to the form
       *
       * @name gemini.form#alertTarget
       * @type string
       * @default false
       */
      alertTarget: false,
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

    events: {
      submit: '_onSubmit'
    },

    init: function() {
      var plugin = this;

      // Extend the templates
      plugin.T = $.extend( T, plugin.settings.templates );

      if ( plugin.settings.alertTarget ) {
        plugin.$alert = plugin.$el.find( plugin.settings.alertTarget ).hide();
      } else {
        plugin.$alert = $( '<div/>' ).hide();
        plugin.$el.prepend( plugin.$alert );
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
    _onSubmit: function( e ) {
      e.preventDefault();

      var plugin = this;

      if ( plugin.settings.onSubmit ) plugin.settings.onSubmit.call( plugin );
      plugin.$el.find( '[type="submit"]' ).prop( 'disabled', true );

      $.ajax({
        url: plugin.$el.attr( 'action' ),
        data: plugin.$el.serialize(),
        type: 'POST',
        dataType: 'json',
        error: function() {
          plugin.alert({
            message: 'Sorry, there seems to be an error. Please try again.'
          });
          if ( plugin.settings.onError ) {
            plugin.settings.onError.call( plugin );
          }
        },
        success: function( response ) {
          // Ajax request based on JSON standard http://labs.omniti.com/labs/jsend

          if ( response.status == 'success' ) {
            // used when call is successful
            plugin.alert({
              success: true,
              message: 'Your message was successfully sent.'
            });
            plugin.el.reset();

            if ( plugin.settings.onSuccess ) {
              plugin.settings.onSuccess.call( plugin );
            }
          } else if ( response.status == 'fail' ) {
            // used when call is rejected due to invalid data or call conditions
            plugin.alert({
              message: 'Please correct the following:',
              errors: response.data
            });
          } else if ( response.status == 'error' ) {
            // used when call fails due to an error on the server
            plugin.alert({
              message: response.message
            });
            if ( plugin.settings.onError ) {
              plugin.settings.onError.call( plugin );
            }
          }
        },
        complete: function() {
          if ( plugin.settings.onResponse ) {
            plugin.settings.onResponse.call( plugin );
          }
          plugin.$el.find( '[type="submit"]' ).prop( 'disabled', false );
        }
      });
    },

    /**
     * Alerts the user with a message
     *
     * @method
     * @name gemini.form#alert
     * @param {object} data The data to send to the alert template
     **/
    alert: function( data ) {
      var plugin = this;

      plugin.$alert[0].innerHTML = plugin.T.alert( data );
      plugin.$alert.show();
    }
  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;
});
