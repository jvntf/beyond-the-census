// THINGS TO MAKE THE LIST SIDE PANEL FROM LANGUAGE DATASET

function updateList() {

  var textTarget = d3.select('#text-target'); // get target HTML node to append things to
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
        d3.selectAll('.lang').classed('listlang-hidden', true).classed('maplang-hidden', true)
        d3.selectAll(`.cont-${d.values[0].values[0].continents[0]._id}`).classed('listlang-hidden', false).classed('maplang-hidden', false)
        updateContinentCard(d.values[0].values[0].continents[0]._id, null)
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

// scroll list to provided element ID
function scrollList(id, callback) {
  let classString = `.list.lang.lang-${id}`;
  console.log(classString);
  $('#text-target').animate({
    'scrollTop':   $(`.list.lang.lang-${id}`).offset().top
  }, {
    'duration': 500,
    'queue': false,
    'done': () => { callback(null) }
  });
}
