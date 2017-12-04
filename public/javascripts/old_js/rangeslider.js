$( function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 10,
      values: [ 0, 10 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    //$( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
    //  " - $" + $( "#slider-range" ).slider( "values", 1 ) );
  } );
