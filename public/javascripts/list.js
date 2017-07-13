// THINGS TO MAKE THE LIST SIDE PANEL FROM LANGUAGE DATASET

function updateList() {

  var textTarget = d3.select('#text-target'); // get target HTML node to append things to
  var languageList = data.languages;  // get current in-memory list of languages

  // make the flat list of languages into a nested data structure,
  // grouped/sorted by continents and then by endangerment level
  var languageNest = d3.nest()
    .key(function(d) {return d.continents[0].properties.CONTINENT;})
    .sortKeys(d3.ascending)
    .key(function(d) {return d.endangermentNum;})
    .sortKeys(d3.ascending)
    .entries(data.languages);

  // get list of unique continents in the dataset (can ignore, used for color calculation)
  var uniqueContinents = d3.set(languageList, (item) => {
      return item.continents[0].properties.CONTINENT
    }).values();

  /*
    from here down, start adding HTML to the DOM

    the end result will be that something like this...

    v div.continent-item
        v div.continent-item-label
        v div.language-list
            v span#li-[LANGUAGE._ID].language-item
            v span#li-[LANGUAGE._ID].language-item
            v span#li-[LANGUAGE._ID].language-item
            v span#li-[LANGUAGE._ID].language-item
    > div.continent-item
    > div.continent-item

    ... gets appended to div#text-target
  */

  textTarget.selectAll('*').remove(); // remove any existing list elements ( so this can be used to refresh the list on data change )

  var continentItem = textTarget.selectAll('div') // make continent container DIVs
      .data(languageNest)
    .enter().append('div')
      .attr('class', 'continent-item')

    continentItem.datum( (d, i, n) => { // modify data for continents (calculate fill color)
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

  continentItem.append("div") // label header for continent
      .attr('class', 'continent-item-label')
      .style('background', 'black')
      .style('color', 'white')
      .append('p')
      .text((d) => { return d.key });

  var languageList = continentItem.append("div") // make container for list of languages within continent
      .attr('class', 'language-list')

  var endangermentItem = languageList.selectAll("div") // ignore this. doesn't do anything (in case we want separate divs for endangerment status)
      .data( (d) => { return d.values} )
      .enter();

  var languageItem = endangermentItem.selectAll("span") // make each language tag
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
            modifyMapFromList(d, i, n);
          })
}
