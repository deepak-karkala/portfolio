
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
var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.7, 0.4]);
height_scale_factor = height_scale_factor_width(bb);
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_scroll_outbreak_spread_map_transition(idname, filename, base_width, base_height, margin, daily_stats_file);

function draw_scroll_outbreak_spread_map_transition(idname, filename, width, height, margin, daily_stats_file) {

	// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

	var scale0 = (width - 1) / 2 / Math.PI;
	var month_list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_outbreak_spread_scroll")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    var daily_cum_cases_count = [];
	var daily_cum_deaths_count = [];
	var daily_cum_recovered_count = [];

    /* Projection */
    /*
    var projection = d3.geoNaturalEarth2() //d3.geoNaturalEarth2() //d3.geoTimes() d3.geoWagner4() geoEquirectangular()
        .scale(width / 1.5 / Math.PI)
        .translate([width / 2.5, height / 1.5])

    var projection = d3.geoAlbers()
	    .center([23.5937, 80.9629])
	    //.rotate([4.4, 0])
	    //.parallels([50, 60])
	    .scale(6000)
	    .translate([width / 2, height / 2]);
	*/
	var projection = d3.geoMercator();

    var path = d3.geoPath()
        .projection(projection)
        .pointRadius(5);


    /* Zoom */
	var zoom = d3.zoom()
	    .scaleExtent([1, 8])    //.scaleExtent([scale0, 8 * scale0])
	    .on("zoom", zoomed);

	/* SVG */
	
	svg_map = d3.select(idname).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var g = svg_map.append("g");
    var g2 = svg_map.append("g");


    
    // Load external data and boot
    //if scroll_data
    d3.queue()
        .defer(d3.json, "data/india_topojson.json")
        .defer(d3.csv, filename) //, data_ready)
        .defer(d3.csv, daily_stats_file) //, data_ready)
        .await(ready);

    function ready(error, india, data, daily_stats_data) {
        if (error) throw error;
	
        
        //data = outbreak_spread_map_data;
        //india = india_topojson_data;

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

		
        g.attr("class", "india")
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

			random_district_radius = randomNumber(0, d.num_cases_in_district/7e2);
			random_district_theta = randomNumber(0, 360)*Math.PI/180;

			random_state_radius = randomNumber(0, d.num_cases_in_state/5e2);
			random_state_theta = randomNumber(0, 360)*Math.PI/180;

			d.district_lat = +d.district_lat  +  random_district_radius * Math.cos(random_district_theta);  
			d.district_long = +d.district_long +  random_district_radius * Math.sin(random_district_theta);  
			d.state_long = +d.state_long + random_state_radius * Math.sin(random_state_theta);
			d.state_lat = +d.state_lat + random_state_radius * Math.cos(random_state_theta);
		});
		

        // format the data
		daily_stats_data.forEach(function(d) {
			d.date = parseTime(d.date);
			daily_cum_cases_count[d.date] = d.total_confirmed;
			daily_cum_deaths_count[d.date] = d.total_deaths;
			daily_cum_recovered_count[d.date] = d.total_recovered;
		});

        g2.selectAll("dot")
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
				.attr("r", function(d) {
					if (window.innerWidth >= 768) {
						return "0.15rem"
					} else {
						return "0.10rem"
					}
				})
				.style("fill", "#ff0000")
				.style("opacity", 0)
				.on("mouseover", function(d, i) {
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
						return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX-120)+"px");
					} else {
						return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
					}
				})
				.on("mouseout", function(d, i){
				    //d3.selectAll(".scroll_randompos_circles").style("opacity", 1.0);
				    d3.select(this).style('stroke-width', '0.25px').style("opacity", 1.0);
					return tooltip.style("visibility", "hidden");
				});
				/*
					.transition()
						.duration(2000)
						.delay(function(d,i){
							console.log(d.district);
							return d.district_id*0.1
						})
						.attr("r", "0.15rem")
						.style("opacity", 1);
				*/

		// Date label
	    g2.append("text")
			.attr("class", "outbreak_spread_date_label")
			.attr("x", width-120)
			.attr("y", 40)
			.text("")
			.style("font-size", "1.5rem")
			.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "black");


		g2.append("text")
			.attr("class", "outbreak_spread_map_casecount_label")
			.attr("x", width-120)
			.attr("y", 60)
			.text("")
			.style("font-size", "1rem")
			.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "#ff0000");

		g2.append("text")
			.attr("class", "outbreak_spread_map_recovercount_label")
			.attr("x", width-120)
			.attr("y", 80)
			.text("")
			.style("font-size", "1rem")
			.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "#229954");

		g2.append("text")
			.attr("class", "outbreak_spread_map_deathcount_label")
			.attr("x", width-120)
			.attr("y", 100)
			.text("")
			.style("font-size", "1rem")
			.style("font-weight", "bold")
			.style("stroke", "none")
			.style("fill", "#0000ff");



		//const start_date = data[0].date;
		const start_date = new Date(2020, 2, 1); //Start from March
		//const end_date = data[data.length-1].date;
		//const diff_time = Math.abs(end_date - start_date);
		//const num_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24)); 
		step_duration = 10;
		step_delay = 50;
		//total_sim_time = step_duration*num_days;
		//var init_offset_days = 0;
		//var cdt = start_date;


		var anm;
		repeat_outbreak_spread_animation();
		function repeat_outbreak_spread_animation() {

			anm = g2.selectAll(".outbreak_spread_circles")
							.transition()
								.delay(function(d,i) {
									diff_time = Math.abs(d.date - start_date);
									num_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24))
									return num_days*step_delay;
								})
								.duration(step_duration)
								.style("opacity", function(d, i) {
									return 1;
								});

						g2.selectAll(".outbreak_spread_circles")
							.transition()
								.delay(function(d,i) {
									diff_time = Math.abs(d.status_change_date - start_date);
									num_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24))
									return num_days*step_delay;
								})
								.duration(step_duration)
								.style("fill", function(d, i) {
									if (d.status == "Recovered") {
										return "#229954";
									} else if (d.status == "Deceased") {
										return "#0000ff"; //"#000000";
									} else if (d.status == "Hospitalized") {
										return "#ff0000"; //"#FA8072";
									}
								});

		}


		//anm.on("end", repeat_outbreak_spread_animation);


		//repeat_outbreak_spread_transition();
		function repeat_outbreak_spread_transition() {

			for (var c=init_offset_days; c<=num_days+init_offset_days; c++) {

				var anm = g2.selectAll(".outbreak_spread_circles")
							.transition()
							.delay(function(d,i) { return (c-1)*step_delay; })
							.duration(step_duration)
								.style("opacity", function(d, i) {
									if (cdt >= d.date) {
										return 1;
									} else {
										return 0;
									}
								})
								.style("fill", function(d, i) {
									if (cdt >= d.status_change_date) {
										if (d.status == "Recovered") {
											return "#229954";
										} else if (d.status == "Deceased") {
											return "#0000ff"; //"#000000";
										} else if (d.status == "Hospitalized") {
											return "#ff0000"; //"#FA8072";
										}
									} else {
										return "#ff0000";
									}
								});


				g2.selectAll(".outbreak_spread_date_label")
						.transition()
						.delay(function(d,i) { return (c-1)*step_delay; })
						.duration(step_duration)
							.text(cdt.getDate() + " " + month_list[cdt.getMonth()]);

				g2.selectAll(".outbreak_spread_map_casecount_label")
						.transition()
						.delay(function(d,i) { return (c-1)*step_delay; })
						.duration(step_duration)
							.text(numberWithCommas(daily_cum_cases_count[cdt]) + " cases");

				g2.selectAll(".outbreak_spread_map_recovercount_label")
						.transition()
						.delay(function(d,i) { return (c-1)*step_delay; })
						.duration(step_duration)
							.text(numberWithCommas(daily_cum_recovered_count[cdt]) + " recoveries");

				g2.selectAll(".outbreak_spread_map_deathcount_label")
						.transition()
						.delay(function(d,i) { return (c-1)*step_delay; })
						.duration(step_duration)
							.text(numberWithCommas(daily_cum_deaths_count[cdt]) + " deaths");

				/*
				if (c==num_days+init_offset_days) {
					anm.on("end", on_transition_end);
				}
				function on_transition_end() {
					setTimeout(repeat_outbreak_spread_transition, 10*1000);
				}
				*/

				cdt.setDate(cdt.getDate() + 1);
				
			}
		}


























		/*


		current_date = start_date;
		function update_date() {
			// Add a day
			current_date.setDate(current_date.getDate() + 1);
			if (current_date <= end_date) {
				g.selectAll(".outbreak_spread_map_date_label").remove();
				//g.selectAll(".cluster_map_casecount_label").remove();

				g.append("text")
					.attr("class", "outbreak_spread_map_date_label")
					.attr("x", width-120)
					.attr("y", 40)
					.text(current_date.getDate() + " " + month_list[current_date.getMonth()])
					.style("font-size", "2rem")
					.style("font-weight", "bold")
					.style("stroke", "none")
					.style("fill", "black");

				
				g2.selectAll(".outbreak_spread_circles")
					.transition()
					.duration(100)
						.style("opacity", function(d, i) {
							dt = d.date;
							if (current_date >= dt) {
								return 1;
							} else {
								return 0;
							}
							//return 1;
						})
						
						.style("fill", function(d, i) {
							if (current_date >= d.status_change_date) {
								if (d.status == "Recovered") {
									return "#229954";
								} else if (d.status == "Deceased") {
									return "#0000ff"; //"#000000";
								} else if (d.status == "Hospitalized") {
									return "#ff0000"; //"#FA8072";
								}
							} else {
								return "#ff0000";
							}
						});
						
			}
		}

		for (let i=1; i<=num_sim_days; i++) {
			outbreak_spread_timeouts.push(setTimeout( update_date, i*num_milliseconds_per_date ));
		}

		*/

    }


    // When cases data is loaded do this
	function data_ready(d) {
		d[0] = +d.longitude;
		d[1] = +d.latitude;
		return d;
	}

	// Zoom functionality
	function zoomed() {
		g.style("stroke-width", 1 / d3.event.transform.k + "px");
      	g.selectAll('path') // To prevent stroke width from scaling
        	.attr('transform', d3.event.transform);
		g.selectAll(".country_focus").style("stroke-width", d3.event.transform.k/10 + "px").style("stroke", "#000");
    }

    function numberWithCommas(x) {
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

}