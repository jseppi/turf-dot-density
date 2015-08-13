var test = require('tape');
var fs = require('fs');
var dotDensity = require('./');
var count = require('turf-count');
var within = require('turf-within');

function fileAsJson(path) {
  return JSON.parse(fs.readFileSync(path));
}

test('bad inputs', function (t) {
  t.throws(dotDensity); //must have arguments

  t.throws(function () {
    dotDensity({}); //must have two arguments
  });

  t.throws(function () {
    //first argument must be a Feature or FeatureCollection
    dotDensity({type: 'Line'}, 'population');
  });

  t.throws(function () {
    //second argument must be a string
    dotDensity({type: 'Feature'}, 123);
  });

  t.throws(function () {
    //must be Polygon or MultiPolygon features
    var fc = fileAsJson(__dirname + '/fixtures/in/linestring.geojson');
    dotDensity(fc, 'population');
  });

  t.end();
});

var fixtures = {
  singlePolygon: '/fixtures/in/polygon.geojson',
  singleConcavePolygon: '/fixtures/in/concavePolygon.geojson',
  singleMultiPolygon: '/fixtures/in/multiPolygon.geojson',
  multiplePolygons: '/fixtures/in/polygons.geojson'
};

Object.keys(fixtures).forEach(function (key) {
 test(key, function (t) {
    var fc = fileAsJson(__dirname + fixtures[key]);
    var points = dotDensity(fc, 'population');
    t.ok(points, 'returns object');

    t.equals(points.type, 'FeatureCollection');

    var expectedTotal = fc.features.reduce(function (total, f) {
      return total + f.properties.population;
    }, 0);
    
    t.equals(expectedTotal, points.features.length);

    count(fc, points, 'pointCount');
    fc.features.forEach(function (f) {
      t.equals(f.properties.pointCount, f.properties.population);
    });

    var pointsWithin = within(points, fc);
    t.equals(pointsWithin.features.length, points.features.length);

    points.features.push(referenceFeature(fc.features[0]));
    fs.writeFileSync(__dirname + '/fixtures/out/' + key + '.geojson', JSON.stringify(points));
    t.end();
  });
});

test('missing count property', function (t) {
  var fc = fileAsJson(__dirname + '/fixtures/in/polygon.geojson');
  var points = dotDensity(fc, 'missingProp');
  t.ok(points, 'returns object');
  t.equals(points.features.length, 0);
  t.end();
});

function referenceFeature (feat) {
  feat.properties = {
    'fill-opacity': 0,
    'stroke': '#0ff'
  };
  return feat;
}