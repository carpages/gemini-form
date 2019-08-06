(function(factory) {

if (typeof define === 'function' && define.amd) {

define(['handlebars'], factory);

} else if (typeof exports === 'object') {

module.exports = factory(require('handlebars'));

} else {

factory(Handlebars);

}

}(function(Handlebars) {

this["Templates"] = this["Templates"] || {};
this["Templates"]["Default"] = this["Templates"]["Default"] || {};
this["Templates"]["Default"]["Form"] = this["Templates"]["Default"]["Form"] || {};

this["Templates"]["Default"]["Form"]["alert"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "success";
},"3":function(container,depth0,helpers,partials,data) {
    return "fail";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <p class=\""
    + alias4(((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"module","hash":{},"data":data}) : helper)))
    + "__message\">"
    + alias4(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data}) : helper)))
    + "</p>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "    <ul class=\""
    + container.escapeExpression(((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"module","hash":{},"data":data}) : helper)))
    + "__list\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.errors : depth0),{"name":"each","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "        <li>\n          "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "\n        </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"gemini-form-alert "
    + alias4(((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"module","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"module","hash":{},"data":data}) : helper)))
    + "--"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.success : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.errors : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

return this["Templates"]["Default"]["Form"];

}));