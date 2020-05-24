
//(function(){

script_load_timeout_list.push(setTimeout(load_outbreakSpreadMap_script, 5*script_load_timestep));


function load_outbreakSpreadMap_script() {
	//idname = "#outbreak_spread_map";
	//d3.select(idname).select("cluster_animation_svg").remove();

	var chart_id = document.getElementById("outbreak_spread_map");
	if (window.innerWidth >= 768) {
		chart_id.innerHTML = `<div class="row text-center justify-content-center"><div class="col-lg-8 col-12 cluster_video">`+
								`<video id="cluster_animation_video" preload="auto" loop="loop"`+
								`muted="muted" autoplay="true">
						          <source src="docs/outbreak_spread_animation_compressed.mp4" type="video/mp4">
						          Your browser does not support the video tag.
						        </video></div></div>`;
	} else {
		chart_id.innerHTML = `<div class="row"><div class="col-lg-12 col-12 cluster_video"><video id="cluster_animation_video" preload="auto" loop="loop" muted="muted" autoplay="true">
						          <source src="docs/outbreak_spread_animation_compressed.mp4" type="video/mp4">
						          Your browser does not support the video tag.
						        </video></div></div>`;
	}
}

/*
function load_outbreakSpreadMap_script() {
	idname = "#outbreak_spread_map";
	outbreak_spread_idname = "#outbreak_spread_map";

	d3.select(idname).select("svg").remove();
	filename = "data/scroll_data.csv";
	daily_stats_file = "data/overall_and_daily_cases_deaths.csv";
	width_scale_factor = 0.9;
	//height_scale_factor = 0.50;
	var bb = d3.select(idname).node().offsetWidth;
	var margin = {right:10, left:10, top:20, bottom:10};
	base_width = bb*width_scale_factor - margin.left - margin.right;
	//base_height = bb*height_scale_factor - margin.top - margin.bottom;
	//base_height = Math.floor(window.innerHeight * 1);
	var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.95, 0.7]);
	height_scale_factor = height_scale_factor_width(bb);
	base_height = bb*height_scale_factor - margin.top - margin.bottom;

	var outbreak_spread_base_width = base_width;
	var outbreak_spread_base_height = base_height;

	draw_scroll_outbreak_spread_map(idname, filename, base_width, base_height, margin, daily_stats_file);
}


function draw_scroll_outbreak_spread_map(idname, filename, width, height, margin, daily_stats_file) {

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

	var scale0 = (width - 1) / 2 / Math.PI;
	var parseTime = d3.timeParse("%Y-%m-%d");
	var projection = d3.geoMercator();
	var path = d3.geoPath()
	    .projection(projection)
    	.pointRadius(5);

	var zoom = d3.zoom()
	    .scaleExtent([1, 8])    //.scaleExtent([scale0, 8 * scale0])
	    .on("zoom", outbreak_spread_zoomed);

	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_outbreak_spread_scroll")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

	svg_outbreak_spread_map = d3.select(idname).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              //.style("left", "50rem")
              .append("g")
              	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
              //.call(zoom);
    var outbreak_spread_map_g = svg_outbreak_spread_map.append("g");
    outbreak_spread_circles_g = svg_outbreak_spread_map.append("g");
	outbreak_spread_base_width = width;

	outbreak_spread_map_font_size = "1rem";
    // Load external data and boot
    //if scroll_data
    d3.queue()
        .defer(d3.json, "data/india_topojson.json")
        .defer(d3.csv, filename) //, data_ready)
        //.defer(d3.csv, daily_stats_file) //, data_ready)
        .await(ready);

    function ready(error, india, data) {
        if (error) throw error;

        outbreak_spread_india = india;

        // Zoom to India
        var o = topojson.mesh(india, india.objects.india, function(a, b) { return a === b; });
      	projection
	          .scale(1)
	          .translate([0, 0]);
		var b = path.bounds(o),
			  s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
			  t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        projection = projection.scale(s).translate(t);

        path = d3.geoPath()
	        .projection(projection)
	        .pointRadius(2);

        
        outbreak_spread_map_g.attr("class", "india")
			.selectAll("india_path")
	      .data(topojson.feature(india, india.objects.india).features)
          .enter().append("path")
          	.attr("class", "country_focus")
			.attr("d", path)
			.style("fill", "#fff")
			.style("stroke", "#c0c0c0")
			.style("opacity", 1);


		data.forEach(function(d,i) {
			d.date = parseTime(d.date);
			//console.log(d.date);
			d.district = d.district;
			d.state = d.state;
			d.status = d.status;
			d.status_change_date = parseTime(d.status_change_date);
			d.district_id = +d.district_id;
			d.num_cases_in_district = +d.num_cases_in_district;
			d.num_cases_in_state = +d.num_cases_in_state;

			random_district_radius = randomNumber(0, d.num_cases_in_district/1e4);
			random_district_theta = randomNumber(0, 360)*Math.PI/180;

			random_state_radius = randomNumber(0, d.num_cases_in_state/5e2);
			random_state_theta = randomNumber(0, 360)*Math.PI/180;

			d.district_lat = +d.district_lat  +  random_district_radius * Math.cos(random_district_theta);  
			d.district_long = +d.district_long +  random_district_radius * Math.sin(random_district_theta);  
			d.state_long = +d.state_long + random_state_radius * Math.sin(random_state_theta);
			d.state_lat = +d.state_lat + random_state_radius * Math.cos(random_state_theta);
		});

        outbreak_spread_circles_g.selectAll("dot")
        	.data(data)
        	.enter()
        	.append("circle")
				.attr("class", "outbreak_spread_circles circles")
				.attr("cx", function(d,i){
					return projection([d.district_long, d.district_lat])[0];
				})
				.attr("cy", function(d,i){
					return projection([d.district_long, d.district_lat])[1];
				})
				.attr("r", function(d,i) {
					if (window.innerWidth >= 768) {
						return "0.12rem"
					} else {
						return "0.10rem"
					}
				})
				.style("fill", "#FF0000")
				.style("opacity", 0)
				.on("mouseover", function(d, i) {
				    //d3.selectAll(".scroll_randompos_circles").style("opacity", 0.5);
				    d3.select(this).style('stroke-width', '2px').style("opacity", 1.0);
				    if (d.status=="Hospitalized") {
				    	return tooltip.html(`<div class='well'>Case detected on `+
							month_abbrv_list[d.date.getMonth()]+` `+d.date.getDate()+` at `+d.district + `, `+d.state_code+
		                    `</div>`)
		             		 .style("visibility", "visible");
				    } else if (d.status=="Recovered"){
				    	return tooltip.html(`<div class='well'>Patient `+
							` at `+d.district + `-`+d.state_code+
		                    `, recovered on `+month_abbrv_list[d.status_change_date.getMonth()]+` `+d.status_change_date.getDate()+`</div>`)
		             		 .style("visibility", "visible");
				    } else if (d.status=="Deceased"){
				    	return tooltip.html(`<div class='well'>Patient `+
							` at `+d.district + `-`+d.state_code+
		                    `, passed away on `+month_abbrv_list[d.status_change_date.getMonth()]+` `+d.status_change_date.getDate()+`</div>`)
		             		 .style("visibility", "visible");
				    }
				  }
				)
				.on("mousemove", function(){
					if (event.pageX >= window.innerWidth/2) {
		              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-150)+"px");
		            } else {
		              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		            }
					//return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
				})
				.on("mouseout", function(d, i){
				    //d3.selectAll(".scroll_randompos_circles").style("opacity", 1.0);
				    d3.select(this).style('stroke-width', '0.25px').style("opacity", 1.0);
					return tooltip.style("visibility", "hidden");
				})

		
		//console.log(daily_stats_date_data);
		dt_anm_outbreakSpreadMap = svg_outbreak_spread_map.selectAll("text4")
			.data([daily_stats_date_data[0]])
			.enter()
		.append("text")
			.attr("class", "outbreak_spread_map_date_label")
			.attr("x", width-150)
			.attr("y", 10)
			.attr("opacity", 1)
			.text(function(d,i){
				return d.getDate() + " " + month_abbrv_list[d.getMonth()];
			})
			.style("font-size", "1rem")
			.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "black");


		
		dt_case_outbreakSpreadMap = svg_outbreak_spread_map.selectAll("text1")
			.data([daily_stats_cases_data[0]])
			.enter()
		.append("text")
			.attr("class", "outbreak_spread_map_case_label")
			.attr("x", width-150)
			.attr("y", 25)
			.attr("opacity", 1)
			.text(function(d,i){
				return d + " Cases";
			})
			.style("font-size", "0.75rem")
			.style("stroke", "none")
			.style("fill", "black");


		dt_death_outbreakSpreadMap = svg_outbreak_spread_map.selectAll("text2")
			.data([daily_stats_deaths_data[0]])
			.enter()
		.append("text")
			.attr("class", "outbreak_spread_map_death_label")
			.attr("x", width-150)
			.attr("y", 40)
			.attr("opacity", 1)
			.text(function(d,i){
				return d + " Deaths";
			})
			.style("font-size", "0.75rem")
			.style("stroke", "none")
			.style("fill", "black");


		dt_recovered_outbreakSpreadMap = svg_outbreak_spread_map.selectAll("text3")
			.data([daily_stats_recovered_data[0]])
			.enter()
		.append("text")
			.attr("class", "outbreak_spread_map_recovered_label")
			.attr("x", width-150)
			.attr("y", 55)
			.attr("opacity", 1)
			.text(function(d,i){
				console.log(d);
				return d + " Recoveries";
			})
			.style("font-size", "0.75rem")
			.style("stroke", "none")
			.style("fill", "black");
		

		//for (let i=1; i<=outbreak_spread_num_sim_days; i++) {
		//	outbreak_spread_timeouts.push(setTimeout( update_date, i*outbreak_spread_step_delay ));
		//}
		repeat_outbreak_spread_animation();

	}	

}

document.getElementById("outbreak_spread_animation_button").onclick = function() {
	
	outbreak_spread_circles_g.selectAll(".outbreak_spread_circles")
		.transition()
			.duration(100)
			.style("opacity", 0)
			.style("fill", "#ff0000");

	svg_outbreak_spread_map.selectAll(".outbreak_spread_map_date_label").remove();
	dt_anm_outbreakSpreadMap = svg_outbreak_spread_map.selectAll("text4")
			.data([daily_stats_date_data[0]])
			.enter()
		.append("text")
			.attr("class", "outbreak_spread_map_date_label")
			.attr("x", outbreak_spread_base_width-150)
			.attr("y", 10)
			.attr("opacity", 1)
			.text(function(d,i){
				return d.getDate() + " " + month_abbrv_list[d.getMonth()];
			})
			.style("font-size", "1rem")
			.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "black");

	
	svg_outbreak_spread_map.selectAll(".outbreak_spread_map_case_label").remove();
	dt_case_outbreakSpreadMap = svg_outbreak_spread_map.selectAll("text1")
			.data([daily_stats_cases_data[0]])
			.enter()
		.append("text")
			.attr("class", "outbreak_spread_map_case_label")
			.attr("x", outbreak_spread_base_width-150)
			.attr("y", 35)
			.attr("opacity", 1)
			.text(function(d,i){
				return d + " Cases";
			})
			.style("font-size", "0.75rem")
			.style("stroke", "none")
			.style("fill", "black");

	svg_outbreak_spread_map.selectAll(".outbreak_spread_map_death_label").remove();
	dt_death_outbreakSpreadMap = svg_outbreak_spread_map.selectAll("text2")
			.data([daily_stats_deaths_data[0]])
			.enter()
		.append("text")
			.attr("class", "outbreak_spread_map_death_label")
			.attr("x", outbreak_spread_base_width-150)
			.attr("y", 50)
			.attr("opacity", 1)
			.text(function(d,i){
				return d + " Deaths";
			})
			.style("font-size", "0.75rem")
			.style("stroke", "none")
			.style("fill", "black");

	svg_outbreak_spread_map.selectAll(".outbreak_spread_map_recovered_label").remove();
	dt_recovered_outbreakSpreadMap = svg_outbreak_spread_map.selectAll("text3")
			.data([daily_stats_recovered_data[0]])
			.enter()
		.append("text")
			.attr("class", "outbreak_spread_map_recovered_label")
			.attr("x", outbreak_spread_base_width-150)
			.attr("y", 65)
			.attr("opacity", 1)
			.text(function(d,i){
				return d + " Recoveries";
			})
			.style("font-size", "0.75rem")
			.style("stroke", "none")
			.style("fill", "black");
	
	repeat_outbreak_spread_animation();

};

function repeat_outbreak_spread_animation() {
	anm = outbreak_spread_circles_g.selectAll(".outbreak_spread_circles")
					.transition()
						.delay(function(d,i) {
							diff_time = Math.abs(d.date - start_date_outbreakSpreadMap);
							num_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24))
							return num_days*outbreak_spread_step_delay;
						})
						.duration(outbreak_spread_step_duration)
						.style("opacity", function(d, i) {
							return 1;
						});

	outbreak_spread_circles_g.selectAll(".outbreak_spread_circles")
		.transition()
			.delay(function(d,i) {
				diff_time = Math.abs(d.status_change_date - start_date_outbreakSpreadMap);
				num_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24))
				return num_days*outbreak_spread_step_delay;
			})
			.duration(outbreak_spread_step_duration)
			.style("fill", function(d, i) {
				if (d.status == "Recovered") {
					return "#229954";
				} else if (d.status == "Deceased") {
					return "#0000ff"; //"#000000";
				} else if (d.status == "Hospitalized") {
					return "#ff0000"; //"#FA8072";
				}
			});


	dt_idx_outbreakSpreadMap = 0;
	case_idx_outbreakSpreadMap = 0;
	death_idx_outbreakSpreadMap = 0;
	recovered_idx_outbreakSpreadMap = 0;
	for (var d=0; d<daily_stats_date_data.length; d++) {
		dt_anm_outbreakSpreadMap = dt_anm_outbreakSpreadMap.transition()
						.delay(function(d,i) {
							return outbreak_spread_step_duration; //dt_idx_outbreakSpreadMap*150;
						})
						.duration(outbreak_spread_step_duration)
						.tween("text", function() {
						    var self = this;
						    var cdt = daily_stats_date_data[dt_idx_outbreakSpreadMap];
							dt_idx_outbreakSpreadMap += 1;
						    return function(t) {
						        self.textContent = cdt.getDate() + " " + month_abbrv_list[cdt.getMonth()];
						    };
						});
						//.text(daily_stats_date_data[i].getDate() + " " + month_abbrv_list[daily_stats_date_data[i].getMonth()])

		
		dt_case_outbreakSpreadMap = dt_case_outbreakSpreadMap.transition()
						.delay(function(d,i) {
							return outbreak_spread_step_duration; //case_idx_outbreakSpreadMap*outbreak_spread_step_delay;
						})
						.duration(outbreak_spread_step_duration)
						.tween("text", function() {
						    var self = this;
						    var txt = daily_stats_cases_data[case_idx_outbreakSpreadMap];
							case_idx_outbreakSpreadMap += 1;
						    return function(t) {
						        self.textContent = numberWithCommas(txt) + " Cases";
						    };
						});

		dt_death_outbreakSpreadMap = dt_death_outbreakSpreadMap.transition()
						.delay(function(d,i) {
							return outbreak_spread_step_duration; //death_idx_outbreakSpreadMap*outbreak_spread_step_delay;
						})
						.duration(outbreak_spread_step_duration)
						.tween("text", function() {
						    var self = this;
						    var txt = daily_stats_deaths_data[death_idx_outbreakSpreadMap];
							death_idx_outbreakSpreadMap += 1;
						    return function(t) {
						        self.textContent = numberWithCommas(txt) + " Deaths";
						    };
						});

		dt_recovered_outbreakSpreadMap = dt_recovered_outbreakSpreadMap.transition()
						.delay(function(d,i) {
							return outbreak_spread_step_duration; //recovered_idx_outbreakSpreadMap*outbreak_spread_step_delay;
						})
						.duration(outbreak_spread_step_duration)
						.tween("text", function() {
						    var self = this;
						    var txt = daily_stats_recovered_data[recovered_idx_outbreakSpreadMap];
							recovered_idx_outbreakSpreadMap += 1;
						    return function(t) {
						        self.textContent = numberWithCommas(txt) + " Recoveries";
						    };
						});
		


	}


}



function update_date() {
	// Add a day
	current_date_outbreakSpreadMap.setDate(current_date_outbreakSpreadMap.getDate() + 1);
	if (current_date_outbreakSpreadMap <= end_date_outbreakSpreadMap) {
		svg_outbreak_spread_map.selectAll(".outbreak_spread_map_date_label").remove();
		svg_outbreak_spread_map.selectAll(".outbreak_spread_map_casecount_label").remove();

		svg_outbreak_spread_map.append("text")
			.attr("class", "outbreak_spread_map_date_label")
			.attr("x", outbreak_spread_base_width-120)
			.attr("y", 20)
			.text(current_date_outbreakSpreadMap.getDate() + " " + months_list[current_date_outbreakSpreadMap.getMonth()])
			.style("font-size", "1.5rem")
			.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "black");

		
		svg_outbreak_spread_map.append("text")
			.attr("class", "outbreak_spread_map_casecount_label")
			.attr("x", outbreak_spread_base_width-120)
			.attr("y", 40)
			.text(numberWithCommas(daily_cum_cases_count[current_date_outbreakSpreadMap]) + " cases")
			.style("font-size", "1rem")
			//.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "#404040");

		svg_outbreak_spread_map.append("text")
			.attr("class", "outbreak_spread_map_casecount_label")
			.attr("x", outbreak_spread_base_width-120)
			.attr("y", 60)
			.text(numberWithCommas(daily_cum_recovered_count[current_date_outbreakSpreadMap]) + " recoveries")
			.style("font-size", "1rem")
			//.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "#404040");

		svg_outbreak_spread_map.append("text")
			.attr("class", "outbreak_spread_map_casecount_label")
			.attr("x", outbreak_spread_base_width-120)
			.attr("y", 80)
			.text(numberWithCommas(daily_cum_deaths_count[current_date_outbreakSpreadMap]) + " deaths")
			.style("font-size", "1rem")
			//.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "#404040");
		
	}
}


// Zoom functionality
function outbreak_spread_zoomed() {
	outbreak_spread_map_g.style("stroke-width", 1 / d3.event.transform.k + "px");
  	outbreak_spread_map_g.selectAll('path') // To prevent stroke width from scaling
    	.attr('transform', d3.event.transform);
	outbreak_spread_map_g.selectAll(".country_focus").style("stroke-width", d3.event.transform.k/10 + "px").style("stroke", "#000");
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//})();
*/
