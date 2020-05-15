//draw_leaflet_map();
//draw_leaflet_topojson_district_map("india_cases_map");
map_container = "india_cases_map";
type = "confirmed";
draw_leaflet_topojson_state_map(map_container, type);

//map_container = "india_deaths_map";
//type = "deaths";
//draw_leaflet_topojson_state_map(map_container, type);


function draw_leaflet_topojson_state_map(map_container, type) {
  L.TopoJSON = L.GeoJSON.extend(
        {
          addData: function(jsonData) 
          {    
            if (jsonData.type === "Topology") 
            {
              for (key in jsonData.objects) 
              {
                geojson = topojson.feature( jsonData, 
                        jsonData.objects[key]);
                L.GeoJSON.prototype.addData.call(this, geojson);
              }
            }    
            else 
            {
              L.GeoJSON.prototype.addData.call(this, jsonData);
            }
          }  
        });


  var map = L.map(map_container,
                  {maxZoom:12,minZoom:3},
                  topoLayer = new L.TopoJSON(),
                  )
             .setView([23.5937, 80.9629], 4.25);
  map.scrollWheelZoom.disable();

  // Add layer
  //$.getJSON('data/india.json').done(addTopoData());
  
  console.log(type);

  $.getJSON('data/india.json').done( function(topoData, type) {
    topoLayer.addData(topoData);
    topoLayer.addTo(map);
    topoLayer.eachLayer(handleLayer_state(topoLayer, type));
  });


  function addTopoData(topoData)
  {
    // 1) fills the data inside the topoLayer
    // 2) append the layer to the Leaflet-widget 'map'
    // 3) calls a function called 'handleLayer' for each element
    

    topoLayer.addData(topoData);
    topoLayer.addTo(map);
    topoLayer.eachLayer(handleLayer_state);
  }

  function handleLayer_state(layer, type)
  {  
    console.log(type);
    // set some self explanatory attributes
    //if (type=="confirmed") {
      color_feature = parseInt(layer.feature.properties.confirmed);
    //} else {
    //  color_feature = parseInt(layer.feature.properties.deaths);
    //}

    layer.setStyle
    ({
      fillColor : getColor_state(color_feature),
      fillOpacity: 1.0,
      color:'#ffffff',
      weight:0.75,
      opacity:0.75
    });

    layer.on
    ({
        mouseover: enterLayer,
        mouseout: leaveLayer
    });
    if (type=="confirmed") {
      layer.bindTooltip(`<div class="well">`+layer.feature.properties.confirmed+` cases in `+layer.feature.properties.st_nm+`</div>`);
    } else {
      layer.bindTooltip(`<div class="well">`+layer.feature.properties.deaths+` deaths in `+layer.feature.properties.st_nm+`</div>`);
    }
  }

}




function draw_leaflet_topojson_district_map(map_container) {
  /*
      * Extension for Leaflet to use TopoJSON
      * Snippet by (c) 2013 Ryan Clark
      * https://gist.github.com/rclark/5779673
      */
  L.TopoJSON = L.GeoJSON.extend(
        {
          addData: function(jsonData) 
          {    
            if (jsonData.type === "Topology") 
            {
              for (key in jsonData.objects) 
              {
                geojson = topojson.feature( jsonData, 
                        jsonData.objects[key]);
                L.GeoJSON.prototype.addData.call(this, geojson);
              }
            }    
            else 
            {
              L.GeoJSON.prototype.addData.call(this, jsonData);
            }
          }  
        });


  var map = L.map(map_container,
                  {maxZoom:12,minZoom:3},
                  topoLayer = new L.TopoJSON(),
                  )
             .setView([23.5937, 80.9629], 4.25);
  map.scrollWheelZoom.disable();

  state_name_list = ['odisha', 'telangana', 'meghalaya', 'karnataka', 'haryana', 'bihar', 'andhrapradesh',
                      'jammukashmir','westbengal','kerala', 'chhattisgarh', 'andamannicobarislands',
                      'jharkhand','ladakh','uttarpradesh','mizoram','lakshadweep','nagaland','tamilnadu',
                      'dadranagarhaveli','delhi','puducherry','madhyapradesh','arunachalpradesh','uttarakhand',
                      'manipur','tripura','gujarat','goa','assam','maharashtra','punjab','sikkim','rajasthan',
                      'chandigarh','himachalpradesh'];

  // Load state topodata and add as layers
  for (var i=0; i<state_name_list.length; i++) {
    state_name = state_name_list[i]
      $.getJSON('data/state_geojson_data_howIndiaLives/'+state_name+'.json').done(addTopoData);
  }

  //L.rectangle([[23.5937, 80.9629], [25.6137, 82.1629]]).bindTooltip("test").addTo(map);


  function addTopoData(topoData)
  {
    // 1) fills the data inside the topoLayer
    // 2) append the layer to the Leaflet-widget 'map'
    // 3) calls a function called 'handleLayer' for each element
    

    topoLayer.addData(topoData);
    topoLayer.addTo(map);
    topoLayer.eachLayer(handleLayer_district);
  }

  function handleLayer_district(layer)
  {  
    // set some self explanatory attributes
    layer.setStyle
    ({
      fillColor : getColor_district(parseInt(layer.feature.properties.cases)),
      fillOpacity: 1.0,
      color:'#ffffff',
      weight:0.75,
      opacity:0.75
    });

    layer.on
    ({
        mouseover: enterLayer,
        mouseout: leaveLayer
    });

    layer.bindTooltip(`<div class="well">`+layer.feature.properties.cases+` cases in `+layer.feature.properties.district+`</div>`);
  }
}


function enterLayer() 
{
  //console.log(this["feature"]["geometry"]["coordinates"]);
  this.bringToFront();
  this.setStyle
  ({
    fillOpacity: 0.65,
    color:'#000000',
    weight:1.5,
    opacity:0.9
  });
}
  
function leaveLayer() 
{
  this.bringToBack();
  this.setStyle
  ({
    fillOpacity: 1.0,
    color:'#ffffff',
    weight:0.75,
    opacity:0.75
  });
}



function getColor_district(d) {

    var color_scale = d3.scaleSequential(d3.interpolateYlOrRd);

    return d == 0 ? color_scale(0) :
           d < 10  ? color_scale(0.2) :
           d < 50  ? color_scale(0.4) :
           d < 100  ? color_scale(0.6) :
           d < 500  ? color_scale(0.8) :
                      color_scale(1.0);
}

function getColor_state(d) {

    var color_scale = d3.scaleSequential(d3.interpolateYlOrRd);

    return d < 10 ? color_scale(0) :
           d < 50  ? color_scale(0.2) :
           d < 200  ? color_scale(0.4) :
           d < 500  ? color_scale(0.6) :
           d < 1000  ? color_scale(0.8) :
                      color_scale(1.0);
}


/*
function draw_mapbox_map_v1() {
    var map = L.map('map').setView([44, -100], 2),
    layer = L.geoJson(null, { style: { color: '#333', weight: 1 }})

    map.addLayer(layer
    d3.json("https://unpkg.com/us-atlas@1/us/10m.json", function(error, data) {
      var neighborhoods = topojson.feature(data, data.objects.counties)
      layer.addData(neighborhoods);
    })
}
function draw_mapbox_map() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
    // This adds the map to your page
    var map1 = new mapboxgl.Map({
      container: "india_districts_basic_map", // container id specified in the HTML
      //style: 'mapbox://styles/mapbox/dark-v9', // style URL
      style: 'mapbox://styles/dkarkala01/ck8xdsbv5467x1imd2zxz7n3i',
      center: [80.9629, 21.5937], // India
      zoom: screen.height/300 //3.1 //2.9 //3.25
    });

    map1.on('load', function() {
      map1.addLayer({
        id: 'collisions',
        type: 'circle',
        source: {
          type: 'topojson',
          data: 'data/india.json' // replace this with the url of your own geojson
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
/// d3 map
idname = "#india_districts_basic_map"
d3.select(idname).select("svg").remove();
filename = "data/india.json";
type = "cases";
width_scale_factor = 1.0;
height_scale_factor = 0.40;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:50, left:30, top:10, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_d3_map(idname, filename, base_width, base_height);
function draw_d3_map(idname, file, width, height) {
    var svg = d3.select(idname).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var path = d3.geoPath();

    d3.json(file, function(error, data) {
      if (error) throw error;

      svg.append("path")
          .attr("d", path(topojson.feature(data, data.objects.india)))
          .style("fill", "none")
          .style("stroke", "#000")
          .style("stroke-linejoin", "round")
          .style("stroke-linecap", "round");
    });
}

function draw_leaflet_map() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZGthcmthbGEwMSIsImEiOiJjamlhOGF1NHUxNGpwM3Ftbm9kOTBtYmlqIn0.eL-ra45PjGsCc1XMc376jg';
    var map = L.mapbox.map('india_districts_basic_map')
        .setView([21.5937, 80.9629], 5);
        //.addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
        //.addLayer(L.mapbox.styleLayer('mapbox://styles/dkarkala01/ck8xdsbv5467x1imd2zxz7n3i'));
    var stateLayer = omnivore.topojson('data/karnataka.json')
        .addTo(map);
    var usLayer = omnivore.topojson('data/bihar.json')
        .addTo(map);

    stateLayer.setStyle
    ({
      fillColor : '#ff0000',
      fillOpacity: 0.65,
      color:'#990000',
      weight:0.25,
      opacity:0.9
    });
}
*/