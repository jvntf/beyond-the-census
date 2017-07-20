console.log('narrative.js loaded')

var narrativePanel = d3.select('#detail-container')

function toggleNarrativePanel() {
    d3.select('#detail-container')
      .classed("offscreen-right", d3.select('#detail-container').classed("offscreen-right") ? false : true);
}

function showNarrativePanel() {
    d3.select('#detail-container')
      .classed("offscreen-right", false);
}
