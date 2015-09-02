/**
 * @fileoverview

A Gemini plugin that submits forms using ajax, and returns results based on the
[JSend standard](http://labs.omniti.com/labs/jsend).

### Notes
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

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
      'gemini',
      'gemini.form.templates'
    ], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(
      require('gemini-loader'),
      require('./templates.js')
    );
  } else {
    // Browser globals
    factory(G, Templates.Default.Form);
  }
}(function($, T) {

  $.boiler('form', {
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
       * Selector of container for the alert message
       *
       * *Note:* By default, it asserts it before the submit buttons
       *
       * @name gemini.form#formAlertTarget
       * @type string
       * @default false
       */
      formAlertTarget: false,
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
        return !!$(this).val();
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

    init: function(){
      var plugin = this;

      // extend the templates
      plugin.T = $.extend(T, plugin.settings.templates);

      // cache
      plugin.$submit = plugin.$el.find('[type="submit"]');

      // cache requirements and their tests
      plugin.requirements = [];

      $.each(plugin.settings.customTests, function(key, value) {
        $(key).each(function () {
          var $el = $(this);
          $el.data('usesCustomTest', true);

          plugin.requirements.push({
            el: this,
            $el: $el,
            test: value
          });
        });
      });

      plugin.$el.find('[required]').each(function () {
        var $el = $(this);

        if (!$el.data('usesCustomTest'))
          plugin.requirements.push({
            el: this,
            $el: $(this),
            test: null
          });
      });

      // user has set custom alert target
      if (plugin.settings.formAlertTarget) {
        plugin.$el.data('form-alert-cache', plugin.$el.find(plugin.settings.formAlertTarget).hide());
      }

      // use button click to byPass default submit
      plugin.$submit.click(function(e) {
        e.preventDefault();
        plugin._onSubmit();
      });
    },

    /**
     * Callback function when the user submits the form
     *
     * @private
     * @method
     * @name gemini.form#_onSubmit
     * @param {object} e Event object
    **/
    _onSubmit: function(){
      var plugin = this;

      if (plugin.settings.onSubmit) plugin.settings.onSubmit.call(plugin);

      // meets requirements
      if ( plugin._checkRequirements() ) {

        plugin.$submit.prop('disabled', true);

        $.ajax({
          url: plugin.$el.attr('action'),
          data: plugin.$el.serialize(),
          type: 'POST',
          dataType: 'json',
          error: function() {
            plugin._handleResponse( {status: null} );
          },
          success: function(response) {
            plugin._handleResponse(response);
          },
          complete: function() {
            if(plugin.settings.onResponse) plugin.settings.onResponse.call(plugin);
            plugin.$submit.prop('disabled', false);
          }
        });

      }
    },

    /**
     * Check if the form requirements pass
     *
     * @private
     * @method
     * @name gemini.form#_checkRequirements
     * @return {boolean} Weather the requirements pass or not
    **/
    _checkRequirements: function() {
      var plugin = this;
      var pass = true;

      $.each(plugin.requirements, function(i, requirement) {
        var thisPasses = plugin._checkInput(requirement.el, requirement.test);

        if ( !thisPasses ) {

          // Add change listener if failed
          requirement.$el.change(function() {
            plugin._checkInput(requirement.el, requirement.test);
          });
        }

        pass = pass && thisPasses;

      });

      return pass;

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
    _checkInput: function(el, test) {
      var plugin = this;
      var $el = $(el);

      // Default test
      if(typeof test === 'undefined' || !test) {
        test = plugin.settings.defaultTest;
      }

      var results = test.call(el);

      // If results is false, or object
      if (!results || typeof results === 'object') {

        // Create alert using results object with fallback
        plugin.alert(results || {
          message: "This field is required"
        }, el);

        // Set status
        $el.addClass('is-error');

        return false;

      } else {

        // Remove alert
        plugin.alert(false, el);

        // Remove status
        $el.removeClass('is-error');

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
    _handleResponse: function(response) {
      var plugin = this;

      // Ajax request based on JSON standard http://labs.omniti.com/labs/jsend
      switch (response.status) {

        // when call is successful
        case "success":
          plugin.alert({
            success: true,
            message: 'Your message was successfully sent.'
          });
          plugin.el.reset();
          break;

        // when call is rejected due to invalid data or call conditions
        case "fail":
          plugin.alert({
            message: 'Please correct the following:',
            errors: response.data
          });
          break;

        // when call fails due to an error on the server
        case "error":
          plugin.alert({
            message: response.message
          });
          break;

        // when server doesn't pass right data
        default:
          plugin.alert({
            message: "Something went wrong. Please try again later. Sorry for any inconvenience."
          });
      }
    },

    /**
     * Alerts the user with a message
     *
     * @method
     * @name gemini.form#alert
     * @param {object} data The data to send to the alert template
    **/
    alert: function(data, el){
      var plugin = this;
      var isEl = typeof el !== 'undefined';
      var isForm = !isEl;

      // default alert to form alert
      var $el = isEl ? $(el) : plugin.$el;

      // get alert object
      var $alert = $el.data('form-alert-cache');

      // cache alert if it doesn't exist yet
      if (!$alert) {
        var id = $el.data('form-alert');

        // grab set id, or generate new div
        if (!!id) {
          $alert = plugin.$el.find(id);
        } else {
          $alert = $('<div>');

          // prepend button for form // append for input
          if (isForm) {
            plugin.$submit.before($alert);
          } else {
            $el.after($alert);
          }
        }

        $el.data('form-alert-cache', $alert);
      }

      // show alert if successful
      if (!!data) {
        data.module = isForm ? "form-alert" : "input-alert";

        $alert.html( plugin.T.alert(data) )
              .show();
      } else {
        $alert.hide();
      }
    }
  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;

}));
