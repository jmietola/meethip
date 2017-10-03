var express = require('express');
var router = express.Router();
var storage = require('node-persist');
var helpers = require('../utils/helpers.js');

/* GET users listing. */
router.get('/', function(req, res, next) {

  var currentLocation = { lat: req.query.lat, lng: req.query.lng };
  console.log("TEST");
  var obj = storage.getItemSync('locationKey');
  console.log(obj);
  // Init empty cache
  if (typeof obj === 'undefined') {
    console.log("Init obj", obj);
    //60.1668336&lng=24.924071899999998
    var obj = {
    locations: [{ lat: req.query.lat, lng: req.query.lng }]
    };
  }
  
  if(obj.locations.length > 0){
    console.log("add to cache obj", currentLocation);
    obj.locations.push(currentLocation);
    storage.setItemSync('locationKey', obj);
  }

    let value = storage.getItemSync('locationKey');

    var locationArray = value.locations;
    console.log(locationArray);
    for (let values of locationArray) {

      if(currentLocation.lat !== values.lat){
        var n = helpers.arePointsNear(currentLocation, values, 20);
          res.send("true");
          return;
      } else {

      }
    }
          res.send("false");
});

module.exports = router;
