
///////////////////// City 1////////////////////////////
var tophosts_city = 'Amsterdam';

var div = document.getElementById("tophosts_plottext");
div.innerHTML = "Top hosts in " + tophosts_city;
plot_tophosts_listings(tophosts_city, 'tophosts_plot');
//write_tophosts_info(tophosts_city);

$('#select_city_tophosts').on('change', function(){
    tophosts_city = this.value;
    var div = document.getElementById("tophosts_plottext");
    div.innerHTML = "Top hosts in " + tophosts_city;
    plot_tophosts_listings(tophosts_city, 'tophosts_plot');
    //write_tophosts_info(tophosts_city);
});


function write_tophosts_info(city) {

    if (city=="New York City") {
      city = "NYC";
    }
    d3.select("#tophosts_sideinfo_fracHome").select("svg").remove();
    d3.select("#tophosts_sideinfo_fracUsersMoreThanOne").select("svg").remove();

    var div = document.getElementById("tophosts_sideinfo_totallistings");
    div.innerHTML = "Total number of listings in " + city + ":";

    div = document.getElementById("tophosts_sideinfo_totalhosts");
    div.innerHTML = "Total number of hosts in " + city + ":";

    width_scale_factor = 0.70;
    height_scale_factor = 0.70;
    var margin = {right:10, left:10, top:10, bottom:10};

    idname = "#tophosts_sideinfo_fracHome";
    var bb = d3.select(idname).node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    draw_transition_pie_chart(idname, base_width, base_height);

    idname = "#tophosts_sideinfo_fracUsersMoreThanOne";
    bb = d3.select(idname).node().offsetWidth;
    base_width = bb*width_scale_factor - margin.left - margin.right;
    base_height = bb*height_scale_factor - margin.top - margin.bottom;
    draw_transition_pie_chart(idname, base_width, base_height);

}


function plot_tophosts_listings(city, map_container) {

  //mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';
  mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
  // This adds the map to your page
  var map1 = new mapboxgl.Map({
    container: map_container, // container id specified in the HTML
    style: 'mapbox://styles/mapbox/dark-v9', // style URL
    center: citycenter_latlog(city), //[-73.95397214865059, 40.729869916914076],
    zoom: 11
  });

  
  map1.on('load', function() {

    var layers = map1.getStyle().layers;
    // Find the index of the first symbol layer in the map style
    var firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }
    // Draw network graph for top hosts
    //draw_host_network(city, map1);
    // Draw polygon for top hosts
    draw_host_polygon(city, map1, firstSymbolId);

  });

  // disable map zoom when using scroll
  map1.scrollZoom.disable();

  // Add zoom and rotation controls to the map.
  map1.addControl(new mapboxgl.NavigationControl());

}

function draw_host_polygon(city, map, firstSymbolId) {

  var host_color = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff"];
  //var host_color = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#9a6324"];
  //var host_color = ["#f58231", "#ffe119", "#bfef45", "#4363d8", "#e6beff"];

  $.getJSON('data/cities/' + city + '/top_hosts.json', function(json) {
      tophosts_json = json; // this will show the info it in firebug console

      num_top_hosts = 5;
      for(var k=0; k<tophosts_json.length; k++) {
          tophosts_json[k]["coords"].reverse();
      }

      for(var hostid=0; hostid<num_top_hosts; hostid++) {
          var host_coords = [];
          count = 0;

          for(var j=0; j<tophosts_json.length; j++) {
              if (tophosts_json[j]["hostid"]===hostid) {
                host_coords[count] = tophosts_json[j]["coords"];
                count+=1;
              }
          }

          map.addLayer({
              'id': 'host_polygon'+'-'+hostid,
              'type': 'fill',
              'source': {
                  'type': 'geojson',
                  'data': {
                      'type': 'Feature',
                      'geometry': {
                          'type': 'Polygon',
                          'coordinates': [host_coords]
                      }
                  }
              },
              'layout': {},
              'paint': {
                  'fill-color': host_color[hostid],
                  'fill-opacity': 0.25
              }
          }, firstSymbolId);

      }

  });

}


function draw_host_network(city, map) {

    var host_color = ["#ff0000", "#00ff00", "#0000ff"];

    $.getJSON('data/cities/' + city + '/top_hosts.json', function(json) {
        tophosts_json = json; // this will show the info it in firebug console

        num_top_hosts = 2;

        for(var i=0; i<tophosts_json.length; i++) {
          tophosts_json[i]["coords"].reverse();
        }

        var count = 0;
        for(var j=0; j<tophosts_json.length; j++) {
          coord1 = tophosts_json[j]["coords"];

          for(var k=0; k<tophosts_json.length; k++) {

              host1 = tophosts_json[j]["hostid"];
              host2 = tophosts_json[k]["hostid"];

              if ( (host1===host2) && (host1<num_top_hosts) && (j!==k)) {
                  coord2 = tophosts_json[k]["coords"];
                  
                  count++;

                  map.addLayer({
                      "id": "route"+j+"-"+k,
                      "type": "line",
                      "source": {
                          "type": "geojson",
                          "data": {
                              "type": "Feature",
                              "properties": {},
                              "geometry": {
                                  "type": "LineString",
                                  "coordinates": [
                                      coord1,
                                      coord2
                                  ]
                              }
                          }
                      },
                      "layout": {
                          "line-join": "round",
                          "line-cap": "round"
                      },
                      "paint": {
                          "line-color": host_color[host1],
                          "line-width": 2
                      }
                  });

              }
          }

        }

    });

}




// Lat long for city centers
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



function draw_transition_pie_chart(idname, width, height) {

    var tau = 2 * Math.PI; // http://tauday.com/tau-manifesto

    // An arc function with all values bound except the endAngle. So, to compute an
    // SVG path string for a given angle, we pass an object with an endAngle
    // property to the `arc` function, and it will return the corresponding string.
    var arc = d3.arc()
        .innerRadius(1)
        .outerRadius(20)
        .startAngle(0);

    // Get the SVG container, and apply a transform such that the origin is the
    // center of the canvas. This way, we don’t need to position arcs individually.
    var svg = d3.select(idname).append("svg"),
        //width = +svg.attr("width"),
        //height = +svg.attr("height"),
        //g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        g = svg.append("g").attr("transform", "translate(0,0)");

    // Add the background arc, from 0 to 100% (tau).
    var background = g.append("path")
        .datum({endAngle: tau})
        //.style("fill", "#ddd")
        .style("fill", "white")
        .attr("d", arc);

    // Add the foreground arc in orange, currently showing 12.7%.
    var foreground = g.append("path")
        .datum({endAngle: 0.127 * tau})
        .style("fill", "orange")
        .attr("d", arc)
        .transition()
          .duration(1250)
          .attrTween("d", arcTween(Math.random() * tau));

    /*
    // Every so often, start a transition to a new random angle. The attrTween
    // definition is encapsulated in a separate function (a closure) below.
    d3.interval(function() {
      foreground.transition()
          .duration(750)
          .attrTween("d", arcTween(Math.random() * tau));
    }, 1500);
    */

    // Returns a tween for a transition’s "d" attribute, transitioning any selected
    // arcs from their current angle to the specified new angle.
    function arcTween(newAngle) {

      return function(d) {
        var interpolate = d3.interpolate(d.endAngle, newAngle);

        return function(t) {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      };
    }

}

/*
function plot_tophosts_listings(city, map_container) {
  latlong = citycenter_latlog(city).reverse();
  var map = L.map(map_container)
    .setView(latlong, 9.5);

  accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';

  // Replace 'mapbox.streets' with your map id.
  L.tileLayer('https://api.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=' + accessToken, {
    attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // create a red polyline from an array of LatLng points
  var latlngs = [
      [40.72345786541687, -73.99302892060804],
      [40.59696156539114, -73.75524118295918]
  ];
  var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
  // zoom the map to the polyline
  map.fitBounds(polyline.getBounds());
}
*/
