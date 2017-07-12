/***************************** DATA LOADING **************************/
/*

functions to load and stage datasets from the database
general pattern is:
- declare URL for query ( urls and corresponding queries are defined under routes/index )
- fetch JSON
- process response
- return modified response or store it in a variable

*/


function updateSelectionData(id, callback) {
  getDataSingle( 'languages', id, (result) => {
      var resultObj = result;
      if (resultObj.countries) {
        getData( 'countries', resultObj.countries, (resultCountries) => {
          resultObj.countries = resultCountries;
          data.selected = resultObj;
        })
      }
      if (resultObj.neighborhoods) {
        getData( 'neighborhoods', resultObj.neighborhoods, (resultNeighborhoods) => {
          resultObj.neighborhoods = resultNeighborhoods;
          data.selected = resultObj;
        })
      }
      //console.log(resultObj);
      data.selected = resultObj;
      if (callback) callback()
  });
}

function getFilteredData(collection, query, callback) {
    let url = `../${collection}`;
    d3.json(url, function(json){

    });
}

function updateData(mode, input, callback) {
  //console.log('update data called')
  setTimeout(function() {
    if (mode == 'langname' ) {
      getData( 'languages', [], (response) => {  // get main language data
        filterData( input, response, (filterresponse) => {
          data.languages = filterresponse;
          getData( 'countries', [], (response) => {
            data.countries = response;
            getData( 'neighborhoods', [], (response) => {
              data.neighborhoods = response;
              getData( 'continents', [], (response) => {
                data.continents = response;
                if (callback) {callback()};
              })
            })
          })
        })
      })
    }
  }, 250);
}

function filterData(string, data, callback) {
  let results = fuzzy.filter(string, data, searchOptions);
  let matches = results.map(function(el) { return el.original; });
  callback(matches)
}

function getData( collection, ids, callback ) { // id is optional

  let url = `../${collection}`;
  d3.json(url, function(json){
    if (ids.length > 0) {
      //console.log(ids);
      let filteredJson = []

      async.each(
        json,

        (item, callback) => {
          //console.log(ids)
          //console.log(item._id)
          //console.log( ids.indexOf(item._id)
          if ( ids.indexOf(item._id) > -1 ) {
            filteredJson.push(item);
          }
          callback();

        },

        (err, transformed) => {
          //console.log(filteredJson)
          callback(filteredJson);
        }

      );

    } else {
      //console.log(json);
      callback(json);
    }
  })
}

function getDataSingle( collection, id, callback ) {
  let url = `../${collection}/${id}`;
  d3.json(url, function(json){
      //console.log('getdatasingle request')
      //console.log(url)
      //console.log(json)
      callback(json)
  });
}

function getUnderlayData( dataset, callback ) {
  let url = `../underlay/${dataset}`;
  d3.json(url, (json) => {
    callback(json)
  })
}

function getLanguageData( query, callback ) {
  let url = `../languages/${query.min}.${query.max}.${query.string}`;
  d3.json(url, (json) => {
    callback(json)
  })
}
