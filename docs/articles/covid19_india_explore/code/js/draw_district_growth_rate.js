//(function(){

script_load_timeout_list.push(setTimeout(load_districtGrowthRate_script, 13*script_load_timestep));

function load_districtGrowthRate_script() {
	// District wise growth rate
	idname = "#district_growth_rates"
	d3.select(idname).select("svg").remove();
	filename = "data/districtwise_growth_rate_derivedFromRawData.csv";
	//type = "cases";
	width_scale_factor = 0.95;
	//height_scale_factor = 0.35;
	var bb = d3.select(idname).node().offsetWidth;
	var margin = {right:80, left:30, top:20, bottom:60};
	base_width = bb*width_scale_factor - margin.left - margin.right;
	//base_height = bb*height_scale_factor - margin.top - margin.bottom;
	var height_scale_factor_width = d3.scaleLinear().domain([minDeviceWidth, maxDeviceWidth]).range([0.75, 0.3]);
	height_scale_factor = height_scale_factor_width(bb);
	base_height = bb*height_scale_factor - margin.top - margin.bottom;
	plot_district_growth_rate(idname, filename, base_width, base_height, margin);
}


function plot_district_growth_rate(idname, filename, width, height, margin) {

	var min_case_count_to_plot_growth_rate = 60;

	var growth_rate_district_list = [];
	var init_date_offset = 2;

	var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_flattening_curve")
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
    var district_growth_rate = [];
    var growth_rate_50 = [];
    var growth_rate_100 = [];
    var growth_rate_150 = [];

    d3.csv(filename, function(error, data_csv) {
		if (error) throw error;

		dates = d3.keys(data_csv[0]); //.slice(1, data_csv.length-1));
		idx = 0;
		for (var i=init_date_offset; i<dates.length-1; i++) {
			date_data[idx] = [];
			date_data[idx].date = parseTime(dates[i]);

			growth_rate_50[idx] = [];
			growth_rate_50[idx].date = date_data[idx].date;
			growth_rate_50[idx].rate = 50;

			growth_rate_100[idx] = [];
			growth_rate_100[idx].date = date_data[idx].date;
			growth_rate_100[idx].rate = 100;

			growth_rate_150[idx] = [];
			growth_rate_150[idx].date = date_data[idx].date;
			growth_rate_150[idx].rate = 150;
			idx += 1
		}

		x.domain(date_data.filter(function(d) { return d.date>=start_date_districtGrowthRate } ).map(function(d) {
			//console.log(d.date);
			return d.date;
		}));
	    y.domain([0, 100]);

	    var district_latest_growth_rate = [];
		for (var j=0; j<data_csv.length; j++) {
		//for (var j=2; j<=2; j++) {

			district_growth_rate = data_csv[j]; //.slice(1, data_csv.length-1));
			district_name = district_growth_rate[dates[0]].replace(/\./g,"").replace(", ","_").split(" ").join("-");
			state_code = district_name.split("_")[1];
			//state_color = district_growth_rate_color_scale(state_color_mapping(state_code_mapping[state_code]));
			state_color = district_growth_rate_state_color_mapping(state_code_mapping[state_code]);
			district_total_case_count = parseInt(district_growth_rate[dates[1]]);

			//console.log(min_case_count_to_plot_growth_rate);
			//console.log(district_total_case_count);

			if (district_total_case_count >= min_case_count_to_plot_growth_rate) {
				//console.log(district_name);
				growth_rate_district_list.push(district_name);

				var didx = 0;
				var first_nonzero = 0;
				var data = []
				for (var i=init_date_offset; i<dates.length-1; i++) {
					
					if (parseFloat(district_growth_rate[dates[i]])>0) {
						first_nonzero = 1
					}

					if ((first_nonzero==1) && (district_growth_rate[dates[i]]!=="")) {
						dt = parseTime(dates[i]);
						if (dt >= start_date_districtGrowthRate) {
							data[didx] = [];
							data[didx].date = dt;
							data[didx].rate = parseFloat(district_growth_rate[dates[i]]);
							didx += 1;
			    			district_latest_growth_rate[district_name] = data[didx-1].rate;
			    		}
					}
		    	}

		    	//console.log(data);

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
		                .attr("class", district_name+"_growth_rate_curve growth_rate_curve")
		                .attr("d", valueline)
		                .attr("fill", "none")
		                .attr("stroke-width", "1.5px")
		                .attr("stroke", function() {
				      		if (district_growth_rate_highlight_list.includes(district_name)) {
				      			return state_color;
		                	} else {
		                		return default_background_color_district_growth_rate; 
		                	}
		                })
		                .attr("opacity", function() {
				      		if (district_growth_rate_highlight_list.includes(district_name)) {
				      			return 1;
				      		} else {
				      			return 0.5;
				      		}
			      		})
		                .on("mouseover", function(d,i) {
	                    	dname_with_state_code = this.getAttribute("class").split("_growth_rate_curve")[0];
							show_selected_district_growth_rate(dname_with_state_code);

	                    	return tooltip.html(`<div class='well'>`+
	                                                  `<span class="state_name text-center">`+dname_with_state_code.replace("_",", ")+`</span></br>` +
	                                                ` Current daily growth rate of <span class="case_count_info">`+ Math.round(district_latest_growth_rate[dname_with_state_code],0) +`</span> %</div>` )
	                                          .style("visibility", "visible");
		                })
		                .on("mousemove", function(){
	                        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
	                    })
		                .on("mouseout", function(d,i) {
							show_all_districts_growth_rate_button_click_handler();
	                        return tooltip.style("visibility", "hidden");
		                })


		        svg.append("text")
		        	.attr("class", district_name+"_label label")
		        	.attr("x", width-margin.right+50)
		        	.attr("y", y(data[didx-1].rate))
		        	.text(district_name.replace("_"," "))
		        	.style("font-size", "0.75rem")
		        	.style("font-weight", "bold")
		        	.style("fill", state_color)
		        	.attr("opacity", function() {
		      			if (district_growth_rate_highlight_list.includes(district_name)) {
		      				return 1;
		      			} else {
		      				return 0;
		      			}
		      		});


		      	svg.selectAll(".dot")
		      		.data(data)
	              .enter().append("circle")
		      		.attr("class", function(d) {
		      			//console.log(district_name+"_circles");
		      			return district_name+"_growth_rate_circles growth_rate_circles"
		      		})
		      		.attr("cx", function(d,i) { return x(d.date); })
		      		.attr("cy", function(d,i) { return y(d.rate); })
		      		.attr("r", "0.15rem")
		      		.style("fill", state_color)
		      		.attr("opacity", function(d) {
		      			if (district_growth_rate_highlight_list.includes(district_name)) {
		      				return 1;
		      			} else {
		      				return 0;
		      			}
		      		});
		    }

        }
		set_select_district_growth_rate(growth_rate_district_list);

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


		horizontal_grid_lines_data = [growth_rate_50, growth_rate_100, growth_rate_150];
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
		      return "Daily growth rate (%)";
		  })
		  .style("fill", "black")
		  .style("font-weight", "bold")
		  .style("font-size", "1.0rem");


		svg.append("text")
			.attr("class", "label_histogram")
			.attr("x", width)
			.attr("y", height+50)
			.text("Districts with min 50 cases, Growth rate averaged over previous week")
			.style("text-anchor", "end")
			.style("fill", "#808080")
			.style("font-size", "0.5rem");
	    	
    });

    
}


$("#select_district_growth_rate").change(function() {

    district_name = this.value;

	if (district_name=="") {
		show_all_districts_growth_rate_button_click_handler();
	} else {
		show_selected_district_growth_rate(district_name);
	}

});



function show_selected_district_growth_rate(district_name) {
	state_code = district_name.split("_")[1];
	state_color = district_growth_rate_state_color_mapping(state_code_mapping[state_code]);

	d3.selectAll(".growth_rate_curve").attr("stroke", default_background_color_district_growth_rate).attr("opacity", 0.25).attr("stroke-width", "2px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".growth_rate_circles").attr("opacity", 0);
	
	d3.select("."+district_name+"_growth_rate_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
	d3.select("."+district_name+"_label").attr("opacity", 1);
	d3.selectAll("."+district_name+"_growth_rate_circles").attr("opacity", 1);
}



$("#show_all_districts_growth_rate").click(function() {
    show_all_districts_growth_rate_button_click_handler();
    $('#select_district_growth_rate').val("").trigger('change');
});

function show_highlight_districts_growth_rate() {
	for (var h=0; h<district_growth_rate_highlight_list.length; h++) {
		highlight_state_name = district_growth_rate_highlight_list[h];
		state_code = highlight_state_name.split("_")[1];
		state_color = district_growth_rate_state_color_mapping(state_code_mapping[state_code]);

		d3.select("."+highlight_state_name+"_growth_rate_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
		d3.select("."+highlight_state_name+"_label").attr("opacity", 1);
		d3.selectAll("."+highlight_state_name+"_growth_rate_circles").attr("opacity", 1);
	}
}

function set_select_district_growth_rate(growth_rate_district_list) {
    var district_list = '';
    for (var i=0; i<growth_rate_district_list.length; i++) {
    	district_name = growth_rate_district_list[i].replace("_",", ").replace("-", " ")
        district_list += `<option value="`+growth_rate_district_list[i]+`">`+district_name+`</option>`;
    }
    $('#select_district_growth_rate').append(district_list);
}

function show_all_districts_growth_rate_button_click_handler() {
	d3.selectAll(".growth_rate_curve").attr("stroke", default_background_color_district_growth_rate).attr("opacity", 0.5).attr("stroke-width", "1.5px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".growth_rate_circles").attr("opacity", 0);

	show_highlight_districts_growth_rate();
}
//})();
