map_container = "emerging_hotspot_map";
draw_emerging_hotspots_map(map_container);

var map_emerging_hotspots;
var markers_hotspots = [];
var slider_cases_value = 100;
var slider_density_value = 7;
var slider_growth_value = 60;
var topoLayer_hotspots;


/*
Enable/Disable slider based on checkbox input
https://stackoverflow.com/questions/44692276/checkbox-is-checked-disable-the-range-slider
$(document).on('change','#checkbox6b',function()
{
    if($("input[name='responsive']:checked"))
    {
      $('#YOUR-SLIDER-ID').slider('disable');
    }
    else
    {
      $('#YOUR-SLIDER-ID').slider('enable');
    }
});
*/

function draw_emerging_hotspots_map(map_container) {
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


	map_emerging_hotspots = L.map(map_container,
				              { maxZoom:12,minZoom:3},
				              	topoLayer_hotspots = new L.TopoJSON(),
				              )
				         	.setView([23.5937, 80.9629], 4.0);
	map_emerging_hotspots.scrollWheelZoom.disable();

	
	// Create three markers and set their icons to cssIcon
	//L.marker([23.5937, 80.9629], {icon: cssIcon}).addTo(map_emerging_hotspots);


	state_name_list = ['odisha', 'telangana', 'meghalaya', 'karnataka', 'haryana', 'bihar', 'andhrapradesh',
                      'jammukashmir','westbengal','kerala', 'chhattisgarh', 'andamannicobarislands',
                      'jharkhand','ladakh','uttarpradesh','mizoram','lakshadweep','nagaland','tamilnadu',
                      'dadranagarhaveli','delhi','puducherry','madhyapradesh','arunachalpradesh','uttarakhand',
                      'manipur','tripura','gujarat','goa','assam','maharashtra','punjab','sikkim','rajasthan',
                      'chandigarh','himachalpradesh'];

	// Load state topodata and add as layers
	for (var i=0; i<state_name_list.length; i++) {
		state_name = state_name_list[i];
		console.log("======")
		console.log(state_name);
		$.getJSON('data/india_districtwise_map_case_death_growth_density/'+state_name+'.json').done(addTopoData);
	}

	function addTopoData(topoData) {
	    // 1) fills the data inside the topoLayer
	    // 2) append the layer to the Leaflet-widget 'map'
	    // 3) calls a function called 'handleLayer' for each element

	    topoLayer_hotspots.addData(topoData);
	    topoLayer_hotspots.addTo(map_emerging_hotspots);
	    topoLayer_hotspots.eachLayer(handleLayer_district_confirmed);
	}

	function handleLayer_district_confirmed(layer) {
		case_count = layer.feature.properties.cases;
		case_density = layer.feature.properties.case_density;
		case_growth = layer.feature.properties.current_case_growth_rate;

	    layer.setStyle
	    ({
	      fillColor : getColor_district_confirmed(parseInt(case_count)),
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
	    if (case_count==-1){
		  	layer.bindTooltip(`<div class="well">Data unavailable for `+layer.feature.properties.district+`</div>`);
	    } else {
		  	layer.bindTooltip(`<div class="well">`+case_count+` cases in `+layer.feature.properties.district+`</div>`);
		}

		// Pulsating icon to identify hotspots
		/*
		var district_center = turf.center(layer.feature).geometry.coordinates;
		if ( (case_count>=slider_cases_value) && (case_density>=slider_density_value) && (case_growth>=slider_growth_value) ){
			markers_hotspot = L.marker([district_center[1], district_center[0]], {icon: cssIcon});
			markers_hotspot.addTo(map_emerging_hotspots);
			markers_hotspots.push(markers_hotspot);
		}
		*/
		//console.log("======")
		console.log(layer.feature.properties.district);
		//console.log(layer.feature.properties.cases);
		//console.log(layer.feature.properties.case_density);
		//console.log(layer.feature.properties.current_case_growth_rate);

		add_markers_at_hotspots(layer);
	}

	function getColor_district_confirmed(d) {
	    var color_scale = d3.scaleSequential(d3.interpolateYlOrRd);
	    return d == -1 ? "#efefef" :
	    	   d == 0  ? "#ffffff" :
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


function update_markers_at_hotspots() {
	// Clear all existing markers
	for (var i=0; i<markers_hotspots.length; i++) {
		map_emerging_hotspots.removeLayer(markers_hotspots[i]);
	}
	markers_hotspots = [];
		
	/*
	// Add new markers
	// Load state topodata and add as layers
	for (var i=0; i<state_name_list.length; i++) {
		state_name = state_name_list[i]
		$.getJSON('data/india_districtwise_map_case_death_growth_density/'+state_name+'.json').done(addTopoData);
	}
	function addTopoData(topoData) {
	    // 1) fills the data inside the topoLayer
	    // 2) append the layer to the Leaflet-widget 'map'
	    // 3) calls a function called 'handleLayer' for each element
	    topoLayer_hotspots.eachLayer(add_markers_at_hotspots);
	}
	*/
	topoLayer_hotspots.eachLayer(add_markers_at_hotspots);
	
}


function add_markers_at_hotspots(layer) {
	case_count = layer.feature.properties.cases;
	case_density = layer.feature.properties.case_density;
	case_growth = layer.feature.properties.current_case_growth_rate;

	//http://jsfiddle.net/christianjunk/waturuoz/
	// Define an icon called cssIcon
	var cssIcon = L.divIcon({
	  // Specify a class name we can refer to in CSS.
	  className: 'css-icon',
	  html: '<div class="gps_ring"></div>'
	  // Set marker width and height
	  ,iconSize: [22,22]
	  // ,iconAnchor: [11,11]
	});

	// Pulsating icon to identify hotspots
	var district_center = turf.center(layer.feature).geometry.coordinates;
	if ( (case_count>=slider_cases_value) && (case_density>=slider_density_value) && (case_growth>=slider_growth_value) ){

		markers_hotspot = L.marker([district_center[1], district_center[0]], {icon: cssIcon});
		markers_hotspot.addTo(map_emerging_hotspots);
		markers_hotspots.push(markers_hotspot);
	}
}



//var output = document.getElementById("slider_tag");
//output.innerHTML = `Slope: <span class="slider_value">`+initial_value+` degrees</span>`;
var slider_id = "#slider_cases";
var slider_handle_id = "#slider_cases_handle";
var min=50, max=1500, step=50, value=slider_cases_value;
set_range_slider_cases(slider_id, slider_handle_id, min, max, step, value);

slider_id = "#slider_density";
slider_handle_id = "#slider_density_handle";
var min=5, max=10, step=1, value=slider_density_value;
set_range_slider_cases(slider_id, slider_handle_id, min, max, step, value);

slider_id = "#slider_growth";
slider_handle_id = "#slider_growth_handle";
var min=40, max=150, step=10, value=slider_growth_value;
set_range_slider_cases(slider_id, slider_handle_id, min, max, step, value);

update_hotspot_map_text();
function update_hotspot_map_text() {
	var show_map_text_id = document.getElementById("emerging_hotspots_map_showing_text");
	show_map_text_id.innerHTML = `Currently showing districts with more than `+slider_cases_value+` cases, `+
			+slider_density_value+` cases per 100,000 people and with`+ 
			` growth rate higher than `+slider_growth_value+`%.`;
}

function set_range_slider_cases(slider_id, slider_handle_id, min, max, step, value) {
    var handle = $(slider_handle_id);
	//var handle = $( "#custom-handle" );
    $(slider_id).slider({
    //$(slider_id).slider({
      create: function() {
        handle.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        //handle.text( ui.value );
      	value = ui.value;
      	handle.text( ui.value );
        //var output = document.getElementById("slider_tag");
    	//output.innerHTML = `Bike + Rider Weight: <span class="slider_value">`+value+` kg</span>`;
      },
      change: function(event, ui) {
      	if (slider_id=="#slider_cases") {
      		slider_cases_value = ui.value;
      	} else if (slider_id=="#slider_density") {
      		slider_density_value = ui.value;
      	} else if (slider_id=="#slider_growth") {
      		slider_growth_value = ui.value;
      	} 
      	map_container = "emerging_hotspot_map";
		//draw_emerging_hotspots_map(map_container);
		update_markers_at_hotspots();
		update_hotspot_map_text();
      },
      
      range: "min",
      max: max,
      min: min,
      step: step,
      value: value,
    });
}