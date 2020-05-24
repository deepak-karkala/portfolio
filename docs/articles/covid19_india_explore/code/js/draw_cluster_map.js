//(function() {

script_load_timeout_list.push(setTimeout(load_clusterMap_script, 3*script_load_timestep));

function load_clusterMap_script() {
	idname = "#cluster_map";
	var cluster_map_idname = "#cluster_map";
	d3.select(idname).select("cluster_animation_svg").remove();

	var chart_id = document.getElementById("cluster_map");
	if (window.innerWidth >= 768) {
		chart_id.innerHTML = `<div class="row text-center justify-content-center"><div class="col-lg-8 col-12 cluster_video">`+
								`<video id="cluster_animation_video" preload="auto" loop="loop"`+
								`muted="muted" autoplay="true">
						          <source src="docs/cluster_animation_without_legend_compressed.mp4" type="video/mp4">
						          Your browser does not support the video tag.
						        </video></div></div>`;
	} else {
		chart_id.innerHTML = `<div class="row"><div class="col-lg-12 col-12 cluster_video"><video id="cluster_animation_video" preload="auto" loop="loop" muted="muted" autoplay="true">
						          <source src="docs/cluster_animation_without_legend_compressed_mobile.mp4" type="video/mp4">
						          Your browser does not support the video tag.
						        </video></div></div>`;
	}
}
/*

filename = "data/cluster_network_map.csv";
width_scale_factor = 0.9;
//height_scale_factor = 0.40;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:20, left:20, top:30, bottom:20};
base_width = bb*width_scale_factor - margin.left - margin.right;
//base_height = bb*height_scale_factor - margin.top - margin.bottom;
var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.8, 0.4]);
height_scale_factor = height_scale_factor_width(bb);
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_cluster_map(idname, filename, base_width, base_height);


var daily_cum_cases_count = {};
var daily_cum_deaths_count = {};
var cluster_map_timeouts = [];
var cluster_map_g;
var cluster_animation_start_date = new Date(2020, 2, 1); //Start from March
var num_cluster_animation_sim_days;
var month_list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var path;
var total_sim_duration;
var zoom;
var width = base_width;
var height = base_height;
var cluster_animation_svg;
var parseTime;
var cluster_colors;
var projection;
var cluster_map_link = []
var cluster_world;
var cluster_india;


function draw_cluster_map(idname, filename, width, height) {

	var scale0 = (width - 1) / 2 / Math.PI;
	var cluster_type_colors = d3.scaleOrdinal().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
								.range(['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#9A6324',
                            			'#46f0f0', '#f032e6', '#bcf60c', '#a9a9a9', "#dddddd"]);
	cluster_colors = {'Mysuru Pharmaceutical industry': '#f032e6',
						 'Bengaluru scrap segregation worker': '#800000',
						 'Travel History': '#f58231',
						 'Italian tourists in Rajasthan': '#3cb44b',
						 'Delhi Religious meeting': '#4363d8',
						 'Iran evacuees': '#911eb4',
						 'Family member': '#ff0000',
						 'Close Contact': '#000075',
						 'Thai national in Tamil Nadu': '#008080',
						 'Dubai returnee, hosted feast for 1500 people': '#9a6324',
						 'Contact with UK returnee': '#808000'};


	// parse the date / time
    parseTime = d3.timeParse("%Y-%m-%d");

    // Projection 
    projection = d3.geoNaturalEarth2() //d3.geoNaturalEarth2() //d3.geoTimes() d3.geoWagner4() geoEquirectangular()
        .scale(width / 1.5 / Math.PI)
        .translate([width / 2.5, height / 1.5])
    path = d3.geoPath()
        .projection(projection);

    // Zoom 
	zoom = d3.zoom()
	    .scaleExtent([1, 8])    //.scaleExtent([scale0, 8 * scale0])
	    .on("zoom", zoomed);

	// cluster_animation_svg 
	cluster_animation_svg = d3.select(idname).append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g")
              .call(zoom);
    cluster_map_g = cluster_animation_svg.append("g");


    // Load external data and boot
    d3.queue()
        //.defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
        .defer(d3.json, "data/world-110m.geojson")
        //.defer(d3.json, "data/world_without_india.geojson")
        //.defer(d3.json, "data/world_with_india_composite.geojson")
        .defer(d3.json, "data/india_topojson.json")
        .defer(d3.csv, filename, data_ready)
        .await(ready);

}

function ready(error, world, india, data) {
    if (error) throw error;

    path = d3.geoPath()
        .projection(projection);

    cluster_world = world;
    cluster_india = india;

	end_date = new Date(data[data.length-1].date);
	num_cluster_animation_sim_days = Math.ceil(Math.abs(end_date - cluster_animation_start_date) / (1000 * 60 * 60 * 24)) - 1;
	num_milliseconds_per_date = 500;
	total_sim_duration = num_cluster_animation_sim_days * num_milliseconds_per_date;

    // Draw the map
    cluster_map_g.attr("class", "countries")
        .selectAll("path")
        .data(world.features)
      .enter().append("path")
      	.attr("class", function(d) {
      		country_name = d.properties.name;
      		// Zoom to India with transition
      		if (country_name=="India") {
      			var bounds = path.bounds(d),
				dx = bounds[1][0] - bounds[0][0],
				dy = bounds[1][1] - bounds[0][1],
				x = (bounds[0][0] + bounds[1][0]) / 2,
				y = (bounds[0][1] + bounds[1][1]) / 2,
				scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
				translate = [width / 2 - scale * x, height / 2 - scale * y];

				cluster_animation_svg.transition()
					.duration(total_sim_duration)
					// .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
					.call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
      			return "test";
      		} else {
      			return "country_background";
      		}
      	})
        .attr("d", path)
        .style("fill", "#eee")
        .style("stroke", "#fff");

    
    cluster_map_g.attr("class", "india")
		.selectAll("india_path")
      .data(topojson.feature(india, india.objects.india).features)
      .enter().append("path")
      	.attr("class", "country_focus")
		.attr("d", path)
		.style("fill", "#ecf7fc")
		.style("stroke", "#c0c0c0");


    // Form list of network arcs
	data.forEach(function(d, i){
		d.cluster_type = +d.cluster_type;
		d.date = parseTime(d.date);
		daily_cum_cases_count[d.date] = +d["total_cases"];
		//daily_cum_deaths_count.push({d.date: +d.total_deaths});

		if (1) { //(d.cluster_type!=0) {
			source = [+d.cluster_longitude, +d.cluster_latitude]
			target = [+d.patient_longitude, +d.patient_latitude]
			topush = {type: "LineString", coordinates: [source, target], cluster_type: d.cluster_type,
						date: d.date, index: +d.index, cluster: d.cluster}
			cluster_map_link.push(topush)
		}
	})

    //console.log(link);

    // Add the path
	cluster_map_g.selectAll("myPath")
		.data(cluster_map_link)
		.enter()
		.append("path")
			.attr("class", function(d) {
				return "network_arc_"+d.index+" network_arc"
			})
			.attr("d", function(d){
				return path(d);
			})
			.style("fill", "none")
			.style("stroke", function(d) {
				//console.log(d);
				//return cluster_type_colors(d.cluster_type);
				return cluster_colors[d.cluster];
			})
			.style("stroke-width", function(d) {
				if (d.cluster_type==0) {
					return 0.05;
				} else if (d.cluster_type==4){
					return 0.1;
				} else {
					return 0.1;
				}
			})
			.style("opacity", 0);

	current_date = new Date(2020, 2, 1);
	for (let i=1; i<=num_cluster_animation_sim_days; i++) {
		setTimeout( update_date, i*num_milliseconds_per_date );
	}

}



function ready_repeat() {

	world = cluster_world;
	india = cluster_india;

	d3.select(cluster_map_idname).select("svg").remove();

	cluster_animation_svg = d3.select(cluster_map_idname).append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .call(zoom);
	cluster_map_g = cluster_animation_svg.append("g");


    // Draw the map
    cluster_map_g.attr("class", "countries")
        .selectAll("path")
        .data(world.features)
      .enter().append("path")
      	.attr("class", function(d) {
      		country_name = d.properties.name;
      		// Zoom to India with transition
      		if (country_name=="India") {
      			var bounds = path.bounds(d),
				dx = bounds[1][0] - bounds[0][0],
				dy = bounds[1][1] - bounds[0][1],
				x = (bounds[0][0] + bounds[1][0]) / 2,
				y = (bounds[0][1] + bounds[1][1]) / 2,
				scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
				translate = [width / 2 - scale * x, height / 2 - scale * y];

				cluster_animation_svg.transition()
					.duration(total_sim_duration)
					// .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
					.call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
      			return "test";
      		} else {
      			return "country_background";
      		}
      	})
        .attr("d", path)
        .style("fill", "#eee")
        .style("stroke", "#fff");

    
    cluster_map_g.attr("class", "india")
		.selectAll("india_path")
      .data(topojson.feature(india, india.objects.india).features)
      .enter().append("path")
      	.attr("class", "country_focus")
		.attr("d", path)
		.style("fill", "#ecf7fc")
		.style("stroke", "#c0c0c0");


    // Add the path
	cluster_map_g.selectAll("myPath")
		.data(cluster_map_link)
		.enter()
		.append("path")
			.attr("class", function(d) {
				return "network_arc_"+d.index+" network_arc"
			})
			.attr("d", function(d){
				return path(d);
			})
			.style("fill", "none")
			.style("stroke", function(d) {
				//console.log(d);
				//return cluster_type_colors(d.cluster_type);
				return cluster_colors[d.cluster];
			})
			.style("stroke-width", function(d) {
				if (d.cluster_type==0) {
					return 0.05;
				} else if (d.cluster_type==4){
					return 0.1;
				} else {
					return 0.1;
				}
			})
			.style("opacity", 0);


	current_date = new Date(2020, 2, 1);
	for (let i=1; i<=num_cluster_animation_sim_days; i++) {
		//setTimeout( update_date, i*num_milliseconds_per_date );
		cluster_map_timeouts.push(setTimeout( update_date, i*num_milliseconds_per_date ));
	}

}


// When network data is loaded do this
function data_ready(d) {
	return d;
}

// Zoom functionality
function zoomed() {
	cluster_map_g.style("stroke-width", 1 / d3.event.transform.k + "px");
  	cluster_map_g.selectAll('path') // To prevent stroke width from scaling
    	.attr('transform', d3.event.transform);
	cluster_map_g.selectAll(".country_focus").style("stroke-width", d3.event.transform.k/10 + "px").style("stroke", "#000");
}



function update_date() {

	// Add a day
	current_date.setDate(current_date.getDate() + 1);
	cluster_map_g.selectAll(".cluster_map_date_label").remove();
	cluster_map_g.selectAll(".cluster_map_casecount_label").remove();

	//console.log(daily_cum_cases_count[current_date]);

	cluster_map_g.append("text")
		.attr("class", "cluster_map_date_label")
		.attr("x", base_width-120)
		.attr("y", 30)
		.text(current_date.getDate() + " " + month_list[current_date.getMonth()])
		.style("font-size", "2rem")
		.style("font-weight", "bold")
		.style("stroke", "none")
		.style("fill", "black");

	cluster_map_g.append("text")
		.attr("class", "cluster_map_casecount_label")
		.attr("x", base_width-120)
		.attr("y", 50)
		.text(numberWithCommas(daily_cum_cases_count[current_date]) + " cases")
		.style("font-size", "1rem")
		//.style("font-weight", "bold")
		.style("stroke", "none")
		.style("fill", "#404040");


	cluster_map_g.selectAll(".network_arc")
		.transition()
			.duration(1000)
			.style("opacity", function(d) {
				if (current_date >= d.date) {
					return 1;
				} else {
					return 0;
				}
			});

}


function cluster_animation_button_click() {
	for (var i=0; i<cluster_map_timeouts.length; i++) {
 		clearTimeout(cluster_map_timeouts[i]);
	}
	ready_repeat();
}

*/
//})();





