// declare variables for map layers
var langDots,
  underlayDots,
  queensOtln;

function updateMap() {

    //var neighborhoodChoropleth, // empty group containers
    //  neighborhoodDotDensity;

    var neighborhoodsAll = {
        type: 'FeatureCollection',
        features: data.neighborhoods.filter( (neighborhood) => {
          return neighborhood.properties.BoroCode == 4;
        })
    };

    var mapLayer = d3.select('#map-target').select('svg')
      .attr("id", "map-svg-main");

    var annoLayer = d3.select('#annotation-target').append('svg')
      .attr("id", "annotation-svg-main");

    mapLayer.attr("width", window.innerWidth)
      .attr("height", window.innerHeight);

    transform = d3.geoTransform({point: projectPoint});
    path = d3.geoPath().projection(transform).pointRadius('3');
    var pathLittleDots = d3.geoPath().projection(transform).pointRadius('0.5');

    var width = window.innerWidth,
        height = window.innerHeight;

    var q = d3.queue(1)  // concurrency of 1, sets queue to run in series
      .defer(drawChoropleth)
      .defer(drawQueensOutline)
      .defer(drawDotDensity)
      .await( (err) => {
        if (err) throw err;
      })

    function drawQueensOutline(callback) {
      d3.json("/data/queens_re.geojson", function(json) {
        queensOtln = mapLayer.append("path")
          .attr("class", "queens-outline")
          .datum(json)
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "#dbdbdb")
          .attr("stroke-width", 2)
        callback(null);
      });
    }

    function drawChoropleth(callback) {
      neighborhoodPolyGroups = mapLayer.selectAll("g")
        .data(neighborhoodsAll.features)
        .enter()
        .append("g")
        .attr("id", (d) => {
          return `nbdGroup-${d._id}`
        })

      underlayDots = neighborhoodPolyGroups.append("path")
      .datum( (d) => {
        var feature = d;
        var points =
            {
            "type": "Feature",
              "geometry": {
                "type": "MultiPoint",
                "coordinates": []
              },
              "properties": {}
            };
        points.geometry.coordinates = dotDensityPoints( 20, feature ) // looks better with something like 500, but too computationally intensive? or needs to be rewritten as non-blocking function
        return points;
      })
      .attr("d", pathLittleDots)
      .attr("fill", "gray")
      callback(null);
    }

    function drawDotDensity(callback) {


      var q = d3.queue();
        q.defer


      var languagesAll = data.languages;
      languagesAll.forEach( (language, i) => {
        var neighborhoods = language.neighborhoods;
        var thisLang = language;
        neighborhoods.forEach( (neighborhood, j) => {
          d3.select(`#nbdGroup-${neighborhood._id}`)
            .append("path")
            .datum( () => {
              var point =
                  {
                  "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": []
                    },
                    "properties": {}
                  };
              point.properties.color = thisLang.continentColor;
              point.properties.color.c = 80;
              point.properties.color.l = 85;
              point.geometry.coordinates = dotDensityPoints( 1, neighborhood.geometry )[0]
              return point;
            })
            .attr("id", (d) => { return `dot-${language._id}`})
            .attr("class", "lang-dot") // dbd-dd-dot
            .attr("d", path)
            .attr("fill", (d) => {
              return d.properties.color
            })
            .attr("stroke", (d) => {
              return d.properties.color.darker()
            })
            .attr("stroke-width", '1')
        })
      })
      langDots = d3.selectAll('.lang-dot')
      callback(null);
    }


    // update the path using the current transform
    function update() {
      console.log('called update')
      d3.selectAll('.leader-line').remove(); // remove all leader lines
      underlayDots.attr("d", pathLittleDots);
      langDots.attr("d", path);
      queensOtln.attr("d", path);
      d3.selectAll('.selected').classed('selected', false);
      d3.select('#globe-target').remove();
      d3.select('.globe-container').selectAll('text').remove();
    }


    map.on("viewreset", update)

    update();
}

function updateGlobe( item, callback ) {
  //console.log(item);
  d3.select('#overlay-target').selectAll('*').remove(); // clear globe
  var rotation = [ -item.longitude, -item.latitude ];
  var width = window.innerWidth,
      height = window.innerHeight;

  init();

  function init(){
      // set projection
      var projection = d3.geoOrthographic()
          .scale(60)
          .rotate( rotation )
          //.center( center )
          .translate([0, 0])
          .clipAngle(90);

      // initialize path generator - this is a function!
      var path = d3.geoPath()
          .projection(projection)
          .pointRadius(3);

      /*var pathLittleDots = d3.geoPath()
          .projection(projection)
          .pointRadius(1);      */

      var globeTarget = d3.select('#overlay-target').append("svg")
          .attr('id', 'overlay-svg-main')
          .attr('width', window.innerWidth)
          .attr('height', window.innerHeight)
          .append("g")
          .attr("class", "globe-container")
          .attr("transform", "translate(150, 500)") // this shouldn't be absolutely positioned...
          .on("mouseover", (d, i, n) => {
            //console.log('globe mouseover')
            //growGlobe();
          });

      //Create the base globe
      var backgroundCircle = globeTarget.append("circle")
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', projection.scale())
          .attr('class', 'globe')
          .attr("fill", "#98bde2");

      //Add all of the countries to the globe
      var continentPaths = globeTarget.selectAll("path")
          .data(data.continents)
          .enter()
          .append("path")
          .attr("class", "feature")
          .attr("fill", "#d8f2a4")
          .attr("d", path);  // this is where svg data gets added, based on data transformed through path generator

      //Add marker at the center of the globe
      var Circle = globeTarget.append("circle")
          .attr('id', 'globe-marker')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 5)
          //.attr('text-anchor', 'middle')
          //.attr('dominant-baseline', 'middle')
          //.attr('font-size', '2em')
          .attr("fill-opacity", "1")
          .attr("stroke", "black")
          .attr("stroke-width", 1.5)
          //.text("o0o0o")

      var countryList = [];
      item.countries.map( (country) => {
        countryList.push( country.properties.ADMIN );
      });

      //Add list of countries under globe
      var countryList = globeTarget.append("text")
        .attr('x', 0)
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr("fill", "black")
        .selectAll('tspan')
        .data(countryList)
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('dy', 15)
        .text(function(d) { return d });

      }
      callback(console.log('update globe'));
}// draws/redraws globe widget for highlighted language
function connectElements( selected ) {  // takes array of d3 selectors
  var coords = []
  selected.forEach( (element) => {
    console.log(element);
    console.log(element.node().getBoundingClientRect());
  })
}


function connectTwoElements( id, from, to, color ) { // draws line between two elements, expects two 2d coordinate pair arrays

    //var target = d3.select(`#ID${id}`);
    var target = d3.select('')

    target.append("path")
      .attr("d", d3.linkHorizontal()
        .source(function () { return [from[0] - to[0], from[1] - to[1]]  })
        .target(function () { return [0, 0] }))
        .attr("stroke", color)
        .attr("stroke-width", '1')
        .attr("fill", "none");

    target.append("text")
      .attr("dy", "1.5em")
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .text(function(d) { return d.properties.NTAName });

    target.append("circle")
        .attr("fill", "white")
        .attr("r", 3);
    }

// connects points on map with straight lines
// takes array of geographic coordinates, selector for target SVG
// to-do: takes array of options to determine stroke & stroke color etc.
function connectLine( coordArray, target, options ) {
  var svg = d3.select(target);
  var line = svg.append("path")  // draw straight lines
    .datum( function() {
      // add additonal points to line for tangents, leader offset etc
      let data = coordArray
      let tanLength = 0.05
      //let beginTanPt = [data[0][0], data[0][1] + tanLength]
      let endTanPt = [data[coordArray.length - 1][0], data[coordArray.length - 1][1] - tanLength]
      //data.splice( 1 , 0, beginTanPt );
      data.splice( data.length - 1 , 0, endTanPt );
      console.log(data)
      return data
    })
    .attr("d", d3.line()
      .x(function (d) { return map.latLngToLayerPoint(d).x;  })
      .y(function (d) { return map.latLngToLayerPoint(d).y; }))
      //.curve(d3.curveCardinal.tension(0.6)))
    .attr("class", "leader-line")
    .attr("stroke-width", '1')
    .attr("fill", "none");

  if (options.stroke) { line.attr("stroke", options.stroke) }
  else { line.attr("stroke", "black") }

  if (options.strokedasharray) { line.attr("stroke-dasharray", options.strokedasharray ) }

  if (options.strokewidth) { line.attr("stroke-width", options.strokewidth ) }
  else { line.attr("stroke-width", 1) }
}

// returns map coordinates of DOM element, either SVG or HTML, by ID
// to-do: be able to specify what part of the element you want (default center)
function getCoords( id, options ) {
  let box = d3.select(`#${id}`).node().getBoundingClientRect();
  let x, y, latLng;
  if (options && options.anchor) {
    switch (options.anchor) {
      case 'center':
        x = (box.width / 2) + box.left;
        y = (box.height / 2) + box.top;
        latLng = map.layerPointToLatLng([x, y]);
        return [latLng.lat, latLng.lng];
      case 'center-left':
        x = box.left;
        y = (box.height / 2) + box.top;
        latLng = map.layerPointToLatLng([x, y]);
        return [latLng.lat, latLng.lng];
    }
  } else {
    x = (box.width / 2) + box.left;
    y = (box.height / 2) + box.top;
    latLng = map.layerPointToLatLng([x, y]);
  }
  return [latLng.lat, latLng.lng];
}



function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}

function modifyMapFromList(d, i, n) {
  d.neighborhoods.forEach((neighborhood) => {

  })

  d3.selectAll('.selected')
    .classed('selected', false)
    .style('stroke', null)
    .style('border', null)
    .attr('transform', null)

  d3.select(`#dot-${d._id}`)
    .classed('selected', true)
    .style('stroke', 'black')
    //.append('text')
    //.text('Hello')

  d3.select(`#li-${d._id}`)
    .classed('selected', true)
    .style('border', '1px solid black')

  q = d3.queue(1)
    .defer(updateGlobe, d)
    .defer(connectLine,
      [
        getCoords("globe-marker"),
        getCoords(`dot-${d._id}`),
        getCoords(`li-${d._id}`, {anchor: 'center-left'})
      ],
      '#overlay-svg-main',
      {
        //stroke: d.continentColor,
        strokedasharray: '5, 5',
        strokewidth: 1
      }
    )
    .await( (err) => {
      if (err) throw err;
    });

  //updateGlobe(d);

  d3.select('.neighborhood-centers').selectAll('g').selectAll('*').remove(); // clear all other line/label group contents

  var listItemPoint = [],
      mapPoint = [],
      globePoint = [];

  var listItemBounds = d3.select( n[i] )._groups[0][0].getBoundingClientRect();
  //console.log(listItemBounds);
  listItemPoint = [listItemBounds.left, listItemBounds.top + (listItemBounds.height/2) ];

  globePoint = parseTransform(d3.select('.globe-container').attr('transform')).translate;

  d3.select('#globe-marker').attr('fill', function() {
    var colorAdjusted = d.continentColor
    colorAdjusted.l = 85;
    colorAdjusted.c = 80;
    return colorAdjusted
  })

  d3.select('#globe-marker').attr('stroke', 'black')
}
