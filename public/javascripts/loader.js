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

  //begin data fetching part:
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

                // begin data modification part:

                // declare variables
                var languageNest,
                    q,
                    uniqueContinents,
                    endangermentList = [],
                    hueMap,
                    luminanceMap,
                    dModified,
                    numContinents;

                // declare and run queue
                loadq = d3.queue(1); // runs concurrently
                loadq.defer(makeNestedData)
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
                function getUniqueContinents(callback) {
                 uniqueContinents = d3.set(data.languages, (item) => {
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
                     .domain([0, 9])
                     .range([75, 110]);
                 callback(null);
                }

                function makeNestedData( callback ) {
                 languageNest = d3.nest()
                   .key(function(d) {return d.continents[0].properties.CONTINENT;})
                   .sortKeys(d3.ascending)
                   .key(function(d) {return d.endangermentNum;})
                   .sortKeys(d3.descending)
                   .entries(data.languages);
                 //console.log(languageNest)
                 callback(null);
                }

                function calcColors(callback) {  //language nest, assign color to each

                 languageNest.map( (continent, i ) => {
                   console.log(i)
                   continent.colors = [];
                   continent.values.map( (endangerment) => {
                     endangerment.values.map( (language) => {
                       language.color = continent.colors[endangerment.key] = d3.hcl( hueMap(i) , 50, luminanceMap(endangerment.key), 1 );
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
                  console.log(endangermentList)
                  console.log(languageNest)
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

              })
            })
          })
        })
      })
    }
  }, 250)
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
