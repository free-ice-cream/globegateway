var http = require ('http');
var url = require ('url');
const request = require('request');
//
const ax = require('./access.js');
let accesstoken  = ax.axto();
let dev1 = ax.device1();
let dev2 = ax.device2();
let dev3 = ax.device3();
let dev4 = ax.device4();
let dev5 = ax.device5();
let dev6 = ax.device6();
let dev7 = ax.device7();
var thisGlobe = "";
var counter = 0;

console.log("axto =",accesstoken, "dev1 ", dev1 );

http.createServer(function (req, res){
  // console.log("req = ",req);
  console.log("counter = ",counter);
  counter +=1;
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;
  var service = q.service;
  var user = q.user;
  thisGlobe = q.globe;
  res.write("<p>the service was: "+service+"</p><p>the user was: "+user+"</p> <p> the globe selected was: "+thisGlobe+"</p>");
  //if(globe == "bottle"){
  if(thisGlobe!= "" || typeof thisGlobe!= "undefined" ){
    postToParticle(thisGlobe);
  }
  // postToParticle(thisGlobe);
  console.log("globe selected was", thisGlobe);
  //}
  res.end();
}).listen(8080);

//
var deviceID;


postToParticle = function(g){
  console.log("g = ",g);
  gl = String(g);
  switch(gl){
    case "1":
      deviceID = dev1;
      break;
    case "2":
      deviceID = dev2;
      break;
    case "3":
      deviceID = dev3;
      break;
    case "4":
      deviceID = dev4;
      break;
    case "5":
      deviceID = dev5;
      break;
    case "6":
        deviceID = dev6;
      break;
    case "7":
          deviceID = dev7;
      break;
    default:
    console.log("device id not in the ting");
      deviceID = "";
  }

let hardCoded = "https://api.particle.io/v1/devices/"+deviceID+"/globe?access_token="+accesstoken;

console.log("the uri is:", hardCoded);
  request.post({url:hardCoded, form: {value:'go'}}, function(err,httpResponse,body){
    if (!err && httpResponse.statusCode == 200) {
      console.log(" yay getting a 200");
      console.log("and we are talking to globe ", thisGlobe);
      console.log(body);
    }else{
      console.log("getting an error");
      console.log(err);
    }
  /* ... */
})
}
