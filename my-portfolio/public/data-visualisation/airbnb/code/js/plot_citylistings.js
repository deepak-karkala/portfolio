//Setup buttons
setupButtons("#listings_city_buttongroup");

///////////////////// City 1////////////////////////////
var listings_city = 'New York City';
//var city2 = 'Amsterdam';

var listings1_plot_type = "Individual";
var div = document.getElementById("listings_city_plottext");
div.innerHTML = "All Airbnb listings in " + listings_city;
plot_individual_listings(listings_city, 'listings-city-container1');

// Legend
width_scale_factor = 1.0;
height_scale_factor = 1.0;
var bb = d3.select('#listings_city_legend_text').node().offsetWidth;
var margin = {right:10, left:10, top:10, bottom:10};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
plot_individual_legend("#listings_city_legend_text", base_width, base_height);


$('#select_city').on('change', function(){
    listings_city = this.value;
    if (listings1_plot_type=="Individual") {
        plot_individual_listings(listings_city, 'listings-city-container1');
    } else if (listings1_plot_type=="Density") {
        plot_density_listings(listings_city, 'listings-city-container1');
    } else if (listings1_plot_type=="Price") {
        plot_price(listings_city, 'listings-city-container1');
    }
});

$("#listings_city_button1").click(function() {
    listings1_plot_type = "Individual";
    var div = document.getElementById("listings_city_plottext");
    div.innerHTML = "All Airbnb listings in " + listings_city;
    plot_individual_listings(listings_city, 'listings-city-container1');
    d3.select("#listings_city_legend").select("svg").remove();
    plot_individual_legend("#listings_city_legend_text", base_width, base_height);
    //plot_individual_listings(city2, 'listings2_city2');
});
$("#listings_city_button2").click(function() {
    listings1_plot_type = "Density";
    var div = document.getElementById("listings_city_plottext");
    div.innerHTML = "Density of Airbnb listings in " + listings_city + " neighbourhoods";
    plot_density_listings(listings_city, 'listings-city-container1');
    plot_density_legend("#listings_city_legend_text", base_width, base_height);
    //plot_density_listings(city2, 'listings2_city2');
});
$("#listings_city_button3").click(function() {
    listings1_plot_type = "Price";
    var div = document.getElementById("listings_city_plottext");
    div.innerHTML = "Price of Airbnb listings in " + listings_city + " neighbourhoods";
    plot_price(listings_city, 'listings-city-container1');
    d3.select("#listings_city_legend").select("svg").remove();
    plot_price_legend("#listings_city_legend_text", base_width, base_height);
    //plot_price(city2, 'listings2_city2');
});
/////////////////////////////////////////////////////////


// Colors for different density
//var color_density = d3.scaleSequential(d3.interpolateOranges).domain([0,1000]);
//var color_density = d3.scaleSequential(d3.interpolateYlOrRd).domain([0,1000]);
//var color_density = d3.scaleLinear().domain([0,1000]).range(["#F2F12D", "#723122"]);

/*
///////////////////////// City 2 ////////////////////////
$('#select_city2').on('change', function(){
    city2 = this.value;
    if (listings1_plot_type=="Individual") {
        plot_individual_listings(city2, 'listings2_city2');
    } else if (listings1_plot_type=="Density") {
        plot_density_listings(city2, 'listings2_city2');
    } else if (listings1_plot_type=="Price") {
        plot_price(city2, 'listings2_city2');
    }
});
/////////////////////////////////////////////////////////
*/

function citycenter_latlog(city) {
    dfll = {
     'Amsterdam': [4.888966107423247, 52.365016079866514],
     'Antwerp': [4.4139292272680315, 51.21378555624961],
     'Asheville': [-82.5587339314082, 35.58184654887986],
     'Athens': [23.733934324075236, 37.98119798246257],
     'Austin': [-97.75133593986969, 30.27605926262372],
     'Barcelona': [2.16711400548186, 41.39243462700611],
     'Berlin': [13.407150440988978, 52.5096704706105],
     'Boston': [-71.08394332204757, 42.3399986684652],
     'Brussels': [4.363338150969672, 50.83797601447168],
     'Chicago': [-87.66352711414041, 41.906927834816614],
     'Copenhagen': [12.557519057929465, 55.681294015165015],
     'Denver': [-104.97656336110967, 39.73798024121983],
     'Dublin': [-6.2537809488665745, 53.34431179562305],
     'Edinburgh': [-3.1973785954433964, 55.950857265335024],
     'Geneva': [6.1440413105530665, 46.20549787348727],
     'Hong Kong': [114.15933711880362, 22.301690926324323],
     'London': [-0.12710484279376477, 51.51042472724741],
     'Los Angeles': [-118.33425165122814, 34.05622035779748],
     'Madrid': [-3.696779311601697, 40.42058336311059],
     'Mallorca': [2.935053175237771, 39.639067971580104],
     'Manchester': [-2.2367326713180256, 53.462720658290095],
     'Melbourne': [145.0072539915391, -37.82691793190739],
     'Montreal': [-73.5889641954875, 45.51685894573429],
     'Nashville': [-86.76778032033943, 36.15865773110353],
     'New Orleans': [-90.07597741333352, 29.957731018666095],
     'New York City': [-73.95397214865059, 40.729869916914076],
     'Northern Rivers': [153.52334908497397, -28.655261302112088],
     'Oakland': [-122.24401403374435, 37.81631599111666],
     'Paris': [2.345312373671295, 48.8640779762788],
     'Portland': [-122.64873513739158, 45.52826753798765],
     'Quebec City': [-71.24636784490497, 46.81677220506045],
     'Rome': [12.481584302232585, 41.893155361697865],
     'San Diego': [-117.18828107745769, 32.77592283899223],
     'San Francisco': [-122.43260551327455, 37.763545522805856],
     'Santa Cruz County': [-121.9869505736463, 36.98671060266488],
     'Seattle': [-122.3331032929215, 47.62896083310482],
     'Sydney': [151.20842215444222, -33.863313607670435],
     'Tasmania': [147.1737988052359, -42.227743410449044],
     'Toronto': [-79.39741326705354, 43.674845795622105],
     'Vancouver': [-123.11250717786356, 49.26386678393726],
     'Venice': [12.320430170091372, 45.44463057697423],
     'Victoria': [-123.41183634108508, 48.519457930230956],
     'Vienna': [16.359802561784154, 48.20629064904804],
     'Washington, D.C.': [-77.02026409695864, 38.91257075334757]
    };
    return dfll[city];
}

function plot_density_listings(city, map_container) {
    //mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
    var map1 = new mapboxgl.Map({
        container: map_container,
        style: 'mapbox://styles/mapbox/dark-v9',
        //center: [-74.0059, 40.7128],
        //center: [2.1734, 41.3851],
        center: citycenter_latlog(city), //[-73.95397214865059, 40.729869916914076],
        //center: [2.16711400548186, 41.39243462700611],
        zoom: 9.5
    });

    var color_city_density = d3.scaleThreshold()
                                .domain([0, 50, 200, 500, 750, 1000, 2000, 3000, 5000])
                                .range(['#F2F12D', '#EED322', '#E6B71E', '#DA9C20',
                                        '#CA8323', '#B86B25', '#A25626', '#8B4225', '#723122']);

    map1.on('load', function () {

        map1.addLayer({
            'id': 'density',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': 'data/cities/' + city + '/neighbourhoods_numlistings.geojson' // replace this with the url of your own geojson
            },
            'layout': {},
            'paint': {
                'fill-color':
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'num_listings'],
                    /*
                    0, color_density(0),
                    1000, color_density(1000)
                    */
                    0, '#F2F12D',
                    50, '#EED322',
                    200, '#E6B71E',
                    500, '#DA9C20',
                    750, '#CA8323',
                    1000, '#B86B25',
                    2000, '#A25626',
                    3000, '#8B4225',
                    5000, '#723122'
                ],
                'fill-opacity': 0.75
            }
        });

        // When a click event occurs on a feature in the states layer, open a popup at the
        // location of the click, with description HTML from its properties.
        map1.on('click', 'density', function (e) {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(e.features[0].properties.num_listings + " listings in " + e.features[0].properties.neighbourhood)
                .addTo(map1);
        });
        // Change the cursor to a pointer when the mouse is over the states layer.
        map1.on('mouseenter', 'density', function () {
            map1.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map1.on('mouseleave', 'density', function () {
            map1.getCanvas().style.cursor = '';
        });

    });

    // disable map zoom when using scroll
    map1.scrollZoom.disable();

    // Add zoom and rotation controls to the map.
    map1.addControl(new mapboxgl.NavigationControl());
}


function plot_price(city, map_container) {
    //mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
    var map1 = new mapboxgl.Map({
        container: map_container,
        style: 'mapbox://styles/mapbox/dark-v9',
        //center: [-74.0059, 40.7128],
        //center: [2.1734, 41.3851],
        center: citycenter_latlog(city), //[-73.95397214865059, 40.729869916914076],
        //center: [2.16711400548186, 41.39243462700611],
        zoom: 9.5
    });

    // Colors for different prices
    var color_city_price = d3.scaleSequential(d3.interpolateBlues).domain([0,150]);

    map1.on('load', function () {

        map1.addLayer({
            'id': 'price',
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': 'data/cities/' + city + '/neighbourhoods_price.geojson' // replace this with the url of your own geojson
            },
            'layout': {},
            'paint': {
                'fill-color':
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'median_price'],
                    0, color_city_price(0),
                    150, color_city_price(150)
                    /*
                    0, '#F2F12D',
                    20, '#EED322',
                    40, '#E6B71E',
                    60, '#DA9C20',
                    80, '#CA8323',
                    100, '#B86B25',
                    200, '#A25626',
                    300, '#8B4225',
                    500, '#723122'
                    */
                ],
                'fill-opacity': 0.75
            }
        });

        // When a click event occurs on a feature in the states layer, open a popup at the
        // location of the click, with description HTML from its properties.
        map1.on('click', 'price', function (e) {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML("Average price: USD " + e.features[0].properties.median_price + " in " +
                         e.features[0].properties.neighbourhood)
                .addTo(map1);
        });
        // Change the cursor to a pointer when the mouse is over the states layer.
        map1.on('mouseenter', 'price', function () {
            map1.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map1.on('mouseleave', 'price', function () {
            map1.getCanvas().style.cursor = '';
        });

    });

    // disable map zoom when using scroll
    map1.scrollZoom.disable();

    // Add zoom and rotation controls to the map.
    map1.addControl(new mapboxgl.NavigationControl());
}


function plot_individual_listings(city, map_container) {
  //mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
  // This adds the map to your page
  var map1 = new mapboxgl.Map({
    container: map_container, // container id specified in the HTML
    style: 'mapbox://styles/mapbox/dark-v9', // style URL
    //center: [-74.0059, 40.7128], // initial map center in [lon, lat]
    //center: [2.1734, 41.3851],
    //center: [2.16711400548186, 41.39243462700611],
    center: citycenter_latlog(city), //[-73.95397214865059, 40.729869916914076],
    zoom: 9.5
  });

  map1.on('load', function() {
    map1.addLayer({
      id: 'collisions',
      type: 'circle',
      source: {
        type: 'geojson',
        data: 'data/cities/' + city + '/listings.geojson' // replace this with the url of your own geojson
      },
      paint: {
        'circle-color': [
            'match',
            ['get', 'room_type'],
            0, '#FF4D4D', //'#DA621E', //'#f58231', //'#FF0000',
            1, '#ADFF2F', //'#00FF00', //'#0000FF', //'#4363d8', //'#00FF00',
            2, '#0000FF', //'#3cb44b', //'#0000FF',
            /* other */ '#ccc'
        ], //'#79CCCD',
        // Add data-driven styles for circle radius
        'circle-radius': {
          property: 'price',
          type: 'exponential',
          stops: [
            [30, 1],
            [300, 4]
          ]
        },
        'circle-opacity': 1
      }
    }, 'admin-2-boundaries-dispute');
  });

  // disable map zoom when using scroll
  map1.scrollZoom.disable();

  // Add zoom and rotation controls to the map.
  map1.addControl(new mapboxgl.NavigationControl());
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons(idname) {
  d3.select(idname)
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

    });
}

function plot_individual_legend(idname, width, height) {

    var div = document.getElementById("listings_city_legend_text");
    div.innerHTML = "Types of listings:";
    div.innerHTML += "&nbsp &nbsp &nbsp";
    //var div = document.getElementById("listings_city_legend");
    //div.innerHTML = "2 Types of listings:";
    div.innerHTML += '<svg height="20" width="20"><circle cx="10" cy="15" r="5" stroke="black" stroke-width="3" fill="#FF4D4D" /></svg>';
    div.innerHTML += 'Private Room';
    div.innerHTML +='<svg height="20" width="20"><circle cx="10" cy="15" r="5" stroke="black" stroke-width="3" fill="#ADFF2F" /></svg>';
    div.innerHTML += 'Entire apartment';
    div.innerHTML +='<svg height="20" width="20"><circle cx="10" cy="15" r="5" stroke="black" stroke-width="3" fill="#0000FF" /></svg>';
    div.innerHTML += 'Shared room';
    /*
    var ordinal = d3.scaleOrdinal()
      .domain(["Private Room", "Entire apartment", "Shared room"])
      .range(['#FF4D4D', '#ADFF2F', '#0000FF']);

    //var svg = d3.select("svg");
    var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height);

    svg.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(20,30)");

    var legendOrdinal = d3.legendColor()
      //d3 symbol creates a path-string, for example
      //"M0,-8.059274488676564L9.306048591020996,
      //8.059274488676564 -9.306048591020996,8.059274488676564Z"
      .shape("path", d3.symbol().type(d3.symbolCircle).size(100)())
      .shapePadding(20)
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
        .style("font-size", 8*width/200+2+"px");

    svg.append("text")
        .attr("x", 10)
        .attr("y", 15)
        .attr("class", "side-info")
        .text("Type of listing")
        .style("font-size", 8*width/200+2+"px")
        .style("fill", "white");
    */
}

//function plt

function plot_price_legend(idname, width, height) {
  var div = document.getElementById("listings_city_legend_text");
  div.innerHTML = "Average price (USD) per night in neighbourhoods:";
  div.innerHTML += "&nbsp &nbsp &nbsp";
  div.innerHTML += "<img src='img/listings_city/legend_city_price.png' width=100 height=30></img>";

  //var div = document.getElementById("listings_city_legend");
  //div.innerHTML = "<img src='img/listings_city/legend_city_price.png' width=50 height=30></img>";

  /*
  var div = document.getElementById("listings_city_legend");
  div.innerHTML = "";

  var linear = d3.scaleLinear()
    .domain([50, 150])
    .range([color_price(50), color_price(250)]);

  var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height);

  svg.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(10,10)");

  var legendLinear = d3.legendColor()
    .shapeWidth(15*width/500+20)
    .cells([50, 75, 100, 125, 150])
    .orient('horizontal')
    .scale(linear);

  svg.select(".legendLinear")
    .call(legendLinear)
    .style("fill", "white")
    .style("font-size", 6*width/300+2+"px");
  */
/*
  svg.append("text")
    .attr("x", 10)
    .attr("y", 10)
    .attr("class", "side-info")
    .text("Average price (USD) of a listing per night")
    .style("font-size", 8*width/220+2+"px")
    .style("fill", "white");
*/
}

function plot_density_legend(idname, width, height) {

  var div = document.getElementById("listings_city_legend_text");
  div.innerHTML = "Number of listings in neighbourhoods";
  div.innerHTML += "&nbsp &nbsp &nbsp";
  div.innerHTML += "<img src='img/listings_city/legend_city_density.png' width=150 height=30></img>";
/*
  var linear = d3.scaleLinear()
                .domain([50, 200, 500, 1000, 3000, 5000])
                .range(['#EED322', '#E6B71E', '#DA9C20',
                        '#B86B25', '#8B4225', '#723122']);

  var svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height);

  svg.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(10,10)");

  var legendLinear = d3.legendColor()
    .shapeWidth(15*width/500+20)
    .cells([50, 200, 500, 1000, 3000, 5000])
    .orient('horizontal')
    .scale(linear);

  svg.select(".legendLinear")
    .call(legendLinear)
    .style("fill", "white");
    //.style("font-size", 6*width/300+2+"px");
*/
}
