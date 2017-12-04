// declare variables for map layers
var path,
  institutionData,
  transform,
  institutionDots,
  institutionDotLabels,
  institutionGroups,
  neighborhoodGroups,
  neighborhoodSymbolGroup,
  institutionBarChart,
  underlayDots,
  underlayTracts,
  queensOtln,
  nbdGroups,
  nbdOtlns;

function mapShowSelected() { // hide everything not in the selection group list
  d3.selectAll('.map.lang').classed('map-hidden', true);
  state.langGroup.forEach( (item) => {
    let langId = item._id;
    d3.selectAll(`.map.lang-${langId}`).classed('map-hidden', false);
  })
}

function mapHighlightSingle(langid) {
  d3.selectAll('.map.lang').classed('map-unhighlight', true);
  d3.selectAll(`.map.lang-${langid}`).classed('map-unhighlight', false);
}

function mapUnHighlight() {
  d3.selectAll('.map.lang').classed('map-unhighlight', false);
}

function mapShowAll() {
  d3.selectAll('.map.lang').classed('map-hidden', false);
}

function drawDotMap() {
    var mapContainer = d3.select('#map-target').node().getBoundingClientRect();
    //console.log(mapContainer)
    var mapWidth = mapContainer.width,
        mapHeight = mapContainer.height;

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

    //console.log(institutionData)

    // reset main map overlay
    d3.select("#map-svg-main").selectAll('*').remove();



    // set map layer to fit window to-do --> needs to adjust when window changes size
    mapLayer.attr("width", mapWidth)
      .attr("height", mapHeight);

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
      .defer( drawNeighborhoods )
      .defer( drawLanguageDots )
      .defer( bringDotsToFront )
      .await( (err) => {
        if (err) throw err;
        update();
      })

    // functions


    function drawLanguageDots(callback) {

      institutionGroups = d3.select('#map-dotdensity').selectAll('g')
        .data(data.institutions)
        .enter()
        .append('g')
        .attr('transform', (d) => {
          console.log()
          return `translate(${map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x}, ${map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y})`
        })
        .on('click', (d) => {
          //console.log(d.properties.institution)
        })

      var barChartSquares = institutionGroups.append('g').selectAll('rect')
        .data((d) => { return d.properties.languages})
        .enter()
        .append('rect')
        .attr('x', -3)
        .attr('y', (d, i) => {return i*-6-6})
        .attr('width', '6')
        .attr('height', '6')

        //.attr('cy', (d, i) => { return i*4 })
        //.attr('r', () => { return map.getZoom() * 0.25
        //})
        //.attr('height', (d) => {return 10} )
        .attr('stroke', 'transparent')
        .attr('class', (d, i) => {
            let lang = state.langAll.find( (item) => {
              return item._id == d
            })
            return `map lang lang-${lang._id} cont-${lang.continents[0]._id} leaflet-interactive`
          })
        .attr('fill', (d) => {
            let lang = state.langAll.find( (item) => {
              return item._id == d
            })
            return lang.color
          })
        .on('click', (d) => {
          //let lang = state.langAll.find( (item) => {
          //  return item._id == d
          //})
          selectSingleLang(d);
        })
        .style('cursor', 'pointer')

      callback(null);
    }

    function drawNeighborhoods(callback) {

      var neighborhoodGroups = d3.select('#map-neighborhoodotlns').selectAll("g")
        .data(() => {
          let filtered = data.neighborhoods.filter( (item) => {
            return item.properties.BoroCode == 4 && item.properties.languages.length > 0;
          })
          return filtered;
        })
        .enter()
        .append("g")
        .attr("id", (d) => {
          //console.log(d)
          return `nbd-group-${d._id}`
        })
        .attr('class', 'map nbd')

        neighborhoodOutlines = neighborhoodGroups.append("path")
          .attr('class', (d) => {
            //console.log(d)
            return `otln nbd-${d._id}`
          })
          .attr("d", path)
          .attr('fill', 'none')
          .attr('stroke', 'transparent')
          //.attr('stroke-dasharray', '3, 3')


        // neighborhood symbol (translated)
        neighborhoodSymbolGroup = neighborhoodGroups.append('g').attr('transform', (d) => {
                  return `translate(${map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x} ${map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y})`
                })


        var neighborhoodSymbol = neighborhoodSymbolGroup.append('g')



        //leader
        //neighborhoodSymbolGroup.append('line')
        //  .attr('x1', 0)
        //  .attr('y1', 0)
        //  .attr('x2', 0)
        //  .attr('y2', 5)
        //  .attr('stroke', 'grey')

        /*// symbol bounding box
        neighborhoodSymbol.append('rect')
          .attr('stroke', 'rgba(150,150,150,0.7)')
          .attr('stroke-width', '2px')
          .attr('fill', 'none')
          //.attr('x', (d, i, n) => {return Math.round(n.length/2)*-6+6})
          //.attr('y', (d) => {return '-9'})
          .attr('height', (d) => {return '12'})
          .attr('width', (d, i, n) => {return Math.round(d.properties.languages.length/2)*6})
        callback(null);*/

        neighborhoodSymbol.selectAll('rect')
          .data((d) => { return d.properties.languages})
          .enter()
          .append('rect')
          .attr('y', (d, i, n) => {
            switch (i < n.length * 0.5) {
              case true:
                return '0'
                break;
              case false:
                return '6'
                break;
            }
          })
          .attr('x', (d, i, n) => {
            switch (i < n.length * 0.5) {
              case true:
                return i*6;
                break;
              case false:
                return ((i-Math.round(n.length/2))*6)
                break;
              }
          })
          .attr('width', '6')
          .attr('height', '6')
          .attr('stroke', 'transparent')
          .attr('class', (d, i) => {
              let lang = state.langAll.find( (item) => {
                return item._id == d
              })
              return `map lang lang-${lang._id} cont-${lang.continents[0]._id} leaflet-interactive`
            })
          .attr('fill', (d) => {
              let lang = state.langAll.find( (item) => {
                return item._id == d
              })
              return lang.color
            })
            .on('click', (d) => {
              scrollList(d, () => {
                selectSingleLang(d);
              })
            })
            .style('cursor', 'pointer');

        neighborhoodSymbol.attr('transform', (d) => {return `translate( ${-6*Math.round(d.properties.languages.length/2)/2} -6 )`})

        //label
        var neighborhoodTextGroup = neighborhoodSymbolGroup.append('g')
        neighborhoodTextGroup.append('text')
          .attr('fill', 'rgba(150,150,150,0.7)')
          .attr('text-anchor', 'middle')
          .attr('font-family', 'UniversNextW01-Regular')
          .attr('font-size', '9px')
          .attr('font-weight', '700' )
          .attr('transform', 'translate(0, 9)')
          .tspans(function(d) {
              return d3.wordwrap(d.properties.NTAName, 15);  // break line after 15 characters
            }).attr('dy', '1em')
          .style('cursor', 'pointer')
          .on('click', (d) => {

            console.log(d.parent)
            state.filters.localAttr = {key: 'neighborhoods', value: d.parent._id}

            console.log(state.filters.localAttr)

            applyFilters();

              // one option: zoom to neighborhood when clicked
              var d3bounds = d3.geoBounds(d.parent);
              var padCalc = window.innerWidth * 0.25
              var flipped = [ d3bounds[0].reverse(), d3bounds[1].reverse() ] // need to reorder array bc d3 and leaflet use lon, lat and lat, lon respectively
              map.flyToBounds(flipped, {paddingTopLeft: [ padCalc,10 ], paddingBottomRight: [ padCalc,10 ]} );

              //updateNeighborhoodCard(d.parent._id)

            });

          neighborhoodTextGroup.on('mouseover', (d, i, n) => {
                      var group = d3.select(n[i])
                      var otln = d3.select(`.otln.nbd-${d._id}`).attr('stroke', 'rgba(150,150,150,0.7)').attr('stroke-dasharray', '4, 4')
                      group.selectAll('text').attr('fill', 'black')
                    })
                    .on('mouseout', (d, i, n) => {
                      var group = d3.select(n[i])
                      var otln = d3.select(`.otln.nbd-${d._id}`).attr('stroke', 'transparent')

                      group.selectAll('text').attr('fill', 'rgba(150,150,150,0.7)')
                    });

          //.text((d) => { return d.properties.NTAName})

        // dashed circle for ambiguous geography
        /*neighborhoodSymbolGroup.append("circle")
        .attr('cx', '0')
        .attr('cy', '5')
        .attr('r', '12')
        .attr("id", (d) => {
          //console.log(d)
          return `nbd-${d._id}`
        })
        .attr("stroke", "rgba(0,0,0,0.2")
        .attr('stroke-dasharray', '3, 3')
        .attr("fill", "transparent")
        .attr("class", "leaflet-interactive nbd-otln")
        .lower()
        .on('click', (d) => {
            //console.log(d)
            if (d.properties.BoroCode == 4 || d.properties.NTAName == "Rikers Island") {

            d3.selectAll('.nbd-selected').classed('nbd-selected', false);
            d3.select(`#nbd-${d._id}`).classed('nbd-selected', true);
            updateNeighborhoodCard(d);

              // one option: zoom to neighborhood when clicked
             var d3bounds = d3.geoBounds(d);
              //var padCalc = window.innerWidth * 0.25

              var flipped = [ d3bounds[0].reverse(), d3bounds[1].reverse() ] // need to reorder array bc d3 and leaflet use lon, lat and lat, lon respectively
              map.flyToBounds(flipped, {paddingTopLeft: [ window.innerWidth * 0.23 + 10, 10 ], paddingBottomRight: [ window.innerWidth * 0.22 + 10 , 10 ]} );

              // another option: show connections to all relevant languages when clicked
              console.log(d)
              d.properties.languages.forEach( (id) => {
                connectLine(
                    [
                      getCoords(`nbd-${d._id}`),
                      getCoords(`li-${id}`, {anchor: 'center-right'})
                    ],
                    '#leader-lines',
                    {
                      stroke: 'black',
                      //strokedasharray: '5, 5',
                      strokewidth: 1
                    }
                  )

              })
            }
          }) */

        callback(null);
      }

    function bringDotsToFront(callback) {
      d3.select('#map-dotdensity').raise()
      callback(null)
    }

    // event listener for map pan/zoom
    map.on("moveend",  () => {
      //institutionDots.classed('hidden', true);       // hide stuff
      update();      // call update
    })
}


function connectCurve( sourceCoords, targetCoords, parentElement, options ) {
  //console.log(parentElement)
  var data = [sourceCoords, targetCoords];

  var parent = d3.select(parentElement);

  var line = parent.append("path")  // draw straight lines
    .attr("d", d3.linkHorizontal()
      .source(function () { return path([sourceCoords]);  })
      .target(function () { return path([targetCoords]); }))
      .attr("stroke", "black")

  if (options.stroke) { line.attr("stroke", options.stroke) }
  else { line.attr("stroke", "black") }

  if (options.strokedasharray) { line.attr("stroke-dasharray", options.strokedasharray ) }

  if (options.strokewidth) { line.attr("stroke-width", options.strokewidth ) }
  else { line.attr("stroke-width", 1) }
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

function connectLineMulti( coordArray ) {

}

function getCoordsMulti( selector ) {
  let elems = d3.selectAll(selector).nodes();
  let coords = elems.map( (item) => {
    let box = item.getBoundingClientRect();
    let x = (box.width / 2) + box.left;
    let y = (box.height / 2) + box.top;
    return [x, y]
  })
  return coords;
}

// returns map coordinates of DOM element, either SVG or HTML, by ID
// to-do: be able to specify what part of the element you want (default center)
function getCoords( id, options ) {
  //let box = d3.select(`#${id}`).node().getBoundingClientRect();
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

function modifyMapFromList( id, callback ) {  // rewrite to take a language id

  var dataItem = state.langAll.find( (item) => { return item._id == id; })
  var dataIndex = state.langAll.findIndex( (item) => { return item._id == id; })

  var langLabels = d3.selectAll('.language-item')
  var langDots = d3.selectAll('.lang-dot')
  var globeMarker = d3.select('#globe-marker')
  var leaderLines = d3.select('#leader-lines')
  var neighborhoods = d3.select('#map-neighborhoodotlns')

  //console.log(dataItem)


    //globeMarker.attr('stroke', () => { return dataItem.color.darker().darker() })


    //connectCurve(
    //  getCoords(`nbd-${neighborhood._id}`),
    //  getCoords(`li-${dataItem._id}`, {anchor: 'center-right'}),
    //  '#leader-lines',
    //  {
    //    stroke: 'black', // was d.color
    //    //strokedasharray: '5, 5',
    //    strokewidth: 1
    //  }
    //)
    updateGlobe(dataItem);

    /*connectLine(
        [
          getCoords("globe-marker", {anchor: 'center-left'}),
          getCoords(`dot-${dataItem._id}-${i}`),
          getCoords(`li-${dataItem._id}`, {anchor: 'center-right'})
        ],
        '#leader-lines',
        {
          stroke: 'rgba(150,150,150,0.7)',
          //strokedasharray: '5, 5',
          strokewidth: 1
        }
      )*/

  //})

  //d3.select('.neighborhood-centers').selectAll('g').selectAll('*').remove(); // clear all other line/label group contents

  var listItemPoint = [],
      mapPoint = [],
      globePoint = [];

  //var listItemBounds = d3.select(`#li-${dataItem._id}`)._groups[0][0].getBoundingClientRect();
  //console.log(listItemBounds);
  //listItemPoint = [listItemBounds.left, listItemBounds.top + (listItemBounds.height/2) ];

  //globePoint = parseTransform(d3.select('#globe-container').attr('transform')).translate;
  //globePoint = getCoords('globe-marker')

  d3.select('#globe-marker').attr('fill', () => {return dataItem.color })
    .attr('stroke', () => { return dataItem.color.darker().darker() })

  if (callback) { callback(null) }
}

// update the path using the current transform
function update() {
  hideDetails();
  d3.selectAll()
  //d3.select('#map-neighborhoodotlns').selectAll('#').attr('fill', 'none')
  d3.selectAll('.lang-dot').attr('fill-opacity', '0.2').attr('stroke-opacity', '1') // reset all dots
  d3.select('#leader-lines').selectAll('*').remove(); //remove leader lines and text.
  d3.selectAll('.leader-line').remove(); // remove all leader lines
  //d3.selectAll('.nbd-otln').attr('stroke', 'transparent')
  d3.selectAll('.selected').classed('selected', false); // remove 'selected' class from everything
  //nbdOtlns.attr('d', path);

  /*institutionDotLabels.attr('x', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x })
          .attr('y', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y })*/

  /*institutionDots.attr('cx', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x })
      .attr('cy', (d) => { return map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y })
      .attr('r', () => {
        var currentZoom = map.getZoom();
        rMap = d3.scaleLinear()
            .domain([11, 15])
            .range([1, 7]);
        return rMap(currentZoom);
        })
      .classed('hidden', false);*/

  var zoomLevel = map.getZoom();
  zMap = d3.scaleLinear()
      .domain([11, 15])
      .range([0, 0.75]);

  neighborhoodOutlines.attr('d', path);
  neighborhoodSymbolGroup.attr('transform', (d) => {
            return `translate(${map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x}, ${map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y}) scale(${zMap(zoomLevel) + 1})`
          })
          .attr('class', () => {
            let zoom = map.getZoom();
            if (zoom > 15.5) {
              return 'map inst mapsymbol-hidden'
            } else {
              return 'map inst'
            }
          })
  institutionGroups.attr('transform', (d) => {

            return `translate(${map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).x}, ${map.latLngToLayerPoint( [d3.geoCentroid(d)[1], d3.geoCentroid(d)[0]] ).y}) scale(${zMap(zoomLevel) + 1})`
          })
          .attr('class', () => {
            let zoom = map.getZoom();
            if (zoom < 13.5) {
              return 'map inst mapsymbol-hidden'
            } else {
              return 'map inst'
            }
          })

}
