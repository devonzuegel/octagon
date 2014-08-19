var request = require("request");
var crunchbase_api_key = "?user_key=c7653c536c2266d0da1155557600c8a4";

exports.get_cmpny = function(permalink, callback) {
   var domain = "http://api.crunchbase.com/v/2/organization/";
   request(domain + permalink + crunchbase_api_key, function(error, response, body) {
      callback(body);
   });  
};