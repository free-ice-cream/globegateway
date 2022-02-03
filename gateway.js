var http = require ('http');
var url = require ('url');
const request = require('request');
var fs = require('fs');
const axios = require('axios');
//
const ax = require('./access.js');

let accesstoken  = ax.axto();
const strapiToken = ax.strto();
var str_url = "https://strapi.snowglobes.ae";
var globedata_url =  "/globeData"
//
let dev1 = ax.device1();
let dev2 = ax.device2();
let dev3 = ax.device3();
let dev4 = ax.device4();
let dev5 = ax.device5();
let dev6 = ax.device6();
let dev7 = ax.device7();
let dev8 = ax.device8();
//
let deviceFunction = ax.deviceFunction();//
//
var htmlPage = ""


// var accesstoken = process.env.PARTICLETOKEN;
// let dev1 = process.env.DEVICEONE;
// let dev2 = process.env.DEVICETWO;
// let dev3 = process.env.DEVICETHREE;
// let dev4 = process.env.DEVICEFOUR;
// let dev5 = process.env.DEVICEFIVE;
// let dev6 = process.env.DEVICESIX;
// let dev7 = process.env.DEVICESEVEN;

/*
globe adjustments

g5   now =  g4
g4   now =  g3
g3   now =  g1
g2   now =  g2
g1 - cancelled

*/


var thisGlobe = "";
var counter = 0;

console.log("axto =",accesstoken, "dev1 ", dev1 );


fs.readFile('./testbuttons.html', function (err, html) {
    if (err) {
        throw err;
    }
try{
    http.createServer(function (req, res){
      // console.log("req = ",req);
      console.log("counter = ",counter);
       counter +=1;
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.writeHead(200, {'Content-Type': 'text/html'});
      var q = url.parse(req.url, true).query;
      var service = q.service;
      var user = q.user;
      thisGlobe = q.globe;
      res.write(html);
      res.write("<p>the service was: "+service+"</p><p>the user was: "+user+"</p> <p> the globe selected was: "+thisGlobe+"</p>");

      //if(globe == "bottle"){
      if(thisGlobe!= "" || typeof thisGlobe!= "undefined" ){
        postToParticle(thisGlobe);
        postToStrapi({json:'holder'},thisGlobe, service, "message holder", user, "metadata holder" );

        writeToFile(thisGlobe, service );
      }
      // postToParticle(thisGlobe);
      console.log("globe selected was", thisGlobe);
      //}
      res.end();
    }).listen(8080);
}catch(error){
  console.log("error =", error);
}

});

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
    case "8":
            deviceID = dev8;
      break;
    default:
    console.log("device id not in the ting");
      deviceID = "";
  }

let hardCoded = "https://api.particle.io/v1/devices/"+deviceID+"/"+deviceFunction+"?access_token="+accesstoken;

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

//
//
writeToFile = function( globe_number, serviceUsed){
  // add a line to a lyric file, using appendFile

  try {
    let time = Date.now();
    let dd = new Date();
    let d = dd.getUTCDate();
    fs.appendFile('globeLogs.txt', '\n Globe :'+globe_number+', callTime UTC: '+dd+' service: '+serviceUsed, (err) => {
      if (err) throw err;
      console.log('globelogs updated!');
  });
  } catch (e) {
    fs.appendFile('errorlogs.txt','\n UTC:'+dd+' e: '+e);
  }

}


postToStrapi = function(twitterdump, globe_number, serviceUsed, message, user_handle, metadata){
  console.log("posttostrapi called");
  console.log("call currenly empty");
  // axios.post(str_url, {
  //   twitterdump: twitterdump,
  //   globenumber: globe_number,
  //   service: serviceUsed,
  //   message: message,
  //   user: user_handle,
  //   metadata: metadata
  // })
  // .then((res) => {
  //   console.log(`statusCode: ${res.statusCode}`)
  //   console.log(res)
  // })
  // .catch((error) => {
  //   console.error(error)
  // })





/*  This is the format the server expects
{
  "twitterdump": {},
  "globenumber": "string",
  "service": "string",
  "message": "string",
  "user": "string",
  "metadata": "string"
}
*/
// var body = JSON.stringify({
// var body = JSON.parse( '{"twitterdump": {"twitter":"dump demo"},"globenumber": "'+globe_number+'",  "service": "'+serviceUsed+'","message": "'+message+'","user": "'+user_handle+'","metadata": " '+metadata+'"}');
//
// try {
// console.log("str_url= ", str_url);
// console.log("globedata_url = ", globedata_url);
// console.log("hardcoded = ",str_url+globedata_url );
//
// var strapirequest = new http.ClientRequest({
//     hostname: str_url,
//     port: 80,
//     path: globedata_url,
//     method: "POST",
//     headers: {
//         "Content-Type": "application/json",
//         "Content-Length": Buffer.byteLength(body)
//     }
// })
// strapirequest.end(body)
// strapirequest.on('response', function (response) {
//   console.log('STATUS: ' + response.statusCode);
//    console.log('HEADERS: ' + JSON.stringify(response.headers));
//   response.setEncoding('utf8');
//   response.on('data', function (chunk) {
//     console.log('BODY: ' + chunk);
//   });
// });
// } catch (e) {
//   console.log("e", e);
// }

}
