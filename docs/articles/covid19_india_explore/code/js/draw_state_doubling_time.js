//(function(){

script_load_timeout_list.push(setTimeout(load_stateDoublingTime_script, 11*script_load_timestep));

function load_stateDoublingTime_script() {
	// State doubling time
	idname = "#states_doubling_time"
	d3.select(idname).select("svg").remove();
	filename = "data/state_doubling_time.csv";
	//type = "cases";
	width_scale_factor = 0.90;
	var bb = d3.select(idname).node().offsetWidth;
	if (window_inner_width <= small_screen_thresh) {
		var margin = {right:10, left:30, top:20, bottom:50};
	} else {
		var margin = {right:50, left:50, top:20, bottom:50};
	}
	base_width = bb*width_scale_factor - margin.left - margin.right;
	//height_scale_factor = 0.35;
	//base_height = bb*height_scale_factor - margin.top - margin.bottom;
	var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.75, 0.3]);
	height_scale_factor = height_scale_factor_width(bb);
	base_height = bb*height_scale_factor - margin.top - margin.bottom;
	plot_state_doubling_time(idname, filename, base_width, base_height, margin);
}



function plot_state_doubling_time(idname, filename, width, height, margin) {

	

	window_inner_width = window.innerWidth;

	var doubling_time_state_list = [];

	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_case_density")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
	

    var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    var yAxis = d3.axisRight()
                  .scale(y)
                  .ticks(4);

    // parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");
          
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(idname).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // get the data
    var date_data = [];
    var dates = [];
    var state_doubling_time = [];
    var case_density_50 = [];
    var case_density_100 = [];
    var case_density_150 = [];
    var start_date = new Date(2020, 4, 1);

    d3.csv(filename, function(error, data_csv) {
		if (error) throw error;

		dates = d3.keys(data_csv[0]); //.slice(1, data_csv.length-1));
		idx = 0;
		for (var i=1; i<dates.length-1; i++) {

			dt = parseTime(dates[i])
			if (window_inner_width <= small_screen_thresh) {
				//if ((dt.getMonth()>=4) && (dt.getDate()>=0)) {
				if (dt >= start_date) {
					date_data[idx] = [];
					date_data[idx].date = parseTime(dates[i]);

					case_density_50[idx] = [];
					case_density_50[idx].date = date_data[idx].date;
					case_density_50[idx].rate = 50;

					case_density_100[idx] = [];
					case_density_100[idx].date = date_data[idx].date;
					case_density_100[idx].rate = 100;

					case_density_150[idx] = [];
					case_density_150[idx].date = date_data[idx].date;
					case_density_150[idx].rate = 150;
					idx += 1
				}
			} else {
				date_data[idx] = [];
				date_data[idx].date = parseTime(dates[i]);

				case_density_50[idx] = [];
				case_density_50[idx].date = date_data[idx].date;
				case_density_50[idx].rate = 50;

				case_density_100[idx] = [];
				case_density_100[idx].date = date_data[idx].date;
				case_density_100[idx].rate = 100;

				case_density_150[idx] = [];
				case_density_150[idx].date = date_data[idx].date;
				case_density_150[idx].rate = 150;
				idx += 1
			}
		}

		x.domain(date_data.map(function(d) {
			//console.log(d.date);
			return d.date;
		}));
	    y.domain([0, 30]);

	    var state_latest_doubling_time = [];
		for (var j=0; j<data_csv.length; j++) {
		//for (var j=2; j<=2; j++) {

			state_doubling_time = data_csv[j]; //.slice(1, data_csv.length-1));
			state_name = state_doubling_time[dates[0]].replace(/\./g,"").replace(", ","_").split(" ").join("-");
			state_code = state_name.split("_")[1];
			//state_color = state_doubling_time_color_scale(state_color_mapping(state_code_name_mapping[state_code]));
			state_color = state_doubling_time_state_color_mapping(state_code_name_mapping[state_code]);


			if (1) { //(district_total_case_count >= min_case_count_to_plot_case_density) {
				doubling_time_state_list.push(state_name);

				var didx = 0;
				var first_nonzero = 0;
				var data = []
				for (var i=1; i<dates.length-1; i++) {
					
					//console.log((state_doubling_time[dates[i]])==="");

					if (parseFloat(state_doubling_time[dates[i]])>0) {
						first_nonzero = 1
					}

					//console.log(state_doubling_time[dates[i]]);

					if ((first_nonzero==1) && (state_doubling_time[dates[i]]!=="")) {

						dt = parseTime(dates[i])
						state_db_time = parseFloat(state_doubling_time[dates[i]]);
						if (window_inner_width <= small_screen_thresh) {
							if (dt >= start_date) {
								data[didx] = [];
								data[didx].date = dt;
								data[didx].rate = state_db_time;
								didx += 1;
							}
						} else {
							data[didx] = [];
							data[didx].date = dt;
							data[didx].rate = state_db_time;
							didx += 1;
						}
					}
		    	}
		    	state_latest_doubling_time[state_name] = data[didx-1].rate.toFixed(2);

		        // define the line
				var valueline = d3.line()
					.x(function(d) {
						//console.log(d.date);
						return x(d.date);
					})
					.y(function(d) {
						//console.log(d.rate);
						return y(d.rate);
					});

				// Add the valueline path.
				path = svg.append("path")
		                .data([data])
		                .attr("class", state_code+"_state_doubling_time_curve state_doubling_time_curve")
		                .attr("d", valueline)
		                .attr("fill", "none")
		                .attr("stroke-width", "1.5px")
		                .style("z-index", 0)
		                .attr("stroke", function() {
				      		if (state_doubling_time_highlight_list.includes(state_code)) {
				      			return state_color;
		                	} else {
		                		return default_background_color_state_doubling_time; 
		                	}
		                })
		                .attr("opacity", function() {
				      		if (state_doubling_time_highlight_list.includes(state_code)) {
				      			return 1;
				      		} else {
				      			return 0.5;
				      		}
			      		})
		                .on("mouseover", function(d,i) {
	                    	state_code = this.getAttribute("class").split("_state_doubling_time_curve")[0];
							show_selected_state_doubling_time(state_code);

	                    	return tooltip.html(`<div class='well'>`+
	                                                  `<span class="state_name text-center">`+sname_with_state_code.split("_")[0]+`</span></br>` +
	                                                ` Currently doubling in <span class="case_count_info">`+ state_latest_doubling_time[sname_with_state_code] +`</span> days</div>` )
	                                          .style("visibility", "visible");
		                })
		                .on("mousemove", function(){
	                        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
	                    })
		                .on("mouseout", function(d,i) {
							show_all_states_doubling_time_button_click_handler();
	                        return tooltip.style("visibility", "hidden");
		                })


		        svg.append("text")
		        	.attr("class", state_code+"_label label")
		        	//.attr("x", width-20) //-margin.right)
		        	.attr("x", x(data[didx-1].date)+10) //-margin.right)
		        	.attr("y", y(data[didx-1].rate))
		        	//.text(state_name.split("_")[0])
		        	.text(function(d,i){
		        		if (window_inner_width > small_screen_thresh) {
		        			return state_name.split("_")[0];
		        		} else{
			        		return state_name_code_mapping[state_name.split("_")[0].replace("-"," ")]
			        	}
		        	})
		        	.style("font-size", "0.75rem")
		        	.style("font-weight", "bold")
		        	.style("fill", state_color)
		        	.attr("opacity", function() {
		      			if (state_doubling_time_highlight_list.includes(state_code)) {
		      				return 1;
		      			} else {
		      				return 0;
		      			}
		      		});


		      	svg.selectAll(".dot")
		      		.data(data)
	              .enter().append("circle")
		      		.attr("class", function(d) {
		      			//console.log(state_name+"_circles");
		      			return state_code+"_state_doubling_time_circles state_doubling_time_circles"
		      		})
		      		.attr("cx", function(d,i) { return x(d.date); })
		      		.attr("cy", function(d,i) { return y(d.rate); })
		      		.attr("r", "0.15rem")
		      		.style("fill", state_color)
		      		.attr("opacity", function(d) {
		      			if (state_doubling_time_highlight_list.includes(state_code)) {
		      				return 1;
		      			} else {
		      				return 0;
		      			}
		      		});
		    }

        }
		set_select_state_doubling_time(doubling_time_state_list);

		var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat("%b %e"))
                    .tickValues(x.domain().filter(function(d,i){ return !(i%7)}));

		// add the x Axis
		svg.append("g")
		  .attr("transform", "translate(0," + (height+10) + ")")
		  .attr("class", "label_histogram")
		  .call(xAxis)
		  .style("font-size", "0.75rem")
		.append("text")
		  .attr("class", "label_histogram")
		  .attr("x", width)
		  .attr("y", -40)
		  .style("text-anchor", "end")
		  .style("fill", "black")
		  .style("font-size", "0.75rem");


		horizontal_grid_lines_data = [case_density_50, case_density_100, case_density_150];
		for (var hg=0; hg<3; hg++) {
			svg.append("path")
	            .data([horizontal_grid_lines_data[hg]])
	            .attr("d", valueline)
	            .attr("fill", "none")
	            .attr("stroke", "#c0c0c0")
	            .attr("stroke-width", "1.5px")
	            .attr("stroke-dasharray", 2);
        }

		// add the y Axis
		svg.append("g")
		  .attr("class", "label_histogram axis--y")
		  //.attr("transform", "translate("+(width+margin.right-40)+",0)")
		  .call(yAxis)
		  .style("font-size", "0.75rem")
		.append("text")
		  .attr("class", "label_histogram")
		  .attr("transform", "rotate(-90)")
		  .attr("x", 0)
		  .attr("y", -10)
		  .style("text-anchor", "end")
		  .text(function(){
		      return "Cases doubling time (days)";
		  })
		  .style("fill", "black")
		  .style("font-weight", "bold")
		  .style("font-size", "1.0rem");


		svg.append("text")
			.attr("class", "label_histogram")
			.attr("x", width)
			.attr("y", height+50)
			.text("Case doubling time averaged over 5 days")
			.style("text-anchor", "end")
			.style("fill", "#808080")
			.style("font-size", "0.75rem");
	    	
    });

    
}


$("#select_state_doubling_time").change(function() {
    state_code = this.value;
	if (state_code=="") {
		show_all_states_doubling_time_button_click_handler();
	} else {
		console.log(state_code);
		show_selected_state_doubling_time(state_code);
	}

});



function show_selected_state_doubling_time(state_code) {
	//state_code = state_name.split("_")[1];
	state_color = state_doubling_time_state_color_mapping(state_code_name_mapping[state_code]);

	d3.selectAll(".state_doubling_time_curve").attr("stroke", default_background_color_state_doubling_time).attr("opacity", 0.25).attr("stroke-width", "2px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".state_doubling_time_circles").attr("opacity", 0);
	
	d3.select("."+state_code+"_state_doubling_time_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
	d3.select("."+state_code+"_label").attr("opacity", 1);
	d3.selectAll("."+state_code+"_state_doubling_time_circles").attr("opacity", 1);
}



$("#show_all_states_doubling_time").click(function() {
    show_all_states_doubling_time_button_click_handler();
    $('#select_state_doubling_time').val("").trigger('change');
});

function show_highlight_states_doubling_time() {
	for (var h=0; h<state_doubling_time_highlight_list.length; h++) {
		state_code = state_doubling_time_highlight_list[h];
		//state_code = highlight_state_name.split("_")[1];
		state_color = state_doubling_time_state_color_mapping(state_code_name_mapping[state_code]);

		d3.select("."+state_code+"_state_doubling_time_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
		d3.select("."+state_code+"_label").attr("opacity", 1);
		d3.selectAll("."+state_code+"_state_doubling_time_circles").attr("opacity", 1);
	}
}

function set_select_state_doubling_time(doubling_time_state_list) {
    var state_list = '';
    for (var i=0; i<doubling_time_state_list.length; i++) {
    	state_name = doubling_time_state_list[i].split("_")[0].replace("-", " ")
    	state_code = doubling_time_state_list[i].split("_")[1];
        state_list += `<option value="`+state_code+`">`+state_name+`</option>`;
    }
    $('#select_state_doubling_time').append(state_list);
}

function show_all_states_doubling_time_button_click_handler() {
	d3.selectAll(".state_doubling_time_curve").attr("stroke", default_background_color_state_doubling_time).attr("opacity", 0.5).attr("stroke-width", "1.5px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".state_doubling_time_circles").attr("opacity", 0);

	show_highlight_states_doubling_time();
}



//})();

