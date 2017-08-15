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
      //.classed('card', true)

    //continentItem.datum(   <-- this was for the data modification part, now happening in updateData function
    //
    //)

  var continentLabel = continentItem.append("div") // label header for continent
      .attr('class', 'continent-item-label')

      continentLabel.append('h2')
      .attr('id', (d) => { return d.key.replace(/ /g,'-')})
      .text((d) => {
        //console.log(d)
        return d.key })
      .on('click', (d) => {
        console.log(d)
        d3.selectAll('.lang').classed('listlang-hidden', true).classed('maplang-hidden', true)
        d3.selectAll(`.cont-${d.values[0].values[0].continents[0]._id}`).classed('listlang-hidden', false).classed('maplang-hidden', false)
      });

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
      .enter().append("span");

      languageItem.attr('class', (d) => { return `list lang lang-${d._id} cont-${d.continents[0]._id}`})

      languageItem.text((d) => {
        if ( d.story !== undefined ) {
          return `•${d.language}`
        }
          return d.language
      })

      .style('background', (d) => {
        return d.color
      })
      .style('color', 'black')
      .on('click', (d, i, n) => { // d here is populated language object
            d3.selectAll('.list.lang').classed('listlang-hidden', true)
            d3.selectAll(`.list.lang-${d._id}`).classed('listlang-hidden', false)
            //d3.selectAll(`.list.lang-${d._id}`).select(this.parentNode).select(this.parentNode).raise();

            d3.selectAll('.map.lang').classed('maplang-hidden', true)
            d3.selectAll(`.map.lang-${d._id}`).classed('maplang-hidden', false)
            d3.selectAll(`.map.lang-${d._id}`).select(this.parentNode).select(this.parentNode).raise();
            showNarrativePanel();
            updateLanguageCard(d._id);
            modifyMapFromList(d._id);
          })
}

function updateLanguageCard( id, callback ) {
  //console.log(id)
  dataItem = data.languages.find( (item) => {
    return item._id == id;
  })

  //console.log(dataItem)
  //console.log('update language card')

  var countriesSpoken = dataItem.countries.map( (item) => {
    return item.properties.ADMIN
  }).join(", ")
  //console.log(countriesSpoken)

  var neighborhoodsSpoken = dataItem.neighborhoods.map( (item) => {
    return item.properties.NTAName
  }).join(", ")
  //console.log(neighborhoodsSpoken)

  var card = d3.select('#lang-content');
  card.selectAll('*').remove();
  card.append('h2').text(() => {return dataItem.language});

  card.append('p').text( () => {return dataItem.description})

  // deal with story content, if present
  var storycontainer = d3.select('#story-content') // select div
  var underlaycontrol = d3.select('#underlay-control')

  if ( dataItem.story !== undefined ) {
    storycontainer.classed('hidden', false)
    storycontainer.selectAll('*').remove();
    storycontainer.append('p').text(() => { return dataItem.story });
  } else {
    storycontainer.classed('hidden', true)
  }

  card.append('h3').text('Links')
  var buttongroup = card.append('div').attr('class', 'button-group');
  buttongroup.append('a')
      .attr('href', () => {return dataItem.wiki}).text('wikipedia')
      .attr('target', 'blank')
      //.attr('class', 'card');
  //buttongroup.append('a')
  //  .attr('href', () => {return dataItem.ethno}).text('ethnologue')
  //  .attr('target', 'blank')
    //.attr('class', 'card');

  card.append('h3').text('Spoken In');
  var placesGroup = card.append('div').attr('id', 'places-list');

  // list neighborhoods spoken in "spoken in" list
  //dataItem.neighborhoods.forEach( (neighborhood) => {
  //  placesGroup.append('span').text(() => {return neighborhood.properties.NTAName })
  //})

  dataItem.countries.forEach( (country) => {
    placesGroup.append('span').text(() => {return country.properties.ADMIN })
  })

  if (callback) {callback(null)}
}

function updateNeighborhoodCard(dataItem) {
  // clear card (hide globe)
  d3.select('#globe-target').classed('hidden', 'true');
  d3.select('#lang-content').selectAll('*').remove();
  d3.select('#story-content').classed('hidden', 'true');
  d3.select('#underlay-control').classed('hidden', 'true');

  var nbdCard = d3.select('#lang-content');

  nbdCard.append('h1').text(() => {return dataItem.properties.NTAName})
  nbdCard.append('h3').text('Languages Spoken:')
  var langsList = nbdCard.append('div').attr('id', 'places-list');

  dataItem.properties.languages.forEach( (item) => {
    langsList.append('span').text(() => { return item._id })
  })
}


// scroll list to provided element ID
function scrollList(id, callback) {
  $(document.body).animate({
    'scrollTop':   $(`#${id}`).offset().top
  }, {
    'duration': 500,
    'queue': false,
    'done': () => { callback(null) }
  });
}
