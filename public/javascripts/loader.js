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

function updateData(mode, input, endangermentRange, callback) {
  //begin data fetching part:
  setTimeout(function() {
    if (mode == 'langname' ) {
      getData( 'languages', [], (response) => {
      //getData( 'languages', [], (response) => {  // get main language data
        filterData( input, response, (filterresponse) => {
          state.langAll = filterresponse;
          getData( 'countries', [], (response) => {
            data.countries = response;
            getData( 'neighborhoods', [], (response) => {
              data.neighborhoods = response;
              getData( 'continents', [], (response) => {
                data.continents = response;
                getData( 'institutions', [], (response) => {
                  data.institutions = response;
                  buildDataTree( () => {
                    callback(null)
                  });
                })
              })
            })
          })
        })
      })
    }
  }, 250)
}

// takes raw data on global data object (state.langAll, data.neighborhoods etc)
// and builds a structured/sorted/grouped data tree with additional color attributes
// this feeds into the list and map views to produce the colored dots.
// to-do, add dot density location calc to this function (help control clustering)
function buildDataTree( callback ) {
  // begin data modification part:


  // declare variables
  var languageNest,
      q,
      uniqueContinents,
      endangermentList = [],
      hueMap,
      luminanceMap,
      dModified,
      numContinents,
      filteredLanguageList;

  // declare and run queue
  loadq = d3.queue(1); // runs concurrently
  loadq.defer(filterLanguageData)
    .defer(makeNestedData)
    .defer(getUniqueContinents)
    .defer(adjustNestOrder)
    .defer(initColorMaps)
    .defer(calcColors)
    //.defer(passColorsToSubObjs)
    .await( (err) => {
      if (err) throw err;
      data.main = languageNest;
      if (callback) {
        callback(null);
      };
    });

  // functions

  function filterLanguageData(callback) {
    var filter = state.filters.endangermentRange;
    var languagesFiltered = state.langAll.filter( (item) => {
      return item.endangermentNum > filter[0] && item.endangermentNum < filter[1] // return only items where endangerment number is less than filter max and greater than filter min
    })
    filteredLanguageList = languagesFiltered;
    callback(null);
  }

  function getUniqueContinents(callback) {
   uniqueContinents = d3.set(filteredLanguageList, (item) => {
       return item.continents[0].properties.CONTINENT
     }).values();
   callback(null);
  }

  function adjustNestOrder( callback ) {
   languageNest.splice(2, 0, languageNest[0]); // switch africa/asia in list
   languageNest.splice(0, 1);
   callback(null);
  }

  function initColorMaps( callback ) {
   hueMap = d3.scaleLinear()
       .domain([0, 5])
       .range([0,360]);
   luminanceMap = d3.scaleLinear()
       .domain([1, 9])
       .range([75, 110]);
   callback(null);
  }

  function makeNestedData( callback ) {
   languageNest = d3.nest()
     .key(function(d) {return d.continents[0].properties.CONTINENT;})
     .sortKeys(d3.ascending)
     .key(function(d) {return d.endangermentNum;})
     .sortKeys(d3.descending)
     .entries(filteredLanguageList);
   callback(null);
  }

  function calcColors(callback) {  //language nest, assign color to each
   languageNest.map( (continent, i ) => {
     continent.colors = [];
     continent.values.map( (endangerment) => {
       endangerment.values.map( (language) => {
         //if (language.neighborhoods.length > 0) {
           //language.color = '#000000'
           language.groupColor = continent.colors[endangerment.key] = d3.hcl( hueMap(i) , 70, 70, 1 );
           language.color = continent.colors[endangerment.key] = d3.hcl( hueMap(i) , 70, luminanceMap(language.endangermentNum), 1 );

         //} else {
           //language.groupColor = continent.colors[endangerment.key] = d3.hcl( 0,0,90,1 ); // if no neigborhoods, assign just off white
         //}
       })
     });
   })

    //dModified.values.map( (item) => {
    //   endangermentList.push(item.key);
    //});

    // for each item in d.values
    //endangermentList.forEach( (endangerment) => {
    //   colors[endangerment] = d3.hcl( hueMap(i) , 50, luminanceMap(endangerment), 1 );
    //})
    // dModified.colors = colors;
    //console.log(colors)
    callback(null)
  }

  function passColorsToSubObjs(callback) {
   dModified = dModified.values.map( (item, i) => {
     itemModified = item
     itemModified.values[0].color = colors[item.values[0].endangermentNum]; // pass color of appropriate index to the subobject
     callback(null);
     return itemModified;
   })
  }
}


function filterData(string, data, callback) {
  let results = fuzzy.filter(string, data, searchOptions);
  let matches = results.map(function(el) { return el.original; });
  callback(matches)
}

function getData( collection, ids, callback ) { // id is optional

  let url = `../${collection}`;
  d3.json(url, function(json) {
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
  let url = `../languages/${query.min}.${query.max}`;
  d3.json(url, (json) => {
    callback(json)
  })
}
