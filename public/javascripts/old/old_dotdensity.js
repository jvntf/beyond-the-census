/* OLD : FOR EACH LANGUAGE, DRAW A RANDOM DOT IN ITS NEIGHBORHOOD
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
      .attr('r', () => {
        var currentZoom = map.getZoom();
        rMap = d3.scaleLinear()
            .domain([11, 15])
            .range([3, 10]);
        return rMap(currentZoom);
        })
      .attr('fill', (d) => { return d.properties.color })
      .attr('fill-opacity', '0.2')
      .attr('stroke', (d) => { return d.properties.color })
      .attr('stroke-width', '1.5')
      .on('click', (d) => {

        let contId = d.properties.language.continents[0].properties.CONTINENT.replace(/ /g, '-');
        var q = d3.queue(1);
          q.defer(scrollList, contId)
          q.defer(updateLanguageCard, d.properties.language._id)
          q.defer(modifyMapFromList, d.properties.language._id)
          q.await(function(err) {
            if (err) throw err;
          })
      })
  })
}) */
