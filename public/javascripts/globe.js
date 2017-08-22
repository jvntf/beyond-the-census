function updateGlobe( item, callback ) {
  d3.select('#globe-target').classed('hidden', false);

  var thisLanguage = item;

  var target = d3.select('#globe-target')
  target.select('#globe-container').remove(); // clear globe
  target = target.append('g')
    .attr("id", "globe-container")
    .attr("transform", "translate(120,120)") // this shouldn't be absolutely positioned...

  var rotation = [ -item.longitude, -item.latitude ];
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
          .attr("fill", "#dfdede");

      //Add all of the countries to the globe
      var continentPaths = target.selectAll("path")
          .data(data.continents)
          .enter()
          .append("path")
          .attr("class", "feature")
          .attr("fill", "#ffffff")
          .attr("d", path);  // this is where svg data gets added, based on data transformed through path generator

      /*var countryGroups = target.selectAll('g')
          .data(thisLanguage.countries)
          .enter()
          .append('g')
          .attr('transform', (d) => {
        //    console.log(d)
            let projectedPoints = projection(d3.geoCentroid(d));
            return `translate(${projectedPoints[0]}, ${projectedPoints[1]})`
          })*/
          //.attr("fill", () => {return item.color})
          //.attr('fill-opacity', "0.5")
          //.attr('stroke', ()  => {return item.color.darker()})
          //.attr('stroke-dasharray', [2, 2])
          //.attr("d", path);  // this is where svg data gets added, based on data transformed through path generator

      /*countryGroups.append('line')
        .attr('x1', 0)
        .attr('y1', -3)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', 'gray')

      countryGroups.append('rect')
          .attr('class', 'globe-marker')
          .attr('x', -3)
          .attr('y', -9)
          .attr('width', 6)
          .attr('height', 6)
          .attr('stroke', 'gray')
          .attr("fill", (d) => {if (item.color) {return item.color} else {return 'gray'}})
          .attr("fill-opacity", "1")*/

          var countrymarkers = target.append('g')
              .selectAll('rect')
              .data(data.countries)
              .enter().append('rect')
              .attr('transform', (d) => {
                //console.log(d);
                let projectedPoint = projection(d3.geoCentroid(d));
                return `translate(${projectedPoint[0]}, ${projectedPoint[1]})`
              })
              .attr('width', '4')
              .attr('height', '4')
              .attr('fill', 'transparent')
              .attr('stroke', (d) => {
                return '#bebebe';
              })
              .attr('stroke-width', '1')
              .attr('class', (d) => {
                return `globe-hidden globe country country-${d._id}`
              })


      var langmarkers = target.append('g')
          .selectAll('rect')
          .data(state.langAll)
          .enter().append('rect')
          .attr('transform', (d) => {  // somebody in here isn't working right
            //console.log(d);
            var projectedPoint = projection([d.longitude, d.latitude]);
            return `translate(${projectedPoint[0]}, ${projectedPoint[1]})`
          })
          .attr('width', '6')
          .attr('height', '6')
          .attr('fill', (d) => {
            return d.color;
          })
          .attr('class', (d) => {
            return `globe-hidden globe lang lang-${d._id}`
          })


      //Add marker at the center of the globe
      /*var marker = target.append("g")

      marker.append('line')
        .attr('x1', 0)
        .attr('y1', -3)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', 'gray')

      marker.append('rect')
          .attr('id', 'globe-marker')
          .attr('x', -3)
          .attr('y', -9)
          .attr('width', 6)
          .attr('height', 6)
          .attr('stroke', 'gray')
          .attr("fill", (d) => {return item.color})
          .attr("fill-opacity", "1")*/

      var countryList = [];
      item.countries.map( (country) => {
        countryList.push( country.properties.ADMIN );
      });

      /*  //Add list of countries under globe
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
        .text(function(d) { return d }); */

      }
      if (callback) callback(null);
}
