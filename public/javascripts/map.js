// declare variables for map layers
var path,
  transform,
  langDots,
  underlayDots,
  underlayTracts,
  queensOtln,
  nbdGroups,
  nbdOtlns;


function drawDotMap() {
    var width = window.innerWidth,
        height = window.innerHeight;

    //var input = data.main;  // use same data tree as list so it can dynamically update
    // console.log(data.main);

    // flattened language list from data.main nested list
    var listFlattened = []
    data.main.forEach( (item) => {
      item.values.forEach( (subitem) => {
        subitem.values.forEach( (subsubitem ) => {
          listFlattened.push(subsubitem);
        });
      })
    })

    // reset/initialize main d3 map layer
    var mapLayer = d3.select('#map-target').select('svg');
    mapLayer.selectAll('*').remove();
    mapLayer.attr("id", "map-svg-main")
      .raise()
      .attr('pointer-events', 'all')

    // set map layer to fit window to-do --> needs to adjust when window changes size
    mapLayer.attr("width", window.innerWidth)
      .attr("height", window.innerHeight);

    // set up layer groups for different features
    //mapLayer.append('g').attr('id', 'map-censustracts') // initialize map groups
    //mapLayer.append('g').attr('id', 'map-queensotln')
    mapLayer.append('g').attr('id', 'map-dotdensity')
    mapLayer.append('g').attr('id', 'map-neighborhoodotlns')

    // set up annotation layer (separate svg that doesn't pan/zoom with map)
    var annoLayer = d3.select('#annotation-target');
    annoLayer.selectAll('*').remove();
    annoLayer.append('svg')
      .attr("id", "annotation-svg-main");

    transform = d3.geoTransform({point: projectPoint});
    path = d3.geoPath().projection(transform);

    // queue, controls sequence of execution
    var q = d3.queue(1)  // concurrency of 1, sets queue to run in series
      //.defer(drawNeighborhoodGroups)
      //.defer(drawQueensOutline)
      //.defer(drawDotDensity)
      .defer( drawLanguageDots )
      .defer( drawNeighborhoods )
      .await( (err) => {
        if (err) throw err;
        update();
      })

    // functions
    function drawLanguageDots(callback) {
      var languagesAll = listFlattened;
      console.log(languagesAll)
      languagesAll.forEach( (language, i) => {
        var neighborhoods = language.neighborhoods;
        var thisLang = language;
        neighborhoods.forEach( (neighborhood, j) => {
        d3.select('#map-dotdensity')
        //d3.select(`#nbd-${neighborhood._id}`)
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
            .attr('r', '4')
            .attr('fill', 'none')
            .attr('stroke', (d) => { return d.properties.color })
            .attr('stroke-width', '2')
            .on('click', (d) => {
              console.log(d)
              console.log(`you clicked the circle ${d.properties.language.language}`)
              modifyMapFromList(d.properties.language._id);
              updateLanguageCard(d.properties.language._id);
            })
        })
      })
      langDots = d3.selectAll('.lang-dot')
      callback(null);
    }

    function drawNeighborhoods(callback) {
      nbdOtlns = d3.select('#map-neighborhoodotlns').selectAll("path")
        .data(data.neighborhoods)
        .enter()
        .append("path")
        .attr("id", (d) => {
          console.log(d)
          return `nbd-${d._id}`
        })
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "none")

    //  nbdOtlns = nbdGroups.append("path")
    //    .attr("d", path)
    //    .attr('fill', 'none')
    //    .attr('stroke', 'none')

      callback(null);
    }

    // event listener for map pan/zoom
    map.on("moveend",  () => {
      // hide stuff
      langDots.classed('hidden', true);
      // call update
      update();
    })
}

/*
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
          return `nbd-${d._id}`
        })
      nbdOtlns = nbdGroups.append("path")
        .attr("d", path)
        .attr('fill', 'none')
        .attr('stroke', 'none')
      callback(null);
    }

    function drawDotDensity(callback) {
      var languagesAll = data.languages;
      languagesAll.forEach( (language, i) => {
        var neighborhoods = language.neighborhoods;
        var thisLang = language;
        neighborhoods.forEach( (neighborhood, j) => {
        d3.select(`#nbd-${neighborhood._id}`)
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
              updateLanguageCard(d.properties.language._id);
            })
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
*/

// update the path using the current transform
function update() {
  d3.selectAll('.leader-line').remove(); // remove all leader lines
  d3.selectAll('.selected').classed('selected', false); // remove 'selected' class from everything
  nbdOtlns.attr('d', path);
  langDots.attr('cx', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x })
      .attr('cy', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y })
      .attr('r', (d) => {
        var deltaZoom = map.getZoom() - zoomInitial;
        return deltaZoom*50 + 3.5 ;
      })
      .classed('hidden', false);
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
      case 'center-right':
        x = box.right;
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

  var dataItem,
    dataIndex;

  dataItem = data.languages.find( (item) => {
    return item._id == id;
  })

  dataIndex = data.languages.findIndex( (item) => {
    return item._id == id;
  })

  var overlayTarget = d3.select('#overlay-target').select('svg')
  overlayTarget.selectAll('g').remove();
  overlayTarget.append('g').attr('id', 'leader-lines');

  var neighborhoodGroups = d3.select('#map-dotdensity').selectAll('g')
  neighborhoodGroups.selectAll('path').attr('stroke', 'none');
  neighborhoodGroups.selectAll('text').remove();

  console.log(neighborhoodGroups)
  updateGlobe(dataItem);

  dataItem.neighborhoods.forEach((neighborhood, i) => {

    d3.selectAll('.selected')
      .classed('selected', false)
      .style('stroke', null)
      .style('border', null)
      .attr('transform', null)

    var langDot = d3.select(`#dot-${dataItem._id}-${i}`);
    langDot.attr('stroke', 'black');

    var dotCenter = langDot.node().getBoundingClientRect();

    langDot.classed('selected', true)

    var nbdGroup = d3.select(`#nbd-${neighborhood._id}`);

    nbdGroup.select('path')
      .attr('stroke', 'gray');

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
      .style('border', '1px solid black')

    connectLine(
        [
          getCoords("globe-marker"),
          getCoords(`nbd-${dataItem.properties._id}`),
          getCoords(`li-${dataItem._id}`, {anchor: 'center-right'})
        ],
        '#leader-lines',
        {
          stroke: 'black', // was d.color
          //strokedasharray: '5, 5',
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
