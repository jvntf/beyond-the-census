// declare variables for map layers
var langDots,
  underlayDots,
  underlayTracts,
  queensOtln
  nbdGroups
  nbdOtlns;

function updateMap() {

    var neighborhoodsAll = {
        type: 'FeatureCollection',
        features: data.neighborhoods.filter( (neighborhood) => {
          return neighborhood.properties.BoroCode == 4;
        })
    };

    var mapLayer = d3.select('#map-target').select('svg');
    mapLayer.selectAll('*').remove();
    mapLayer.attr("id", "map-svg-main")
      .raise()
      .attr('pointer-events', 'all')

    mapLayer.append('g').attr('id', 'map-censustracts') // initialize map groups
    mapLayer.append('g').attr('id', 'map-queensotln')
    mapLayer.append('g').attr('id', 'map-dotdensity')

    d3.select('#drawing-container').select('svg')

    var annoLayer = d3.select('#annotation-target');
    annoLayer.selectAll('*').remove();
    annoLayer.append('svg')
      .attr("id", "annotation-svg-main");

    mapLayer.attr("width", window.innerWidth)
      .attr("height", window.innerHeight);

    transform = d3.geoTransform({point: projectPoint});
    path = d3.geoPath().projection(transform).pointRadius('4');
    var pathLittleDots = d3.geoPath().projection(transform).pointRadius('0.5');

    var width = window.innerWidth,
        height = window.innerHeight;

    var q = d3.queue(1)  // concurrency of 1, sets queue to run in series
      .defer(drawNeighborhoodGroups)
      .defer(drawQueensOutline)
      .defer(drawDotDensity)
      .await( (err) => {
        if (err) throw err;
        update();
      })

    function drawQueensOutline(callback) {
      var outlineLayer = d3.select('#map-queensotln')
      d3.json("/data/queens_re.geojson", function(json) {
        queensOtln = outlineLayer.append("path")
          .attr("class", "queens-outline")
          .datum(json)
          .attr("d", path)
          .attr("fill", "none")
          .attr("stroke", "#dbdbdb")
          .attr("stroke-width", 2)
        callback(null);
      });
    }

    function drawNeighborhoodGroups(callback) {
      nbdGroups = d3.select('#map-dotdensity').selectAll("g")
        .data(neighborhoodsAll.features)
        .enter()
        .append("g")
        .attr("id", (d) => {
          return `nbdGroup-${d._id}`
        })

      nbdOtlns = nbdGroups.append("path")
        .attr("d", path)
        .attr('fill', 'none')
        .attr('stroke', 'none')


      callback(null);
    }

  /*  function drawChoropleth(callback) {
      underlayDots = mapLayer.selectAll('#nbdGroup*').append("path")
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
        points.geometry.coordinates = dotDensityPoints( 5, feature ) // looks better with something like 500, but too computationally intensive? or needs to be rewritten as non-blocking function
        return points;
      })
      .attr("d", path)
      .attr("fill", "gray")
      .attr("pointer-events", "all") // need to enable pointer events for d3 onclick to

      callback(null);
    } */

    function drawDotDensity(callback) {

      var languagesAll = data.languages;
      languagesAll.forEach( (language, i) => {
        var neighborhoods = language.neighborhoods;
        var thisLang = language;
        neighborhoods.forEach( (neighborhood, j) => {


        d3.select(`#nbdGroup-${neighborhood._id}`)
            .append('circle')
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
              point.properties.color = thisLang.color;
              point.properties.neighborhood = neighborhood.properties.NTAName;
              point.properties.language = language;
              point.geometry.coordinates = dotDensityPoints( 1, neighborhood.geometry )[0]
              return point;
            })
            .attr("id", (d) => { return `dot-${language._id}-${j}`}) // give dot an id in the format 'dot-' + [language ID] + neighborhood-index
            .attr("class", "lang-dot") // dbd-dd-dot
            .attr('cx', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x })
            .attr('cy', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y })
            .attr('r', '3')
            .attr('fill', (d) => { return d.properties.color })
            .on('click', (d) => {
              console.log(d)
              console.log(`you clicked the circle ${d.properties.language.language}`)
              modifyMapFromList(d.properties.language._id);
            })

        /*  d3.select(`#nbdGroup-${neighborhood._id}`)   // old one, draws paths not circles
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
              point.properties.color = thisLang.color;
              //point.properties.color.c = 80;
              //point.properties.color.l = 85;
              point.geometry.coordinates = dotDensityPoints( 1, neighborhood.geometry )[0]
              return point;
            })
            .attr("id", (d) => { return `dot-${language._id}-${j}`}) // give dot an id in the format 'dot-' + [language ID] + neighborhood-index
            .attr("class", "lang-dot") // dbd-dd-dot
            .attr("d", path)
            .attr("fill", (d) => {
              return d.properties.color
            })
*/


            //.attr("stroke", "white")
            //.attr("stroke-width", "1")
            //.attr("stroke", (d) => {
            //  return d.properties.color.darker() })
            //.attr("stroke-width", '2')
        })
      })
      langDots = d3.selectAll('.lang-dot')
      callback(null);
    }

    map.on("moveend",  () => {
      langDots.classed('hidden', true);
      update();

    })

}

// update the path using the current transform
function update() {
  d3.selectAll('.leader-line').remove(); // remove all leader lines
  //underlayDots.attr("d", pathLittleDots);
  //langDots.attr("d", path);
  nbdOtlns.attr('d', path);
  langDots.attr('cx', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x })
      .attr('cy', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y })
      .classed('hidden', false);
  queensOtln.attr("d", path);
  //underlayTracts.attr("d", path);

  d3.selectAll('.selected').classed('selected', false);
  //d3.select('#globe-target').remove();
  d3.select('#globe-container').selectAll('text').remove();

  // update census tract underlay
  d3.select('#map-censustracts').selectAll('path')
    .attr('fill', 'gray')
    .attr('fill-opacity', (d, i, n) => {
      var tractArea = d.properties.ALAND;
      var quant = d.properties[input.underlay];
      var valueRaw = quant / tractArea; // quantity per area

      // normalize by area or total?

      var scaler = d3.scaleLinear()
          .domain([0, 0.001]) // this should be based on the range of all values in the dataset..
          .range([0, 0.5]);

      //console.log(d.properties[input.underlay])
      //console.log(scaler(valueRaw))
      return scaler(valueRaw)
    })
}


// draws/redraws globe widget for highlighted language
function connectElements( selected ) {  // takes array of d3 selectors
  var coords = []
  selected.forEach( (element) => {
    //console.log(element);
    //console.log(element.node().getBoundingClientRect());
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
      //let endTanPt = [data[coordArray.length - 1][0], data[coordArray.length - 1][1] - tanLength]
      //data.splice( 1 , 0, beginTanPt );
      //data.splice( data.length - 1 , 0, endTanPt );
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

function modifyMapFromList( id ) {  // rewrite to take a language id

  //console.log(id)

  var dataItem,
    dataIndex;

  dataItem = data.languages.find( (item) => {
    return item._id == id;
  })

  dataIndex = data.languages.findIndex( (item) => {
    return item._id == id;
  })

  //console.log(dataItem);
  //onsole.log(dataIndex);

  var overlayTarget = d3.select('#overlay-target').select('svg')
  overlayTarget.selectAll('g').remove();
  overlayTarget.append('g').attr('id', 'leader-lines');
  var neighborhoodGroups = d3.select('#map-dotdensity').selectAll('g')
  neighborhoodGroups.selectAll('path').attr('stroke', 'none');
  neighborhoodGroups.selectAll('text').remove();

  console.log(neighborhoodGroups)
  updateGlobe(dataItem);

  dataItem.neighborhoods.forEach((neighborhood, i) => {
    //console.log(`index ${i}: ${neighborhood.properties.NTAName}`)

    d3.selectAll('.selected')
      .classed('selected', false)
      .style('stroke', null)
      .style('border', null)
      .attr('transform', null)

    var langDot = d3.select(`#dot-${dataItem._id}-${i}`);
    var dotCenter = langDot.node().getBoundingClientRect();

    langDot.classed('selected', true)

    var nbdGroup = d3.select(`#nbdGroup-${neighborhood._id}`);

    nbdGroup.select('path').attr('stroke', 'gray');

    nbdGroup.append('text')
      .text((d) => {
        console.log(d)
        return d.properties.NTAName})
      .attr('fill', 'black')
      .attr("text-anchor", "middle")
      .attr('font', 'inherit')
      .attr('x', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x })
      .attr('y', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y })

    d3.select(`#li-${dataItem._id}`)
      .classed('selected', true)
      //.style('border', '1px solid black')

    connectLine(
        [
          getCoords("globe-marker"),
          getCoords(`dot-${dataItem._id}-${i}`),
          getCoords(`li-${dataItem._id}`, {anchor: 'center-left'})
        ],
        '#leader-lines',
        {
          stroke: 'gray', // was d.color
          strokedasharray: '5, 5',
          strokewidth: 1
        }
      )

  })

  d3.select('.neighborhood-centers').selectAll('g').selectAll('*').remove(); // clear all other line/label group contents

  var listItemPoint = [],
      mapPoint = [],
      globePoint = [];

  var listItemBounds = d3.select(`#li-${dataItem._id}`)._groups[0][0].getBoundingClientRect();
  //console.log(listItemBounds);
  listItemPoint = [listItemBounds.left, listItemBounds.top + (listItemBounds.height/2) ];

  //globePoint = parseTransform(d3.select('#globe-container').attr('transform')).translate;
  globePoint = getCoords('globe-marker')

  d3.select('#globe-marker').attr('fill', function() {
    var colorAdjusted = dataItem.color
    colorAdjusted.l = 85;
    colorAdjusted.c = 80;
    return colorAdjusted
  })

  d3.select('#globe-marker')//.attr('stroke', 'black')
}

/* function drawTracts( callback ) {
  d3.json('data/queenslanguages_census.geojson', (json) => {

          //console.log(json.features)
          // returns array of objects (one for each tract/row in the csv)

          // from list of object keys, populate dropdown list
          var optionList = Object.keys(json.features[0].properties);
          d3.select('#underlay-dropdown').selectAll('option').remove();

          var menuitems = d3.select('#underlay-dropdown').selectAll('option')
            .data( optionList )
            .enter()
            .append('option')
            .attr('value', (d) => { return d })
            .append('text')
            .text( (d) => { return d })

          // each object, use one property or a combination to determine values for choropleth
          // based on selector

          underlayTracts = d3.select('#map-censustracts')
            .selectAll('path')
            .data(json.features)
            .enter().append('path')
            .attr('d', path)
            .attr('fill', 'none')
            .attr('stroke', 'rgb(222, 222, 222)')
            .attr('stroke-width', '0.5px')

    //console.log(json);
  })
  callback(null);
} */
