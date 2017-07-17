function updateGlobe( item, callback ) {
  //console.log(item);
  var target = d3.select('#overlay-svg-main')
  target.select('#globe-container').remove(); // clear globe
  target = target.append('g')
    .attr("id", "globe-container")
    .attr("transform", "translate(150, 500)") // this shouldn't be absolutely positioned...

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

      // make path generator
      var path = d3.geoPath()
          .projection(projection)
          .pointRadius(3);

      /*var pathLittleDots = d3.geoPath()
          .projection(projection)
          .pointRadius(1);      */

      /*var overlayTarget = d3.select('#overlay-target')
          .append("svg")
          .attr('id', 'overlay-svg-main')


      var globeTarget = overlayTarget.append("g")
          */

      //Create the base globe
      var backgroundCircle = target.append("circle")
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', projection.scale())
          .attr('class', 'globe')
          .attr("fill", "#98bde2");

      //Add all of the countries to the globe
      var continentPaths = target.selectAll("path")
          .data(data.continents)
          .enter()
          .append("path")
          .attr("class", "feature")
          .attr("fill", "#d8f2a4")
          .attr("d", path);  // this is where svg data gets added, based on data transformed through path generator

      //Add marker at the center of the globe
      var Circle = target.append("circle")
          .attr('id', 'globe-marker')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 5)
          .attr("fill", item.color)
          .attr("fill-opacity", "1")
          //.attr("stroke", item.color.darker())
          //.attr("stroke-width", 1.5)

      var countryList = [];
      item.countries.map( (country) => {
        countryList.push( country.properties.ADMIN );
      });

      //Add list of countries under globe
      var countryList = target.append("text")
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
      if (callback) callback(null);
}
