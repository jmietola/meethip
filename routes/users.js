var express = require('express');
var router = express.Router();

var NodeCache = require('node-cache');
const locationCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

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

  // Init empty cache
  if (typeof obj === 'undefined') {
    var obj = {
    locations: [{ lat: req.query.lat, lng: req.query.lng }]
    };
  }

  locationCache.get( "locationKey", function( err, value ){
    if( !err ){
      if(value == undefined){
        // key not found
      }else{
        for (let values of value.locations) {
          console.log("value", values);
          if(currentLocation.lat !== values.lat){
            var n = arePointsNear(currentLocation, values, 20);
          } else{
            console.log("identical location either self or unhip person");
          }

          if(n === 'true'){
            res.send("Found hip wanna chat?");
          }

        }
            res.send("No hips found near from you.");
      }
    }
  });

  if(obj.locations.length > 0){
    obj.locations.push(currentLocation);
  }

  locationCache.set( "locationKey", obj, function( err, success ){
    if( !err && success ){
      // true
    }
  });

});

module.exports = router;
