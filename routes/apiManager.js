var http = require("http");
var https = require("https");
var request = require("request");

var crunchbase_api_key = "?user_key=c7653c536c2266d0da1155557600c8a4";
/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.get_cmpny = function(permalink, callback) {
   var domain = "http://api.crunchbase.com/v/2/organization/";
   request(domain + permalink + crunchbase_api_key, function(error, response, body) {
      callback(body);
   });  
}

exports.getJSON = function(options, onResult) {
  console.log("rest::getJSON");

    // var prot = options.port == 443 ? https : http;
    var req = http.request(options, function(res) {
      var output = '';
      console.log(options.host + ':' + res.statusCode);
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        output += chunk;
     });

      res.on('end', function() {
        var obj = JSON.parse(output);
        onResult(res.statusCode, obj);
     });
   });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
     });

    req.end();
 };
