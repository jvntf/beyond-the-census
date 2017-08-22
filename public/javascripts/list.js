// THINGS TO MAKE THE LIST SIDE PANEL FROM LANGUAGE DATASET

// renders list from state.langGroup contents
function updateList() {
  //console.log('called update list')

  var q = d3.queue(1)  // concurrency of 1, sets queue to run in series
    .defer( (callback) => {

      var listTarget = d3.select('#langlist-target'); // get target HTML node to append things to
      listTarget.selectAll('*').remove(); // remove any existing list elements ( so this can be used to refresh the list on data change )

        //var continentItem = textTarget.selectAll('div') // make continent container DIVs
        //    .data(data.main) // this data comes already nested/sorted from data.main (was languageNest)
        //  .enter().append('div')
        //    .classed('continent-item', true)

        //var continentLabel = continentItem.append("div") // label header for continent
        //    .attr('class', 'continent-item-label')

        //    continentLabel.append('h2')
        //    .attr('id', (d) => { return d.key.replace(/ /g,'-')})
        //    .text((d) => {
              //console.log(d)
        //      return d.key })
        //    .on('click', (d) => {
        //      d3.selectAll('.lang').classed('listlang-hidden', true).classed('maplang-hidden', true)
        //      d3.selectAll(`.cont-${d.values[0].values[0].continents[0]._id}`).classed('listlang-hidden', false).classed('maplang-hidden', false)
        //      updateContinentCard(d.values[0].values[0].continents[0]._id, null)
        //    });

        //var languageList = continentItem.append("div") // make container for list of languages within continent
        //    .attr('class', 'language-list')

        //var endangermentItem = languageList.selectAll("div") // ignore this. doesn't do anything (in case we want separate divs for endangerment status)
        //    .data( (d) => {
        //      return d.values } )
        //   .enter();

        var languageItem = listTarget.selectAll("span") // make each language tag from selection set
            .data(state.langGroup.sort( (a, b) => {return d3.ascending(a.continents[0].properties.CONTINENT, b.continents[0].properties.CONTINENT)}))
            .enter().append("span");

            languageItem.attr('class', (d) => { return `list-block list lang lang-${d._id} cont-${d.continents[0]._id}`})

            languageItem.text((d) => {
              //if ( d.story !== undefined ) {
              //  return `•${d.language}`
              //}
                return d.language
            })

            .style('background', (d) => {
              if (d.neighborhoods && d.neighborhoods.length > 0) return d.color;
            })
            .style('border', (d) => {
              if ( !d.neighborhoods || d.neighborhoods.length == 0) return `1px solid ${d.color}`;
            })
            .style('color', (d) => {
              return `${d.groupColor.darker().darker()}`
            })
            .on('click', (d, i, n) => { // d here is populated language object
              selectSingleLang(d._id);
            })
      callback(null);
    })
    //.defer( (callback) => {
    //  callback(null);
    //})
    .await( (err) => {
      if (err) throw err;
      updateLegend();
      updateStatus();
    })
}

function updateLegend() {
  //console.log('called update legend')
// listlegend-target.list-block
// write legend into listlegend-target.list-block
  var continentNames = [];
  var uniqueContinents = [];
  state.langGroup.forEach( (item) => {
    if ( item.continents && !continentNames.includes(item.continents[0].properties.CONTINENT) ) {
      continentNames.push(item.continents[0].properties.CONTINENT)
      uniqueContinents.push({
        _id: item.continents[0]._id,
        name: item.continents[0].properties.CONTINENT,
        groupColor: item.groupColor
      });
    }
  });
  //console.log(uniqueContinents);

  var legendTarget = d3.select('#listlegend-target'); // get target HTML node to append things to
  legendTarget.selectAll('*').remove(); // remove any existing list elements ( so this can be used to refresh the list on data change )

  legendTarget.append('p').text('grouped by continent:').classed('legend-label', true)

  legendItem = legendTarget.selectAll("span") // make each language tag from selection set
      .data(uniqueContinents)
      .enter().append("span")
      .classed('list-block', true);

  legendItem.text((d) => { return d.name})
    .style('background', (d) => {
      return `${d.groupColor}`
    })
    .style('color', (d) => {
      return `${d.groupColor.darker().darker()}`
    })
    .style('background', (d) => {
      let colorModified = d3.hcl( d.groupColor.h , d.groupColor.c , 110, 1 );
      colorModified.l = 110;
      return `linear-gradient(to right,${colorModified},${d.groupColor})`
    })
    .on('click', (d) => {
      console.log(d)
      state.filters.globalAttr = {
        key: 'continents', value: d._id
      }
      applyFilters();
    })
}

function updateStatus() {
  d3.select('#langlist-status-texttarget').selectAll('*').remove();
  //d3.select('#langlist-status-texttarget').append('p').text(() => {
  //  return `showing ${state.langGroup.length} languages of ${state.langAll.length}`
  //})
}


// scroll list to provided element ID
function scrollList(id, callback) {
  let classString = `.list.lang.lang-${id}`;
  //console.log(classString);
  $('#langlist-target').animate({
    'scrollTop':  $(`.list.lang.lang-${id}`).offset().top
  }, {
    'duration': 500,
    'queue': false,
    'done': () => { callback(null) }
  });
}
