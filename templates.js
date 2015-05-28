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

this["Templates"]["Default"]["Form"]["alert"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " form-alert--success";
},"3":function(depth0,helpers,partials,data) {
    return " form-alert--fail";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "<h6 class=\"form-alert__title\">"
    + this.escapeExpression(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"message","hash":{},"data":data}) : helper)))
    + "</h6>";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <ul class=\"form-alert__list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.errors : depth0),{"name":"each","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n";
},"8":function(depth0,helpers,partials,data) {
    return "        <li>\n          "
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\n        </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"form-alert"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.success : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\n  "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.errors : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

return this["Templates"]["Default"]["Form"];

}));