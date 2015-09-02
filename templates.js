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
    return "success";
},"3":function(depth0,helpers,partials,data) {
    return "fail";
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    <p class=\""
    + alias3(((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"module","hash":{},"data":data}) : helper)))
    + "__message\">"
    + alias3(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"message","hash":{},"data":data}) : helper)))
    + "</p>\n";
},"7":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "    <ul class=\""
    + this.escapeExpression(((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"module","hash":{},"data":data}) : helper)))
    + "__list\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.errors : depth0),{"name":"each","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n";
},"8":function(depth0,helpers,partials,data) {
    return "        <li>\n          "
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "\n        </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"gemini-form-alert "
    + alias3(((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"module","hash":{},"data":data}) : helper)))
    + " "
    + alias3(((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"module","hash":{},"data":data}) : helper)))
    + "--"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.success : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.message : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.errors : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

return this["Templates"]["Default"]["Form"];

}));