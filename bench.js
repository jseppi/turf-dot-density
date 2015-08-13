var dotDensity = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var fc = JSON.parse(fs.readFileSync(__dirname + '/fixtures/in/polygons.geojson'));

var suite = new Benchmark.Suite('turf-dot-density');
suite
  .add('turf-dot-density',function () {
    dotDensity(fc, 'population');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    
  })
  .run();