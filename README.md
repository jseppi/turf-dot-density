# turf-dot-density

turf dotDensity module


### `turf.dot-density(fc, countProperty)`

Produces a FeatureCollection of points randomly distributed in each of the
given Polygon or MultiPolygon features based on a count property value.


### Parameters

| parameter       | type                                                 | description                                                             |
| --------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| `fc`            | Feature\.\<Polygon\>\,FeatureCollection\.\<Polygon\> | input features, must have Polygon or MultiPolygon geometries            |
| `countProperty` | String                                               | the field on which to base the number of points created in each Feature |


### Example

```js
var input = {
  "type": "FeatureCollection",
  "features": [
    {
     "type": "Feature",
     "properties": {
       "population": 33
     },
     "geometry": {
       "type": "Polygon",
       "coordinates": [
         [
           [
             -77.01210021972656,
             38.89103282648846
           ],
           [
             -77.0335578918457,
             38.896510672795266
           ],
           [
             -77.0335578918457,
             38.89904904367505
           ],
           [
             -77.00471878051758,
             38.90906804272198
           ],
           [
             -76.98360443115234,
             38.90011780426885
           ],
           [
             -77.00592041015625,
             38.890899215203014
           ],
           [
             -77.01210021972656,
             38.89103282648846
           ]
         ]
       ]
     }
   }
 ]
};

var result = turf.dotDensity(input, 'population');

//=result
```


**Returns** `FeatureCollection.<Point>`, points randomly distributed in each input Feature according to the value of that Feature's countProperty

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install turf-dot-density
```

## Tests

```sh
$ npm test
```


