/*

  handles choropleth underlay functionality

  to-do:
  add queens outline or clip underlays to bounds so it's visible


  functions:

  populateUnderlayDropdown
    from the current underlay geoJSON file,
    gets data layers and a list of layers to exclude
    clears existing underlay dropdown menu
    and adds all from the file to the list

  drawUnderlay
    given the current underlay layer setting (or by default the first in the list)
    renders the underlay choropleth to the map
    (or re-renders with new data)
    internally, calculate data range, breaks, and color corresponding to breaks

*/

var underlaymap;
// EXCLUDE LIST ['STATEFP', 'COUNTYFP', 'TRACTCE', 'GEOID', 'NAME', 'NAMELSAD', 'MTFCC', 'FUNCSTAT', 'ALAND', 'AWATER', 'INTPTLAT', 'INTPTLON', 'Id2']

function populateUnderlayDropdown( exclude ) {
  if (!exclude) exclude = [];
  console.log(exclude)
  d3.json('../data/queenslanguages_census.geojson', (err, features) => {

    // from list of object keys, populate dropdown list
    var optionList = Object.keys(features.features[0].properties).filter( (option) => {
      //console.log(exclude.indexOf( option ));
      return exclude.indexOf( option ) < 0;
    });
    d3.select('#underlay-dropdown').selectAll('option').remove();

    // add options to list
    var menuitems = d3.select('#underlay-dropdown').selectAll('option')
      .data( optionList )
      .enter()
      .append('option')
      .attr('value', (d) => { return d })
      .append('text')
      .text( (d) => { return d })
    });
}

function drawUnderlay() {
  var dataRange = []

  d3.json('../data/nyc_subway_line.geojson', (err, features) => {
    underlaymap = L.geoJson(features, {style: style}).addTo(map); // add geoJson layer to map for choropleth

    // style features in geojson layer
    function style(feature) {
        return {
            //fillColor: getColor(feature.properties.density),
            fillColor: 'none',
            weight: 1,
            opacity: 1,
            color: 'rgb(108, 129, 218)',
            //dashArray: '3',
            //fillOpacity: 0.7
        };
    }
    d3.select('#map-svg-main').raise()
      //.on('click', () => { console.log('you clicked the map')});  // move up the heirachy so this draws on top of the leaflet choropleth underlay
      // ensure d3 drawing layer is still on top
  })
}

function removeUnderlay() {
  map.removeLayer(underlaymap)
}

function drawQueensOutline() {
  d3.json('../data/queens_otln_rikers.geojson', (err, features) => {
    L.geoJson(features, {style: style}).addTo(map); // add geoJson layer to map for choropleth

    // style features in geojson layer
    function style(feature) {
        return {
            //fillColor: getColor(feature.properties.density),
            fillColor: 'none',
            weight: 2,
            opacity: 1,
            color: '#e0e0e0',
            //dashArray: '3',
            //fillOpacity: 0.7
        };
    }
    d3.select('#map-svg-main').raise()

  })
}
