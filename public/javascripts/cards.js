function connect(langid) {
  d3.select('#overlay-target').selectAll('*').remove();

  var dataItem = state.langGroup.find( (item) => {
    return item._id == langid
  });
  // console.log(dataItem);

  var listBox = d3.select(`.list.lang-${langid}`).node().getBoundingClientRect(); // should be just one, will get it
  var mapBox = d3.select(`.map.lang-${langid}`).node().getBoundingClientRect(); // will get just one if there are many
  var detailBox = d3.select(`#card-header`).node().getBoundingClientRect(); // will get the same thing every time
  //console.log(mapBox)
  //  console.log(listBox)
  //    console.log(detailBox)

  var overlay = d3.select('#overlay-target').append('svg').attr('height', window.innerHeight).attr('width', window.innerWidth)

  var lineOne = [[listBox.right, listBox.bottom], [mapBox.left, mapBox.bottom], [mapBox.left, mapBox.top], [listBox.right, listBox.top]];
  var lineTwo = [[detailBox.left, detailBox.top], [mapBox.right, mapBox.top], [mapBox.right, mapBox.bottom], [detailBox.left, detailBox.bottom]];

  var line = d3.line()

  overlay.append('path').attr('d', () => {return line(lineOne)}).attr('fill', () => {return dataItem.color}).attr('fill-opacity', 0.4);
  overlay.append('path').attr('d', () => {return line(lineTwo)}).attr('fill', () => {return dataItem.color}).attr('fill-opacity', 0.4);

}

function clearCard() {
  // clear card (hide globe)
  d3.select('#globe-target').classed('hidden', 'true');
  d3.select('#lang-content').selectAll('*').remove();
  d3.select('#story-content').classed('hidden', 'true');
  d3.select('#underlay-control').classed('hidden', 'true');

}

function setCardVisible(bool) {
  d3.select('#detail-container').classed('hidden', !bool);
  d3.select('#drawing-container').classed('drawing-medium', bool);
  d3.select('#drawing-container').classed('drawing-wide', !bool);
  window.dispatchEvent(new Event('resize'));
}

function updateInstitutionCard(id, callback) {
  clearCard();
  setCardVisible(true);
  var card = d3.select('#lang-content');
  var dataItem;
  var q = d3.queue(1)  // concurrency of 1, sets queue to run in series
    .defer( (callback) => {
        //data
        dataItem = data.institutions.find( (item) => {
          return item._id == id;
        })
        dataItem.properties.language_objs = dataItem.properties.languages.map( (item) => {
          return state.langAll.find( (langitem) => {
            //console.log('full languages ready')
            return langitem._id == item;
          })
        })
      callback(null)
    })
    .await( (err) => {
      //console.log(dataItem);
      card.append('h2').text(() => {return dataItem.properties.institution})
      //card.append('p').text(() => {return dataItem.properties.type})
      card.append('p').text(() => {return dataItem.properties.description})
      console.log(dataItem);



      card.append('p').text(() => {return dataItem.properties.address})
      // write language list
      card.append('h3').text('Languages Spoken:')
      var langsList = card.append('div').attr('class', 'places-list');
      dataItem.properties.language_objs.forEach( (item) => {
        langsList.append('span')
          .text(() => { return item.language })
          .attr('class', () => {return `card lang lang-${item._id}`})
          .on('click', () => {
            let lang = state.langAll.find( (searchitem) => {
              return searchitem._id == item._id
            })
            scrollList(lang._id, () => {})
            //console.log(lang)
            d3.selectAll('.list.lang').classed('listlang-hidden', true)
            d3.selectAll(`.list.lang-${lang._id}`).classed('listlang-hidden', false)
            //d3.selectAll(`.list.lang-${d._id}`).select(this.parentNode).select(this.parentNode).raise();

            d3.selectAll('.map.lang').classed('maplang-hidden', true)
            d3.selectAll(`.map.lang-${lang._id}`).classed('maplang-hidden', false)
            d3.selectAll(`.map.lang-${lang._id}`).select(this.parentNode).select(this.parentNode).raise();
            //showNarrativePanel();
            updateLanguageCard(lang._id);

            updateGlobe(lang);
            d3.selectAll('.globe.country').classed('globe-hidden', true)
            d3.selectAll('.globe.lang').classed('globe-hidden', true)

            lang.countries.forEach( (item) => {
              d3.select(`.globe.country-${item._id}`).classed('globe-hidden', false).attr('stroke', () => {return lang.color})
            })

            d3.selectAll(`.globe.lang-${lang._id}`).classed('globe-hidden', false)
          })
          .style('background', () => {return item.color})
      })
      if (callback) {callback(null)}
    })
}

function updateCountryCard(id, callback) {
  clearCard();
  setCardVisible(true);
  var card = d3.select('#lang-content');
  var dataItem;
  var q = d3.queue(1)  // concurrency of 1, sets queue to run in series
    .defer( (callback) => {
        //data
        dataItem = data.countries.find( (item) => {
          return item._id == id;
        })
        dataItem.properties.language_objs = dataItem.properties.languages.map( (item) => {
          return state.langAll.find( (langitem) => {
            //console.log('full languages ready')
            return langitem._id == item;
          })
        })
      callback(null)
    })
    .await( (err) => {
      if (err) throw err;
      //console.log(dataItem);

      // write country name
      card.append('h2').text(() => {return dataItem.properties.ADMIN})

      // write language list
      card.append('h3').text('Languages Spoken:')
      var langsList = card.append('div').attr('class', 'places-list');

      dataItem.properties.language_objs.forEach( (item) => {
        langsList.append('span')
          .text(() => { return item.language })
          .attr('class', () => {return `card lang lang-${item._id}`})
          .on('click', () => {

              let lang = state.langAll.find( (searchitem) => {
                return searchitem._id == item._id
              })
              scrollList(lang._id, () => {})
              //console.log(lang)
              d3.selectAll('.list.lang').classed('listlang-hidden', true)
              d3.selectAll(`.list.lang-${lang._id}`).classed('listlang-hidden', false)
              //d3.selectAll(`.list.lang-${d._id}`).select(this.parentNode).select(this.parentNode).raise();

              d3.selectAll('.map.lang').classed('maplang-hidden', true)
              d3.selectAll(`.map.lang-${lang._id}`).classed('maplang-hidden', false)
              d3.selectAll(`.map.lang-${lang._id}`).select(this.parentNode).select(this.parentNode).raise();
              //showNarrativePanel();
              updateLanguageCard(lang._id);

              updateGlobe(lang);
              d3.selectAll('.globe.country').classed('globe-hidden', true)
              d3.selectAll('.globe.lang').classed('globe-hidden', true)

              lang.countries.forEach( (item) => {
                d3.select(`.globe.country-${item._id}`).classed('globe-hidden', false).attr('stroke', () => {return lang.color})
              })

              d3.selectAll(`.globe.lang-${lang._id}`).classed('globe-hidden', false)
          })
          .style('background', () => {return item.color})
      })
    })
}

function updateContinentCard(id, callback) {
  clearCard();
  setCardVisible(true);
  var card = d3.select('#lang-content');

  //data
  dataItem = data.continents.find( (item) => {
    return item._id == id;
  })

  card.append('h2').text(() => {return dataItem.properties.CONTINENT})
  card.append('p')

  if (callback) {callback(null)}
}

function updateAboutCard() {
  // basic setup
  clearCard();
  setCardVisible(true);
  var card = d3.select('#lang-content');


  let cardheader = card.append('div').attr('id', 'card-header')
    .style('background', (d) => {return '#a7a7a7'})
    .style('color', (d) => {return '#343434'})
    .append('table').append('tbody').append('tr')
  cardheader.append('td').append('h2').text('About');
  cardheader.append('td').attr('class', 'card-header-right').append('p').text('x').on('click', () => {hideDetails()});

  let cardbody = card.append('div').classed('card-body', true)
  cardbody.append('div').html('<p>The data for this map was obtained by <a href="http://elalliance.org/" target="blank">The Endangered Language Alliance</a> (ELA), an independent non-profit based in New York City focused on the immense linguistic diversity of urban areas. Founded in 2010, the ELA documents and describes underdescribed and endangered languages, educating a larger public and collaborating with communities.</p>')

  cardbody.append('div').html('<p>The data for this map was obtained by <a href="http://elalliance.org/">The Endangered Language Alliance</a> (ELA), an independent non-profit based in New York City focused on the immense linguistic diversity of urban areas. Founded in 2010, the ELA documents and describes underdescribed and endangered languages, educating a larger public and collaborating with communities.</p>');


  cardbody.append('p').html('<p>Each colored square represents a place where a particular language is spoken. A place may be a general area (a neighborhood or a street) or a specific point (a community center, mosque or shop). A language\'s endangerment status and continent of origin are visualized in color on the left, and its place of origin on the right, both data points are drawn from <a href="http://glottolog.org/">Glottolog</a>.</p>')
  cardbody.append('div').html('<p>To learn more about this project, click <a href="http://c4sr.columbia.edu/projects" target="blank">here</a></p>')

  cardbody.append('div').html('<img src = "../data/img/ela.png" width="100%">')
  cardbody.append('div').html('<img src = "../data/img/CSR_Logo-ColumbiaBlue.png" width="100%">')
  
  cardbody.style('height', (d) => {return '500px'});
  cardbody.style('overflow', (d) => {return 'auto'})
}

function updateNeighborhoodCard(id, callback) {
  clearCard();
  setCardVisible(true);
  var card = d3.select('#lang-content');
  var dataItem;
  var q = d3.queue(1)  // concurrency of 1, sets queue to run in series
    .defer( (callback) => {
        //data
        dataItem = data.neighborhoods.find( (item) => {
          return item._id == id;
        })
        dataItem.properties.language_objs = dataItem.properties.languages.map( (item) => {
          return state.langAll.find( (langitem) => {
            //console.log('full languages ready')
            return langitem._id == item;
          })
        })
      callback(null)
    })
    .await( (err) => {
      if (err) throw err;
      //console.log(dataItem);

      // write country name
      card.append('span')
        .classed('card-label')
        .style('background', (d) => {
          //console.log(d);
          return d.color;
        })
      card.append('h2').text(() => {return dataItem.properties.NTAName})

      // write language list
      card.append('h3').text('Languages Spoken:')
      var langsList = card.append('div').attr('class', 'places-list');

      dataItem.properties.language_objs.forEach( (item) => {
        langsList.append('span')
          .text(() => { return item.language })
          .attr('class', () => {return `card lang lang-${item._id}`})
          .on('click', () => {

              let lang = state.langAll.find( (searchitem) => {
                return searchitem._id == item._id
              })
              scrollList(lang._id, () => {})
              //console.log(lang)
              d3.selectAll('.list.lang').classed('listlang-hidden', true)
              d3.selectAll(`.list.lang-${lang._id}`).classed('listlang-hidden', false)
              //d3.selectAll(`.list.lang-${d._id}`).select(this.parentNode).select(this.parentNode).raise();

              d3.selectAll('.map.lang').classed('maplang-hidden', true)
              d3.selectAll(`.map.lang-${lang._id}`).classed('maplang-hidden', false)
              d3.selectAll(`.map.lang-${lang._id}`).select(this.parentNode).select(this.parentNode).raise();
              //showNarrativePanel();
              updateLanguageCard(lang._id);

              updateGlobe(lang);
              d3.selectAll('.globe.country').classed('globe-hidden', true)
              d3.selectAll('.globe.lang').classed('globe-hidden', true)

              lang.countries.forEach( (item) => {
                d3.select(`.globe.country-${item._id}`).classed('globe-hidden', false).attr('stroke', () => {return lang.color})
              })

              d3.selectAll(`.globe.lang-${lang._id}`).classed('globe-hidden', false)
          })
          .style('background', () => {return item.color})
      })
    })
}

function updateNeighborhoodCardByData(dataItem) {
  clearCard();
  setCardVisible(true);

  var nbdCard = d3.select('#lang-content');

  nbdCard.append('h1').text(() => {return dataItem.properties.NTAName})
  nbdCard.append('h3').text('Languages Spoken:')
  var langsList = nbdCard.append('div').attr('id', 'places-list');

  dataItem.properties.languages.forEach( (item) => {
    langsList.append('span').text(() => { return item._id })
  })
}

function updateLanguageCard( id, callback ) {
  // basic setup
  clearCard();
  setCardVisible(true);
  var card = d3.select('#lang-content');

  // data
  dataItem = state.langAll.find( (item) => {
    return item._id == id;
  })
  //var countriesSpoken = dataItem.countries.map( (item) => {
  //  return {item.properties.ADMIN}
  //}).join(", ")
  //var neighborhoodsSpoken = dataItem.neighborhoods.map( (item) => {
  //  return item.properties.NTAName
  //}).join(", ")

  // write name and description
  let cardheader = card.append('div').attr('id', 'card-header')
    .style('background', (d) => {return dataItem.color})
    .style('color', (d) => {return dataItem.color.darker().darker()})
    .append('table').append('tbody').append('tr')
  cardheader.append('td').append('h2').text(() => {return dataItem.language});



  cardheader.append('td').attr('class', 'card-header-right').append('p').text('x').on('click', () => {hideDetails()});
  
  if (typeof dataItem.script !== 'undefined' && dataItem.script !== dataItem.language) {
    let script = card.append('div').attr('id', 'script')
      .style('background', (d) => {return dataItem.color.brighter(0.3)})
      .style('color', (d) => {return dataItem.color.darker().darker()})
      .append('table').append('tbody').append('tr')
    script.append('td').append('h2').text(() => {return dataItem.script});
  }

  console.log(cardheader);
  let cardbody = card.append('div').classed('card-body', true)
  cardbody.append('p').text( () => {return dataItem.description})
  console.log(dataItem);

  // deal with story content, if present
  if ( dataItem.story !== undefined ) {
    cardbody.append('p').text(() => { return dataItem.story });
  }

  // wikipedia link
  cardbody.append('a')
      .attr('href', () => {return dataItem.wiki})
      .text('wikipedia')
      //.html('wikipedia <i class="fa fa-external-link" aria-hidden="true"></i>')
      .attr('target', 'blank')

  cardbody.append('h3').text('Spoken In');
  var placesGroup = cardbody.append('div').attr('class', 'places-list');

  if (dataItem.countries) {
    dataItem.countries.forEach( (country) => {
      //console.log(country)
      placesGroup.append('span').text(() => {return country.properties.ADMIN })
        //.on('click', () => { updateCountryCard(country._id) })
        ;
    })
  }

  if(dataItem.videoURL){
    var string = dataItem.videoURL.trim()
    cardbody.append('iframe').attr('width','100%')
      .attr('src',dataItem.videoURL)
      .attr('frameborder','0');
      console.log(typeof dataItem.videoURL);
  }


  $.get( "https://www.youtube.com/watch?v=sXBGySJvJn8&feature=youtu.be", function( data ) {
    console.log(data);
  });

  // <iframe width="560" height="315" src="https://www.youtube.com/embed/FW101WP3KyI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

 

  if (callback) {callback(null)}
}
