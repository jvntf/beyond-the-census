function updateList() { // show text details for highlighted language
  // setup
  var textTarget = d3.select('#text-target');
  var languageList = data.languages;

  var languageNest = d3.nest()
    .key(function(d) {return d.continents[0].properties.CONTINENT;})
    .sortKeys(d3.ascending)
    .key(function(d) {return d.endangermentNum;})
    .sortKeys(d3.ascending)
    .entries(data.languages);

  var uniqueContinents = d3.set(languageList, (item) => {
      return item.continents[0].properties.CONTINENT
    }).values();

  // begin DOM manipulation
  textTarget.selectAll('*').remove(); // clear container on refresh

  var continentItem = textTarget.selectAll('div')
      .data(languageNest)
    .enter().append('div')
      .attr('class', 'continent-item') // makes a list item for every group in the first level of the nest (continent)

  continentItem.datum( (d, i, n) => { // calculate color per continent and insert into child elements
    var dModified = d;
    var numContinents = n.length
    var hMap = d3.scaleLinear()
        .domain([0, numContinents])
        .range([0,360]);
    dModified.color = d3.hcl( hMap(i) , 50, 75, 1 );

    dModified.values.map( (item) => {
      var itemModified = item;
      itemModified.values.map( (subItem => {
        var subItemModified = subItem;
        subItemModified.continentColor = dModified.color;
        return subItemModified;
      }));
      return itemModified;
    })
    return dModified;
  })

  continentItem.append("div") // label each continent item
      .attr('class', 'continent-item-label')
      .style('background', 'black')
      .style('color', 'white')
      .append('p')
      .text((d) => { return d.key });

  var languageList = continentItem.append("div") // make container for language list
      .attr('class', 'language-list')

  var endangermentItem = languageList.selectAll("div")
      .data( (d) => { return d.values} )
      .enter();

  var languageItem = endangermentItem.selectAll("span")
      .data( (d) => { return d.values } )
      .enter().append("span")
      .attr('id', (d) => { return `li-${d._id}` })
      .attr('class', 'language-item')
      .text((d) => {return d.language})
      .style('background', (d, i, n) => {
        var lMap = d3.scaleLinear()
            .domain([0, 9])
            .range([75, 110]);
        var colorAdjusted = d.continentColor
        colorAdjusted.l = parseInt(lMap(d.endangermentNum));
        return colorAdjusted;
      })
      .style('color', 'black')
      .on('click', (d, i, n) => {


        //d3.selectAll('.leader-line').remove(); // remove all existing leader lines
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

              //console.log(n[i])

              /*d.neighborhoods.forEach( (item, index) => {
                let itemElement = d3.select(`#ID${item}`);
                mapPoint[0] = parseTransform(itemElement.attr('transform')).translate[0];
                mapPoint[1] = parseTransform(itemElement.attr('transform')).translate[1];

                var lMap = d3.scaleLinear()
                    .domain([0, 9])
                    .range([0, 150]);
                var colorAdjusted = d.continentColor
                colorAdjusted.l = lMap(d.endangermentNum)

                connectTwoElements( item, listItemPoint , mapPoint, colorAdjusted.rgb() ) // draw line between two elements on mouseover
                connectTwoElements( item, globePoint, mapPoint, colorAdjusted.rgb() ) // draw line between two elements on mouseover

              });*/

              d3.select('#globe-marker').attr('fill', function() {
                var colorAdjusted = d.continentColor
                colorAdjusted.l = 85;
                colorAdjusted.c = 80;
                return colorAdjusted
              })

              d3.select('#globe-marker').attr('stroke', 'black')
              /*function() {
                var colorAdjusted = d.continentColor
                colorAdjusted.l = 85;
                colorAdjusted.c = 80;
                return colorAdjusted.darker()
              })*/
            })
}
