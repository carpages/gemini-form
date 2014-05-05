define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["alert"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return " alert--green";
  }

function program3(depth0,data) {
  
  
  return " alert--red";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "<h6 class=\"push-half--bottom\">";
  if (helper = helpers.message) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.message); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h6>";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<ul class=\"list--no-style push-half--bottom\">\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.errors), {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</ul>\n	";
  return buffer;
  }
function program8(depth0,data) {
  
  var buffer = "";
  buffer += "\n				<li>\n					<i class=\"icon--warning\"></i>\n					"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\n				</li>\n			";
  return buffer;
  }

  buffer += "<div class=\"alert";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.success), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " hard--bottom\">\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.message), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.errors), {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });

return this["JST"];

});