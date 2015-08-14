'use strict';

var featurecollection = require('turf-featurecollection');
var inside = require('turf-inside');
var random = require('turf-random');
var extent = require('turf-extent');

/**
 * Produces a FeatureCollection of points randomly distributed in each of the
 * given Polygon or MultiPolygon features based on a count property value.
 *
 * @module turf/dot-density
 * @category interpolation
 * @param {(Feature<Polygon|MultiPolygon>|FeatureCollection<Polygon|MultiPolygon>)} fc input features
 * @param {String} countProperty the field on which to base the number of points created in each Feature
 * @return {FeatureCollection<Point>} points randomly distributed in each input Feature according to the value of that Feature's countProperty
 * @example
 * var input = {
 *   "type": "FeatureCollection",
 *   "features": [
 *     {
 *      "type": "Feature",
 *      "properties": {
 *        "population": 33
 *      },
 *      "geometry": {
 *        "type": "Polygon",
 *        "coordinates": [
 *          [
 *            [
 *              -77.01210021972656,
 *              38.89103282648846
 *            ],
 *            [
 *              -77.0335578918457,
 *              38.896510672795266
 *            ],
 *            [
 *              -77.0335578918457,
 *              38.89904904367505
 *            ],
 *            [
 *              -77.00471878051758,
 *              38.90906804272198
 *            ],
 *            [
 *              -76.98360443115234,
 *              38.90011780426885
 *            ],
 *            [
 *              -77.00592041015625,
 *              38.890899215203014
 *            ],
 *            [
 *              -77.01210021972656,
 *              38.89103282648846
 *            ]
 *          ]
 *        ]
 *      }
 *    }
 *  ]
 * };
 *
 * var result = turf.dotDensity(input, 'population');
 *
 * //=result
 */
module.exports = function dotDensity(fc, countProperty) {
  if (!fc || !countProperty) {
    throw new Error("Both arguments are required");
  }

  //normalize if given a Feature
  if (fc.type === 'Feature') {
    fc = featurecollection([fc]);
  }

  //if still not a FeatureCollection, throw
  if (fc.type !== 'FeatureCollection') {
    throw new Error("First argument must be a FeatureCollection");
  }

  if (typeof countProperty !== 'string') {
    throw new Error("countProperty must be a string");
  }

  var pointsFc = fc.features.reduce(function (acc, feat) {

    if (feat.geometry.type !== 'Polygon' && feat.geometry.type !== 'MultiPolygon') {
      throw new Error('All features must have Polygon or MultiPolygon geometries');
    }

    var count = feat.properties[countProperty];
    //return early if the property doesn't exist or isn't an integer
    if (!count || !isInt(count) || count <= 0) {
      return acc;
    }

    var points = pointsInFeature(feat, feat.properties[countProperty]);
    acc.features = acc.features.concat(points);
    return acc;
    
  }, featurecollection([]));

  return pointsFc;
};

function isInt(x) {
  return (typeof x === 'number') && (x % 1 === 0);
}

//returns array of point features
function pointsInFeature(feat, numPoints) {
  var points = [];
  for (var i = 0; i < numPoints; i++) {
    points.push(pointInFeature(feat));
  }
  return points;
}

//returns point feature
function pointInFeature(feat) {
  var candidate;
  var bbox = extent(feat);
  //create a candidate random point in the bbox
  // and keep doing that until the random point falls inside the feature
  do {
    candidate = random('point', 1, {bbox: bbox}).features[0];
  } while (!inside(candidate, feat));

  return candidate; //return the point feature
}
