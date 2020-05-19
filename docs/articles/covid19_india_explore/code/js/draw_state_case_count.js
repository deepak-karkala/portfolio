
//(function(){
script_load_timeout_list.push(setTimeout(load_stateCaseCount_script, 7*script_load_timestep));


function load_stateCaseCount_script() {
	// Daily cases
	idname = "#state_case_count"
	d3.select(idname).select("svg").remove();
	filename = "data/state_case_count.csv";
	width_scale_factor = 0.85;
	var bb = d3.select(idname).node().offsetWidth;

	if (window_inner_width <= small_screen_thresh) {
		var margin = {right:20, left:30, top:20, bottom:50};
	} else {
		var margin = {right:50, left:50, top:20, bottom:50};
	}

	base_width = bb*width_scale_factor - margin.left - margin.right;
	//base_height = bb*height_scale_factor - margin.top - margin.bottom;
	//height_scale_factor = 0.40;
	var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.75, 0.3]);
	height_scale_factor = height_scale_factor_width(bb);
	base_height = bb*height_scale_factor - margin.top - margin.bottom;

	draw_state_case_count(idname, filename, base_width, base_height, margin);

}

function draw_state_case_count(idname, filename, width, height, margin) {

	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_state_case_count")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");
	

    var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
    //var y = d3.scaleLinear().range([height, 0]);
    var y = d3.scaleLog().range([height, 0]).base(10);

    var yAxis = d3.axisLeft()
                  .scale(y)
                  .tickFormat( (d,i) => {
	                  		if (d==1000000) {
	                  			return numberWithCommas(d);
			                } else if ((d==100)) { 
		                    	return numberWithCommas(d);
		                    } else if ((d==1000) || (d==10000) || (d==100000) ) {
		                    	return d/1000+"k";
		                    }
		                  })
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
    var state_case_count = [];
    var case_count_100 = [];
    var case_count_1000 = [];
    var case_count_10000 = [];

    d3.csv(filename, function(error, data_csv) {
		if (error) throw error;

		dates = d3.keys(data_csv[0]); //.slice(1, data_csv.length-1));
		idx = 0;
		for (var i=2; i<dates.length-1; i++) {
			date_data[idx] = [];
			date_data[idx].date = parseTime(dates[i]);

			case_count_100[idx] = [];
			case_count_100[idx].date = date_data[idx].date;
			case_count_100[idx].rate = 100;

			case_count_1000[idx] = [];
			case_count_1000[idx].date = date_data[idx].date;
			case_count_1000[idx].rate = 1000;

			case_count_10000[idx] = [];
			case_count_10000[idx].date = date_data[idx].date;
			case_count_10000[idx].rate = 10000;
			idx += 1
		}

		x.domain(date_data.map(function(d) {
			return d.date;
		}));
	    y.domain([1, 30000]);

	    var state_latest_case_count = [];
		for (var j=0; j<data_csv.length; j++) {
		//for (var j=2; j<=2; j++) {

			state_case_count = data_csv[j]; //.slice(1, data_csv.length-1));
			state_name = state_case_count[dates[0]].replace(/\./g,"").replace(", ","_").split(" ").join("-");
			state_growth_rate[state_name] = parseInt(state_case_count[dates[1]]);
			state_color = get_growth_color_discrete(state_growth_rate[state_name])

			//console.log(dates[1]);
			//console.log(state_case_count[dates[1]]);			
			//console.log(state_name);
			//console.log(district_total_case_count);


			if (1) { //(district_total_case_count >= min_case_count_to_plot_case_density) {
				case_count_state_list.push(state_name);

				var didx = 0;
				var first_nonzero = 0;
				var data = []
				for (var i=2; i<dates.length-1; i++) {
					

					if (parseFloat(state_case_count[dates[i]])>0) {
						first_nonzero = 1
					}

					//console.log(state_case_count[dates[i]]);

					if ( (state_case_count[dates[i]]!=="")) {
						data[didx] = [];
						data[didx].date = parseTime(dates[i]);
						data[didx].rate = parseFloat(state_case_count[dates[i]]);
						didx += 1;
					}
		    	}
		    	state_latest_case_count[state_name] = data[didx-1].rate.toFixed(0);

		        // define the line
				var valueline = d3.line()
					.x(function(d) {
						//console.log(d.date);
						return x(d.date);
					})
					.y(function(d) {
						//console.log(d.rate);
						if (d.rate==0) {
							return height;
						} else {
							return y(d.rate);
						}
					});

				// Add the valueline path.
				path = svg.append("path")
		                .data([data])
		                .attr("class", state_name+"_state_case_count_curve state_case_count_curve")
		                .attr("d", valueline)
		                .attr("fill", "none")
		                .attr("stroke-width", "1.5px")
		                .style("z-index", 0)
		                .attr("stroke", function() {
				      		if (state_case_count_highlight_list.includes(state_name)) {
				      			return state_color;
		                	} else {
		                		return default_background_color_state_case_count; 
		                	}
		                })
		                .attr("opacity", function() {
				      		if (state_case_count_highlight_list.includes(state_name)) {
				      			return 1;
				      		} else {
				      			return 0.5;
				      		}
			      		})
		                .on("mouseover", function(d,i) {
	                    	state_name = this.getAttribute("class").split("_state_case_count_curve")[0];
							show_selected_state_case_count(state_name);

							if (isNaN(state_growth_rate[state_name])) {
								return tooltip.html(`<div class='well'>`+
	                                                  `<span class="state_name text-center">`+state_name.split("-").join(" ")+`</span></br>` +
	                                                `<span class="case_count_info">`+ state_latest_case_count[state_name] +`</span> cases</div>`)
	                                          .style("visibility", "visible");
							} else {
	                    		return tooltip.html(`<div class='well'>`+
	                                                  `<span class="state_name text-center">`+state_name.split("-").join(" ")+`</span></br>` +
	                                                `<span class="case_count_info">`+ state_latest_case_count[state_name] +`</span> cases, `+
	                                                `doubling every `+ state_growth_rate[state_name] + ` days</div>` )
	                                          .style("visibility", "visible");
	                        }
		                })
		                .on("mousemove", function(){
	                        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
	                    })
		                .on("mouseout", function(d,i) {
							show_all_states_case_count_button_click_handler();
	                        return tooltip.style("visibility", "hidden");
		                })


		        svg.append("text")
		        	.attr("class", state_name+"_label state_label")
		        	//.attr("x", width-margin.right-10)
		        	.attr("x", x(data[didx-1].date)+10) //-margin.right)
		        	.attr("y", function(d,i) {
		        		if (data[didx-1].rate==0) {
							return height;
						} else {
							return y(data[didx-1].rate);
						}
		        	})
		        	//.text(state_name.replace("_"," "))
		        	.text(function(d,i) {
		        		if (window_inner_width > small_screen_thresh) {
		        			return state_name.replace("_"," ").replace("-"," ");
		        		} else{
			        		return state_name_code_mapping[state_name.replace("_"," ").replace("-"," ")]
			        	}
		        	})
		        	.style("font-size", "0.75rem")
		        	.style("font-weight", "bold")
		        	.style("fill", "#000")
		        	.attr("opacity", function() {
		      			if (state_case_count_highlight_list.includes(state_name)) {
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
		      			return state_name+"_state_case_count_circles state_case_count_circles"
		      		})
		      		.attr("cx", function(d,i) { return x(d.date); })
		      		.attr("cy", function(d,i) {
		      			if (d.rate==0) {
							return height;
						} else {
							return y(d.rate);
						}
		      		})
		      		.attr("r", "0.15rem")
		      		.style("fill", state_color)
		      		.attr("opacity", function(d) {
		      			if (state_case_count_highlight_list.includes(state_name)) {
		      				return 1;
		      			} else {
		      				return 0;
		      			}
		      		});
		    }

        }
		set_select_state_case_count(case_count_state_list);

		var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat("%b %e"))
                    //.ticks(4);
                    .tickValues(x.domain().filter(function(d,i){ return !(i%14)}));

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


		horizontal_grid_lines_data = [case_count_100, case_count_1000, case_count_10000];
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
		  .attr("y", 15)
		  .style("text-anchor", "end")
		  .text(function(){
		      return "Total confirmed cases (log)";
		  })
		  .style("fill", "black")
		  .style("font-weight", "bold")
		  .style("font-size", "0.75rem");

	    	
    });

    
}


$("#select_state_case_count").change(function() {

    state_name = this.value;
	if (state_name=="") {
		show_all_states_case_count_button_click_handler();
	} else {
		show_selected_state_case_count(state_name);
	}

});



function show_selected_state_case_count(state_name) {
	state_color = get_growth_color_discrete(state_growth_rate[state_name])

	d3.selectAll(".state_case_count_curve").attr("stroke", default_background_color_state_case_count).attr("opacity", 0.25).attr("stroke-width", "2px");
	d3.selectAll(".state_label").attr("opacity", 0);
	d3.selectAll(".state_case_count_circles").attr("opacity", 0);
	
	d3.select("."+state_name+"_state_case_count_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
	d3.select("."+state_name+"_label").attr("opacity", 1);
	d3.selectAll("."+state_name+"_state_case_count_circles").attr("opacity", 1);
}



$("#show_all_states_case_count").click(function() {
    show_all_states_case_count_button_click_handler();
    $('#select_state_case_count').val("").trigger('change');
});

function show_highlight_states_case_count() {
	for (var h=0; h<state_case_count_highlight_list.length; h++) {
		highlight_state_name = state_case_count_highlight_list[h];
		state_code = highlight_state_name.split("_")[1];
		state_color = get_growth_color_discrete(state_growth_rate[highlight_state_name]);
		d3.select("."+highlight_state_name+"_state_case_count_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
		d3.select("."+highlight_state_name+"_label").attr("opacity", 1);
		d3.selectAll("."+highlight_state_name+"_state_case_count_circles").attr("opacity", 1);
	}
}

function set_select_state_case_count(case_count_state_list) {
    var state_list = '';
    for (var i=0; i<case_count_state_list.length; i++) {
    	state_name = case_count_state_list[i].replace("_",", ").replace("-", " ")
        state_list += `<option value="`+case_count_state_list[i]+`">`+state_name+`</option>`;
    }
    $('#select_state_case_count').append(state_list);
}

function show_all_states_case_count_button_click_handler() {
	d3.selectAll(".state_case_count_curve").attr("stroke", default_background_color_state_case_count).attr("opacity", 0.5).attr("stroke-width", "1.5px");
	d3.selectAll(".state_label").attr("opacity", 0);
	d3.selectAll(".state_case_count_circles").attr("opacity", 0);

	show_highlight_states_case_count();
}


function get_growth_color_discrete(growth_rate) {
	var color_scale = d3.scaleSequential(d3.interpolatePlasma); //interpolateRdYlGn

	//console.log(growth_rate);

	if (growth_rate==-1000) {
	  growth_color = color_scale(1);
	} else if ((growth_rate>=2) && (growth_rate<=4)) {
	  growth_color = color_scale(0);
	} else if ((growth_rate>4) && (growth_rate<=6)) {
	  growth_color = color_scale(0.2);
	} else if ((growth_rate>6) && (growth_rate<=10)) {
	  growth_color = color_scale(0.4);
	} else if ((growth_rate>10) && (growth_rate<=14)) {
	  growth_color = color_scale(0.6);
	} else if ((growth_rate>14) && (growth_rate<=30)) {
	  growth_color = color_scale(0.8);
	} else {
	  growth_color = color_scale(0.9);
	}
	return growth_color;
}

plot_flattening_curve_legend("#state_case_count_legend");

function plot_flattening_curve_legend(idname) {
    var color_scale = d3.scaleSequential(d3.interpolatePlasma);

    var linear = d3.scaleOrdinal()
      .domain([2, 4, 6, 10, 14, 30])
      .range([color_scale(0), color_scale(0.2), color_scale(0.4), color_scale(0.6), color_scale(0.8), color_scale(0.9)]);

    var svg = d3.select(idname).append("svg")
    				.attr("width", 300)
      				.attr("height", 40);

    if (window_inner_width <= small_screen_thresh) {
    	svg.append("g")
	      .attr("class", "legendLinear")
	      .attr("transform", "translate(100,0)");
    } else {
	    svg.append("g")
	      .attr("class", "legendLinear")
	      .attr("transform", "translate(0,0)");
	}

    var legendLinear = d3.legendColor()
      .shapeWidth(20)
      .shapeHeight(10)
      .cells([2, 4, 6, 10, 14, 30])
      .orient('horizontal')
      .scale(linear);

    svg.select(".legendLinear")
      .call(legendLinear);
}

//})();
