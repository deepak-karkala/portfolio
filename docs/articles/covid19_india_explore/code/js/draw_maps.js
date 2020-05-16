var is_init = 1;
draw_maps(is_init, "")

function draw_maps(is_init, selected_button_id) {
	map_container = "india_cases_map";

	if (is_init!=1) {
		//map3.remove();
		document.getElementById("basic_map_container").innerHTML = `<div id="india_cases_map" style="height: 125vh;"></div>`;
		//$('#india_cases_map').html('')
	}

	console.log(selected_button_id);

	if ((is_init==1) || (selected_button_id=="district_cases")) {
		draw_leaflet_topojson_district_confirmed_map(map_container);
	} else if (selected_button_id=="district_deaths") {
		draw_leaflet_topojson_district_deaths_map(map_container);
	} else if (selected_button_id=="state_cases") {
		draw_leaflet_topojson_state_confirmed_map(map_container);
	} else if (selected_button_id=="state_deaths") {
		draw_leaflet_topojson_state_deaths_map(map_container);
	} else if (selected_button_id=="animate_time") {
	} else {
		draw_leaflet_topojson_district_confirmed_map(map_container);
	}

}


function draw_leaflet_topojson_state_confirmed_map(map_container) {
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


	var map1 = L.map(map_container,
	              {maxZoom:12,minZoom:3},
	              topoLayer1 = new L.TopoJSON(),
	              )
	         //.setView([23.5937, 80.9629], 4.25);
	         .setView([23.5937, 80.9629], 4.50);
	map1.scrollWheelZoom.disable();

	// Add layer
	$.getJSON('data/india.json').done(addTopoData);

	function addTopoData(topoData) {
	    // 1) fills the data inside the topoLayer
	    // 2) append the layer to the Leaflet-widget 'map'
	    // 3) calls a function called 'handleLayer' for each element

	    topoLayer1.addData(topoData);
	    topoLayer1.addTo(map1);
	    topoLayer1.eachLayer(handleLayer_state_confirmed);
	}

	function handleLayer_state_confirmed(layer) {  
	    layer.setStyle
	    ({
	      fillColor : getColor_state_confirmed(parseInt(layer.feature.properties.confirmed)),
	      fillOpacity: 1.0,
	      color:'#ffffff',
	      weight:0.75,
	      opacity:0.75
	    });

	    layer.on
	    ({
	        mouseover: enterLaye_state_confirmed,
	        mouseout: leaveLayer_state_confirmed
	    });
	  	layer.bindTooltip(`<div class="well">`+layer.feature.properties.confirmed+` cases in `+layer.feature.properties.st_nm+`</div>`);
	}

	function getColor_state_confirmed(d) {
	    var color_scale = d3.scaleSequential(d3.interpolateYlOrRd);
	    return d < 10 ? color_scale(0) :
	           d < 50  ? color_scale(0.2) :
	           d < 200  ? color_scale(0.4) :
	           d < 500  ? color_scale(0.6) :
	           d < 1000  ? color_scale(0.8) :
	                      color_scale(1.0);
	}

	function enterLaye_state_confirmed() {
		this.bringToFront();
		this.setStyle
		({
		fillOpacity: 0.65,
		color:'#000000',
		weight:1.5,
		opacity:0.9
		});
	}
	  
	function leaveLayer_state_confirmed() {
		this.bringToBack();
		this.setStyle
		({
		fillOpacity: 1.0,
		color:'#ffffff',
		weight:0.75,
		opacity:0.75
		});
	}
}




function draw_leaflet_topojson_state_deaths_map(map_container) {
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


	var map2 = L.map(map_container,
	              {maxZoom:12,minZoom:3},
	              topoLayer2 = new L.TopoJSON(),
	              )
	         .setView([23.5937, 80.9629], 4.50);
	         //.setView([23.5937, 80.9629], 4.25);
	map2.scrollWheelZoom.disable();

	// Add layer
	$.getJSON('data/india.json').done(addTopoData);

	function addTopoData(topoData) {
	    // 1) fills the data inside the topoLayer
	    // 2) append the layer to the Leaflet-widget 'map'
	    // 3) calls a function called 'handleLayer' for each element

	    topoLayer2.addData(topoData);
	    topoLayer2.addTo(map2);
	    topoLayer2.eachLayer(handleLayer_state_deaths);
	}

	function handleLayer_state_deaths(layer) {  
	    layer.setStyle
	    ({
	      fillColor : getColor_state_deaths(parseInt(layer.feature.properties.deaths)),
	      fillOpacity: 1.0,
	      color:'#ffffff',
	      weight:0.75,
	      opacity:0.75
	    });

	    layer.on
	    ({
	        mouseover: enterLaye_state_deaths,
	        mouseout: leaveLayer_state_deaths
	    });
	  	layer.bindTooltip(`<div class="well">`+layer.feature.properties.deaths+` deaths in `+layer.feature.properties.st_nm+`</div>`);
	}

	function getColor_state_deaths(d) {
	    var color_scale = d3.scaleSequential(d3.interpolateYlOrRd);
	    return d == 0 ? color_scale(0) :
	           d < 10  ? color_scale(0.2) :
	           d < 50  ? color_scale(0.4) :
	           d < 100  ? color_scale(0.6) :
	           d < 500  ? color_scale(0.8) :
	                      color_scale(1.0);
	}

	function enterLaye_state_deaths() {
		this.bringToFront();
		this.setStyle
		({
		fillOpacity: 0.65,
		color:'#000000',
		weight:1.5,
		opacity:0.9
		});
	}
	  
	function leaveLayer_state_deaths() {
		this.bringToBack();
		this.setStyle
		({
		fillOpacity: 1.0,
		color:'#ffffff',
		weight:0.75,
		opacity:0.75
		});
	}
}

function draw_leaflet_topojson_district_confirmed_map(map_container) {
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
	            console.log(geojson);
	          }
	        }    
	        else 
	        {
	          L.GeoJSON.prototype.addData.call(this, jsonData);
	        }
	      }  
	    });


	var map3 = L.map(map_container,
	              {maxZoom:12,minZoom:3},
	              topoLayer3 = new L.TopoJSON(),
	              )
	         .setView([23.5937, 80.9629], 4.50);
	map3.scrollWheelZoom.disable();

	state_name_list = ['odisha', 'telangana', 'meghalaya', 'karnataka', 'haryana', 'bihar', 'andhrapradesh',
                      'jammukashmir','westbengal','kerala', 'chhattisgarh', 'andamannicobarislands',
                      'jharkhand','ladakh','uttarpradesh','mizoram','lakshadweep','nagaland','tamilnadu',
                      'dadranagarhaveli','delhi','puducherry','madhyapradesh','arunachalpradesh','uttarakhand',
                      'manipur','tripura','gujarat','goa','assam','maharashtra','punjab','sikkim','rajasthan',
                      'chandigarh','himachalpradesh'];

	// Load state topodata and add as layers
	for (var i=0; i<state_name_list.length; i++) {
		state_name = state_name_list[i]
		$.getJSON('data/district_data_map/'+state_name+'.json').done(addTopoData);
	}

	function addTopoData(topoData) {
	    // 1) fills the data inside the topoLayer
	    // 2) append the layer to the Leaflet-widget 'map'
	    // 3) calls a function called 'handleLayer' for each element

	    topoLayer3.addData(topoData);
	    topoLayer3.addTo(map3);
	    topoLayer3.eachLayer(handleLayer_district_confirmed);
	}

	function handleLayer_district_confirmed(layer) {  
	    layer.setStyle
	    ({
	      fillColor : getColor_district_confirmed(parseInt(layer.feature.properties.cases)),
	      fillOpacity: 1.0,
	      color:'#ffffff',
	      weight:0.75,
	      opacity:0.75
	    });

	    layer.on
	    ({
	        mouseover: enterLayer_district_confirmed,
	        mouseout: leaveLayer_district_confirmed
	    });
	  	layer.bindTooltip(`<div class="well">`+layer.feature.properties.cases+` cases in `+layer.feature.properties.district+`</div>`);
	}

	function getColor_district_confirmed(d) {
	    var color_scale = d3.scaleSequential(d3.interpolateYlOrRd);
	    return d == 0  ? "#ffffff" :
	    	   d < 5   ? color_scale(0) :
	           d < 10  ? color_scale(0.2) :
	           d < 50  ? color_scale(0.4) :
	           d < 100 ? color_scale(0.6) :
	           d < 200 ? color_scale(0.8) :
	                     color_scale(1.0);
	}

	function enterLayer_district_confirmed() {
		this.bringToFront();
		this.setStyle
		({
		fillOpacity: 0.65,
		color:'#000000',
		weight:1.5,
		opacity:0.9
		});
	}
	  
	function leaveLayer_district_confirmed() {
		this.bringToBack();
		this.setStyle
		({
		fillOpacity: 1.0,
		color:'#ffffff',
		weight:0.75,
		opacity:0.75
		});
	}
}


function draw_leaflet_topojson_district_deaths_map(map_container) {
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


	var map4 = L.map(map_container,
	              {maxZoom:12,minZoom:3},
	              topoLayer4 = new L.TopoJSON(),
	              )
	         .setView([23.5937, 80.9629], 4.50);
	map4.scrollWheelZoom.disable();

	state_name_list = ['odisha', 'telangana', 'meghalaya', 'karnataka', 'haryana', 'bihar', 'andhrapradesh',
                      'jammukashmir','westbengal','kerala', 'chhattisgarh', 'andamannicobarislands',
                      'jharkhand','ladakh','uttarpradesh','mizoram','lakshadweep','nagaland','tamilnadu',
                      'dadranagarhaveli','delhi','puducherry','madhyapradesh','arunachalpradesh','uttarakhand',
                      'manipur','tripura','gujarat','goa','assam','maharashtra','punjab','sikkim','rajasthan',
                      'chandigarh','himachalpradesh'];

	// Load state topodata and add as layers
	for (var i=0; i<state_name_list.length; i++) {
		state_name = state_name_list[i]
		$.getJSON('data/district_data_map/'+state_name+'.json').done(addTopoData);
	}

	function addTopoData(topoData) {
	    // 1) fills the data inside the topoLayer
	    // 2) append the layer to the Leaflet-widget 'map'
	    // 3) calls a function called 'handleLayer' for each element

	    topoLayer4.addData(topoData);
	    topoLayer4.addTo(map4);
	    topoLayer4.eachLayer(handleLayer_district_deaths);
	}

	function handleLayer_district_deaths(layer) {  
	    layer.setStyle
	    ({
	      fillColor : getColor_district_deaths(parseInt(layer.feature.properties.deaths)),
	      fillOpacity: 1.0,
	      color:'#ffffff',
	      weight:0.75,
	      opacity:0.75
	    });

	    layer.on
	    ({
	        mouseover: enterLayer_district_deaths,
	        mouseout: leaveLayer_district_deaths
	    });
	  	layer.bindTooltip(`<div class="well">`+layer.feature.properties.deaths+` deaths in `+layer.feature.properties.district+`</div>`);
	}

	function getColor_district_deaths(d) {
	    var color_scale = d3.scaleSequential(d3.interpolateYlOrRd);
	    return d == 0  ? "#ffffff" :
	    	   d < 5   ? color_scale(0) :
	           d < 10  ? color_scale(0.2) :
	           d < 20  ? color_scale(0.4) :
	           d < 50 ? color_scale(0.6) :
	           d < 100 ? color_scale(0.8) :
	                     color_scale(1.0);
	}

	function enterLayer_district_deaths() {
		this.bringToFront();
		this.setStyle
		({
		fillOpacity: 0.65,
		color:'#000000',
		weight:1.5,
		opacity:0.9
		});
	}
	  
	function leaveLayer_district_deaths() {
		this.bringToBack();
		this.setStyle
		({
		fillOpacity: 1.0,
		color:'#ffffff',
		weight:0.75,
		opacity:0.75
		});
	}
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setup_map_option_buttons() {
  d3.select('#map_option_buttons')
    .selectAll('.btn')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.btn').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      var is_init = 0;
      draw_maps(is_init, buttonId);
    });
}

// setup the buttons.
setup_map_option_buttons();