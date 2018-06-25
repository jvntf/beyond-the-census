// handle filter behavior
// builds a filtered group of populated languages on the state.langGroup object


// takes the entire state.filters object and applies it to state.langAll array to get state.langGroup
// also re-renders list every time the selection changes
function applyFilters() {
  hideDetails();
  clearOverlay();
  // setup: define searchOptions (used for searchstring filtering, but better to declare outside of array.filter to improve speed slightly)
  var searchOptions = {
    //  pre: '<' // wrap search results in string with extra characters?
    //, post: '>' // see above
    extract: function(el) { return el.language } // define string that search runs on (can be compounded from multiple fields)
  };

  // filter full language set based on various criteria in the state.filters subobject, listed below
  state.langGroup = state.langAll.filter( (lang) => {
    // state.filters.searchString - search bar input, test whether string matches language name, alt language names, etc.
      var searchString = true; // set default
      if (state.filters.searchString.length > 0) {
        var searchResult = fuzzy.filter(state.filters.searchString, [lang], searchOptions);
        if (searchResult[0] && searchResult[0].score > 0 ) searchString = true;
        else searchString = false;
      }

    // state.filters.globalAttr - criteria relating to global geography (could be continent, country etc)
    var globalAttr = (state.filters.globalAttr.key.length > 0) ? (lang[state.filters.globalAttr.key].filter(function(e){return e._id == state.filters.globalAttr.value }).length>0):true

    // state.filters.localAttr - criteria relating to local geography (could be neighborhood name, institution type etc.)
    var localAttr = (state.filters.localAttr.key.length > 0) ? (lang[state.filters.localAttr.key].filter(function(e){return e._id == state.filters.localAttr.value }).length>0):true

    // state.filters.endangermentRange
    var endangermentRange = lang.endangermentNum > state.filters.endangermentRange[0]
                             && lang.endangermentNum < state.filters.endangermentRange[1]

    // using the boolean for each criteria (applied to each item) return whether the item is shown or not
    return endangermentRange
             && globalAttr
              && localAttr
               && searchString
  })
  mapShowSelected();
  updateList();
}

// rebuild list with all languages
function resetFilters() {
  console.log('resetfilters')
  var q = d3.queue(1)  // concurrency of 1, sets queue to run in series
    .defer( (callback) => {
        // bring all back to langGroup array
        state.langGroup = state.langAll;
        // reset filters
        state.filters = {
          endangermentRange: [0,10],
          searchString: '',
          groupBy: '',
          localAttr: {
            key: '',
            value: ''
          },
          globalAttr: {
            key: '',
            value: ''
          }
        };
        callback(null);
    })
    .defer( (callback) => {
      //console.log(state.langGroup)
      updateList();
      //console.log(state.langGroup)
      callback(null);
    })

    .await( (err) => {
      resetUI(); // put sliders back
      mapShowAll();
      resetMap(); // zoom back to borough view
      setCardVisible(false); // hide detail card
      if (err) throw err;
    })
}
