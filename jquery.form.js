define(['jquery.boiler', 'modules/ajaxform/templates'], function($, T){

  $.boiler('ajaxform', {
    defaults: {
      onSubmit: false,
      onResponse: false,
      alertTarget: false,
      templates: {}
    },

    events: {
      submit: '_onSubmit'
    },

    init: function(){
      var plugin = this;

      //Extend the templates
      plugin.T = $.extend(T, plugin.settings.templates);

      if(plugin.settings.alertTarget){
        plugin.$alert = plugin.$el.find(plugin.settings.alertTarget).hide();
      } else {
        plugin.$alert = $('<div/>').hide();
        plugin.$el.prepend(plugin.$alert);
      }
    },

    _onSubmit: function(e){
      e.preventDefault();

      var plugin = this;

      if(plugin.settings.onSubmit) plugin.settings.onSubmit.call(plugin);
      plugin.$el.find('[type="submit"]').prop('disabled', true);

      $.ajax({
        url: plugin.$el.attr('action'),
        data: plugin.$el.serialize(),
        type: 'POST',
        dataType: 'json',
        error: function(){
          plugin.alert({
            message: 'Sorry, there seems to be an error. Please try again.'
          });
        },
        success: function(response){
          // Ajax request based on JSON standard http://labs.omniti.com/labs/jsend

          if(response.status == "success"){
            // used when call is successful
            plugin.alert({
              success: true,
              message: 'Your message was successfully sent.'
            });
            plugin.el.reset();
          }else if(response.status == "fail"){
            // used when call is rejected due to invalid data or call conditions
            plugin.alert({
              message: 'Please correct the following:',
              errors: response.data
            });
          }else if(response.status == "error"){
            // used when call fails due to an error on the server
            plugin.alert({
              message: response.message
            });
          }
        },
        complete: function(){
          if(plugin.settings.onResponse) plugin.settings.onResponse.call(plugin);
          plugin.$el.find('[type="submit"]').prop('disabled', false);
        }
      });
    },

    alert: function(data){
      var plugin = this;

      plugin.$alert[0].innerHTML = plugin.T.alert(data);
      plugin.$alert.show();
    }
  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;

});
