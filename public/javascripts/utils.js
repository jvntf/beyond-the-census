/*********************** UTILITY *************************************/

function logResult(input) {
  //console.log(input);
}

function parseTransform (input) { // convert svg transform string into object
    var a= input.replace(/\s/g,'')
    var b={};
    for (var i in a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g))
    {
        var c = a[i].match(/[\w\.\-]+/g);
        b[c.shift()] = c;
    }
    return b;
}

function dotDensityPoints( numPts, geoPath ) {  //todo - rewrite without while loop (async)
  var coordArray = [];
  var bounds = d3.geoBounds(geoPath);  // returns [[left, bottom], [right, top]] in lat (top, bottom), lon (left, right)
  while (coordArray.length < numPts) {
  //for (var i = 0; i < 50; i++ ) {
      var long = d3.randomUniform(bounds[0][0], bounds[1][0])()
      var lat = d3.randomUniform(bounds[0][1], bounds[1][1])()
      if ( d3.geoContains(geoPath, [long, lat])
          && coordArray.every( (item) => { d3.geoDistance([long, lat], item) > 0.00005 })) { // 0.0000239 rad is equal to ~500 feet
        coordArray.push([long, lat])
      }
  }
  return coordArray
}
