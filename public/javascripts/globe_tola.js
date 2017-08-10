function updateGlobe( data, callback ) {

  d3.select('#globe-target').classed('hidden', false);

  var thisLanguage = data;

  var target = d3.select('#globe-target')
  target.select('#globe-container').remove(); // clear globe
  target = target.append('g')
    .attr("id", "globe-container")
    .attr("transform", "translate(120,120)")

  var rotation = [ -data.longitude, -data.latitude ];
  var width = window.innerWidth,
      height = window.innerHeight;

  init();

  function init(){
      // set projection
      var projection = d3.geoOrthographic()
          .scale(100)
          .rotate( rotation )
          //.center( center )
          .translate([0, 0])
          .clipAngle(90);

      // make path generator
      var path = d3.geoPath()
          .projection(projection)
          .pointRadius(3);

      //Create the base globe
      var backgroundCircle = target.append("circle")
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', projection.scale())
          .attr('class', 'globe')
          .attr("fill", "#e0eaf9");

      //Add all of the countries to the globe
      var continentPaths = target.selectAll("path")
          .data(data.continents)
          .enter()
          .append("path")
          .attr("class", "feature")
          .attr("fill", "#ffffff")
          .attr("d", path);  // this is where svg data gets added, based on data transformed through path generator

      var countryPaths = target.append('g')
          .selectAll("path")
          .data(thisLanguage.countries)
          .enter()
          .append("path")
          .attr("class", "feature")
          .attr("fill", () => {return data.color})
          .attr('fill-opacity', "0.5")
          .attr("d", path);  // this is where svg data gets added, based on data transformed through path generator

      //Add marker at the center of the globe
      var Circle = target.append("circle")
          .attr('id', 'globe-marker')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 3)
          .attr("fill", data.color.darker().darker())
          .attr("fill-opacity", "1")
          //.attr("stroke", item.color.darker())
          //.attr("stroke-width", 1.5)

      var countryList = [];
      data.countries.map( (country) => {
        countryList.push( country.properties.ADMIN );
      });

      }
      if (callback) callback(null); // null callback for d3.queue
}
