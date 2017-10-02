var express = require('express');
var router = express.Router();

var NodeCache = require('node-cache');
const locationCache = new NodeCache( { stdTTL: 0, checkperiod: 0 , useClones: false} );

var storage = require('node-persist');

//you must first call storage.initSync
storage.initSync();

/* GET users listing. */
router.get('/', function(req, res, next) {

  function arePointsNear(checkPoint, centerPoint, km) {
      var ky = 40000 / 360;
      var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
      var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
      var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
      return Math.sqrt(dx * dx + dy * dy) <= km;
  }

  var currentLocation = { lat: req.query.lat, lng: req.query.lng };

  var obj = storage.getItemSync('locationKey');
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
    for (let values of locationArray) {

      if(currentLocation.lat !== values.lat){
        var n = arePointsNear(currentLocation, values, 20);
          res.send("true");
          return;
      } else {

      }
    }
          res.send("false");
});

module.exports = router;
