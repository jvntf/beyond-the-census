// methods to modify the selection state - used to hide/show/recolor objects on the map, list, and info card



function selectSingleLang(langid) {
  //var padCalc = window.innerWidth * 0.25
  //map.flyToBounds(input.queensbounds, {paddingTopLeft: [ 30,30 ], paddingBottomRight: [ padCalc,30 ]} );
  var q = d3.queue(1)  // concurrency of 1, sets queue to run in series
    .defer( (callback) => {
      var langSingle = state.langGroup.find( (item) => {
        return item._id == langid;

      })
        callback(null);
    })
    .await( (err) => {
      if (err) throw err;
      //console.log(d)

      //d3.selectAll('.list.lang').classed('listlang-hidden', true)
      //d3.selectAll(`.list.lang-${d._id}`).classed('listlang-hidden', false)
      //d3.selectAll(`.list.lang-${d._id}`).select(this.parentNode).select(this.parentNode).raise();

      var langSingle = state.langGroup.find( (item) => {
        return item._id == langid
      })

      //d3.selectAll('.map.lang').classed('maplang-hidden', true)
      //d3.selectAll(`.map.lang-${d._id}`).classed('maplang-hidden', false)
      //d3.selectAll(`.map.lang-${d._id}`).select(this.parenltNode).select(this.parentNode).raise();
      //showNarrativePanel();
      updateLanguageCard(langSingle._id);
      updateGlobe(langSingle);
      //d3.selectAll('.globe.country').classed('globe-hidden', true)
      //d3.selectAll('.globe.lang').classed('globe-hidden', true)

      langSingle.countries.forEach( (item) => {
        d3.select(`.globe.country-${item._id}`).classed('globe-hidden', false).attr('stroke', () => {return langSingle.color})
      })

      //d3.selectAll(`.globe.lang-${langSingle._id}`).classed('globe-hidden', false)

      //modifyMapFromList(langSingle._id);
      mapHighlightSingle(langSingle._id);
      connect(langSingle._id);
    })


}
