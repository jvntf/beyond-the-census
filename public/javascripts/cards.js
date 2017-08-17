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
          return data.languages.find( (langitem) => {
            //console.log('full languages ready')
            return langitem._id == item;
          })
        })
      callback(null)
    })
    .await( (err) => {
      console.log(dataItem);
      card.append('h2').text(() => {return dataItem.properties.institution})
      card.append('p').text(() => {return dataItem.properties.type})
      card.append('p').text(() => {return dataItem.properties.description})
      card.append('p').text(() => {return dataItem.properties.address})
      // write language list
      card.append('h3').text('Languages Spoken:')
      var langsList = card.append('div').attr('class', 'places-list');
      dataItem.properties.language_objs.forEach( (item) => {
        langsList.append('span')
          .text(() => { return item.language })
          .attr('class', () => {return `card lang lang-${item._id}`})
          .on('click', () => {updateLanguageCard(item._id)})
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
          return data.languages.find( (langitem) => {
            console.log('full languages ready')
            return langitem._id == item;
          })
        })
      callback(null)
    })
    .await( (err) => {
      if (err) throw err;
      console.log(dataItem);

      // write country name
      card.append('h2').text(() => {return dataItem.properties.ADMIN})

      // write language list
      card.append('h3').text('Languages Spoken:')
      var langsList = card.append('div').attr('class', 'places-list');

      dataItem.properties.language_objs.forEach( (item) => {
        langsList.append('span')
          .text(() => { return item.language })
          .attr('class', () => {return `card lang lang-${item._id}`})
          .on('click', () => {updateLanguageCard(item._id)})
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
  clearCard();
  setCardVisible(true);
  var card = d3.select('#lang-content');
  card.append('h2').text('About')
  card.append('p').text('Each colored square on the map represents a place where a particular language is spoken. A place might be a general area (a neighborhood or a street) or a specific point (a community center, mosque or shop).')
  card.append('div').html('<p>To learn more about this project, click <a href="http://c4sr.columbia.edu/projects" target="blank`">here</a></p>')
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
          return data.languages.find( (langitem) => {
            //console.log('full languages ready')
            return langitem._id == item;
          })
        })
      callback(null)
    })
    .await( (err) => {
      if (err) throw err;
      console.log(dataItem);

      // write country name
      card.append('h2').text(() => {return dataItem.properties.NTAName})

      // write language list
      card.append('h3').text('Languages Spoken:')
      var langsList = card.append('div').attr('class', 'places-list');

      dataItem.properties.language_objs.forEach( (item) => {
        langsList.append('span')
          .text(() => { return item.language })
          .attr('class', () => {return `card lang lang-${item._id}`})
          .on('click', () => {updateLanguageCard(item._id)})
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
  dataItem = data.languages.find( (item) => {
    return item._id == id;
  })
  //var countriesSpoken = dataItem.countries.map( (item) => {
  //  return {item.properties.ADMIN}
  //}).join(", ")
  //var neighborhoodsSpoken = dataItem.neighborhoods.map( (item) => {
  //  return item.properties.NTAName
  //}).join(", ")

  // write name and description
  card.append('h2').text(() => {return dataItem.language});
  card.append('p').text( () => {return dataItem.description})

  // deal with story content, if present
  if ( dataItem.story !== undefined ) {
    card.append('p').text(() => { return dataItem.story });
  }

  // wikipedia link
  card.append('a')
      .attr('href', () => {return dataItem.wiki})
      .html('wikipedia <i class="fa fa-external-link" aria-hidden="true"></i>')
      .attr('target', 'blank')

  card.append('h3').text('Spoken In');
  var placesGroup = card.append('div').attr('class', 'places-list');

  dataItem.countries.forEach( (country) => {
    placesGroup.append('span').text(() => {return country.properties.ADMIN }).on('click', () => { updateCountryCard(country._id) });
  })

  if (callback) {callback(null)}
}
