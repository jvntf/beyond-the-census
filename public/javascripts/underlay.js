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
    L.geoJson(features, {style: style}).addTo(map); // add geoJson layer to map for choropleth
    // assign colors based on breaks
    function getColor(d, breaks) { // takes individual number, array of breaks
        return d > 1000 ? '#800026' :
               d > 500  ? '#BD0026' :
               d > 200  ? '#E31A1C' :
               d > 100  ? '#FC4E2A' :
               d > 50   ? '#FD8D3C' :
               d > 20   ? '#FEB24C' :
               d > 10   ? '#FED976' :
                          '#FFEDA0';
    }

    function findRange(features, field, numBreaks) {
      var dataArray = features.map( (feature) => { return feature[field] });
      var range = d3.extent(dataArray);
      return range;
    }

    // style features in geojson layer
    function style(feature) {
        return {
            //fillColor: getColor(feature.properties.density),
            fillColor: 'none',
            weight: 1,
            opacity: 1,
            color: '#e0e0e0',
            //dashArray: '3',
            //fillOpacity: 0.7
        };
    }
    d3.select('#map-svg-main').raise()
      //.on('click', () => { console.log('you clicked the map')});  // move up the heirachy so this draws on top of the leaflet choropleth underlay
      // ensure d3 drawing layer is still on top
  })
}
