// setup the buttons.
setupButtons();

width_scale_factor = 1.0;
height_scale_factor = 1.0;
var bb = d3.select('#legend').node().offsetWidth;
var margin = {right:0, left:0, top:0, bottom:0};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = 60; //bb*height_scale_factor - margin.top - margin.bottom;
draw_religion_legend("#legend", base_width, base_height);
//var div = document.getElementById("button_select_text");
//div.innerHTML = "Shows religions in all the districts of India";
draw_individual("india_districts_map");

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#plottype_buttongroup')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      //Draw relevant graph based on button click
      if (buttonId==="diversity") {

        //var x = document.getElementById("mainNav");
        //x.style.display = "none";

        //Remove previous legend
        d3.select("#legend").select("svg").remove();
        // Set text
        //var div = document.getElementById("button_select_text");
        //div.innerHTML = "Shows religions in all the districts of India";
        draw_diversity_legend("#legend", base_width, base_height);
        draw_diversity("india_districts_map");

      } else {

        d3.select("#legend").select("svg").remove();
        //var div = document.getElementById("button_select_text");
        //div.innerHTML = "Shows religious diversity index in all the districts of India";
        draw_religion_legend("#legend", base_width, base_height);
        draw_individual("india_districts_map");
      }
    });
}


function draw_individual(map_container) {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
  // This adds the map to your page
  var map1 = new mapboxgl.Map({
    container: map_container, // container id specified in the HTML
    style: 'mapbox://styles/mapbox/dark-v9', // style URL
    //center: [-74.0059, 40.7128], // initial map center in [lon, lat]
    //center: [2.1734, 41.3851],
    //center: [2.16711400548186, 41.39243462700611],
    //center: [-73.95397214865059, 40.729869916914076],
    center: [80.9629, 21.5937], // India
    //center: [82.9629, 10.5937], // India
    //center: [72.78165168781571, 19.13481211064585], //Greater Bombay
    zoom: screen.height/300, //3.1 //2.9 //3.25
    scrollZoom: false
  });

  map1.on('load', function() {
    map1.addLayer({
      id: 'collisions',
      type: 'circle',
      source: {
        type: 'geojson',
        //data: 'data/india_district.geojson' // replace this with the url of your own geojson
        //data: 'data/religion_location.geojson' // replace this with the url of your own geojson
        data: 'data/religion_location_scale5e4.geojson' // replace this with the url of your own geojson
      },
      
      paint: {
        'circle-color': [
            'match',
            ['get', 'religion'],
            0, '#ff9933', // Hindu
            1, '#009000', // Muslim
            2, '#0000FF', // Christian // #EE82EE',
            3, '#FFFF00', // Sikh
            4, '#ff0000', // Buddhist // '#bc9b1b',
            5, '#FFFFFF', // Jain
            '#a0a0a0'
        ], //'#79CCCD',
        // Add data-driven styles for circle radius
        
        'circle-radius': 2,
        
        'circle-opacity': 1
      }
      
    }, 'admin-2-boundaries-dispute');
  });

  // disable map zoom when using scroll
  map1.scrollZoom.disable();

  // Add zoom and rotation controls to the map.
  map1.addControl(new mapboxgl.NavigationControl());

}


function draw_diversity(map_container) {

    //mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
    var map1 = new mapboxgl.Map({
        container: map_container,
        style: 'mapbox://styles/mapbox/dark-v9',
        //center: [-74.0059, 40.7128],
        //center: [2.1734, 41.3851],
        //center: citycenter_latlog(city), //[-73.95397214865059, 40.729869916914076],
        //center: [2.16711400548186, 41.39243462700611],
        //center: [80.9629, 14.5937], // India
        //center: [78.9629, 10.5937], // India
        //center: [82.9629, 10.5937], // India
        //center: [82.9629, 20.5937], // India
        center: [80.9629, 21.5937], // India
        zoom: screen.height/300 //3.1 //3.25
    });

    map1.on('load', function() {
      map1.addLayer({
        id: 'diversity',
        type: 'circle',
        source: {
          type: 'geojson',
          //data: 'data/india_district.geojson' // replace this with the url of your own geojson
          //data: 'data/religion_location.geojson' // replace this with the url of your own geojson
          data: 'data/religion_location_scale5e4.geojson' // replace this with the url of your own geojson
        },
        
        paint: {
          'circle-color':
          [
              'interpolate',
              ['linear'],
              ['get', 'diversity'],
              0,   '#0000FF',
              0.3, '#FFFFFF',
              0.6,   '#00FF00'
          ], //'#79CCCD',
        // Add data-driven styles for circle radius
        
        'circle-radius': 2,
        
        'circle-opacity': 1
        }
        
      }, 'admin-2-boundaries-dispute');
    });

    // disable map zoom when using scroll
    map1.scrollZoom.disable();

    // Add zoom and rotation controls to the map.
    map1.addControl(new mapboxgl.NavigationControl());

}


function draw_religion_legend(idname, width, height) {
    
    var ordinal = d3.scaleOrdinal()
      .domain(["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Others"])
      .range(['#ff9933', '#009000', '#0000FF', '#FFFF00', '#ff0000', '#FFFFFF', '#a0a0a0']);

    //var svg = d3.select("svg");
    var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height);

    svg.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate("+30+",10)");
      //.attr("transform", "translate(50%, 50%)");

    var legendOrdinal = d3.legendColor()
      //d3 symbol creates a path-string, for example
      //"M0,-8.059274488676564L9.306048591020996,
      //8.059274488676564 -9.306048591020996,8.059274488676564Z"
      .shape("path", d3.symbol().type(d3.symbolCircle).size(100)())
      .shapePadding(35)
      //use cellFilter to hide the "e" cell
      //.cellFilter(function(d){ return d.label !== "e" })
      .orient("horizontal")
      .scale(ordinal);

    //svg.select(".legendOrdinal")
    //  .call(legendOrdinal);

    //svg.select(".legendOrdinal")
    //  .call(legendLinear);
    svg.select(".legendOrdinal")
        .call(legendOrdinal)
        .style("fill", "white")
        .style("font-size", "0.65rem");
}


function draw_diversity_legend(idname, width, height) {
    var linear = d3.scaleLinear()
      .domain([0, 0.3, 0.6])
      .range(["#0000FF", "#FFFFFF", "#00FF00"]);

    var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height);

    svg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate("+80+",10)");

    var legendLinear = d3.legendColor()
      .shapeWidth(30)
      .cells([])
      .orient('horizontal')
      .scale(linear);

    svg.select(".legendLinear")
      .call(legendLinear)
      .style("fill", "white")
      .style("font-size", "0.65rem");

    svg.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .text("Less diverse")
      .style("fill", "white")
      .style("font-size", "0.65rem");

    svg.append("text")
      .attr("x", 250)
      .attr("y", 20)
      .text("More diverse")
      .style("fill", "white")
      .style("font-size", "0.65rem");
}
