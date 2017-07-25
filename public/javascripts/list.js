// THINGS TO MAKE THE LIST SIDE PANEL FROM LANGUAGE DATASET

function updateList() {

  var textTarget = d3.select('#text-target'); // get target HTML node to append things to

  /*
    from here down, start adding HTML to the DOM

    the end result will be that something like this...

    v div.continent-item
        v div.continent-item-label
            v p [LANGUAGE NAME]
            v span.endangerment-scale
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
      .data(data.main) // this data comes already nested/sorted from data.main (was languageNest)
    .enter().append('div')
      .classed('continent-item', true)
      .classed('card', true)

    //continentItem.datum(   <-- this was for the data modification part, now happening in updateData function
    //
    //)

  var continentLabel = continentItem.append("div") // label header for continent
      .attr('class', 'continent-item-label')

      continentLabel.append('p')
      .text((d) => {
        //console.log(d)
        return d.key });

//  var endangermentScale = continentLabel.append('span')
//      .attr('class', 'endangerment-scale')
//      .append('svg')

//  endangermentScale.attr('transform', 'translate(0,0)')
//        .selectAll('rect')
//        .data( (d) => {console.log(d)})

/*
      var g = svg.append("g")
          .attr("class", "key")
          .attr("transform", "translate(0,40)");

      g.selectAll("rect")
        .data(color.range().map(function(d) {
            d = color.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
          }))
        .enter().append("rect")
          .attr("height", 8)
          .attr("x", function(d) { return x(d[0]); })
          .attr("width", function(d) { return x(d[1]) - x(d[0]); })
          .attr("fill", function(d) { return color(d[0]); });

      g.append("text")
          .attr("class", "caption")
          .attr("x", x.range()[0])
          .attr("y", -6)
          .attr("fill", "#000")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Unemployment rate");

      g.call(d3.axisBottom(x)
          .tickSize(13)
          .tickFormat(function(x, i) { return i ? x : x + "%"; })
          .tickValues(color.domain()))
        .select(".domain")
          .remove();
*/

  var languageList = continentItem.append("div") // make container for list of languages within continent
      .attr('class', 'language-list')

  var endangermentItem = languageList.selectAll("div") // ignore this. doesn't do anything (in case we want separate divs for endangerment status)
      .data( (d) => {
        return d.values } )
     .enter();

  var languageItem = endangermentItem.selectAll("span") // make each language tag
      .data( (d) => {
        return d.values } )  // shift data (next level down nest?)
      .enter().append("span")
      .attr('id', (d) => { return `li-${d._id}` })
      .attr('class', 'language-item')
      .text((d) => {return d.language})
      .style('background', (d) => {
        return d.color
      })
      .style('color', 'black')
      .on('click', (d, i, n) => {
            showNarrativePanel();
            updateLanguageCard(d._id);
            modifyMapFromList(d._id);
          })
}

function updateLanguageCard( id ) {
  console.log(id)
  dataItem = data.languages.find( (item) => {
    return item._id == id;
  })

  console.log(dataItem)
  console.log('update language card')

  var countriesSpoken = dataItem.countries.map( (item) => {
    return item.properties.ADMIN
  }).join(", ")
  console.log(countriesSpoken)

  var neighborhoodsSpoken = dataItem.neighborhoods.map( (item) => {
    return item.properties.NTAName
  }).join(", ")
  console.log(neighborhoodsSpoken)

  var card = d3.select('#lang-content');
  card.selectAll('*').remove();
  card.append('h2').text(() => {return dataItem.language});
  card.append('p').text(() => {return dataItem.description});
  card.append('p').text(() => {return `Endangerment: ${dataItem.endagerment}`});
  card.append('p').text(() => {return `Spoken globally in ${countriesSpoken}`});
  card.append('p').text(() => {return `Spoken locally in ${neighborhoodsSpoken}`});
  var buttongroup = card.append('div').attr('class', 'button-group');
  buttongroup.append('a')
      .attr('href', () => {return dataItem.wiki}).text('wikipedia')
      .attr('target', 'blank')
      .attr('class', 'card');
  buttongroup.append('a')
    .attr('href', () => {return dataItem.ethno}).text('ethnologue')
    .attr('target', 'blank')
    .attr('class', 'card');
}
