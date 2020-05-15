// District wise growth rate
idname = "#district_case_density"
d3.select(idname).select("svg").remove();
filename = "data/districtwise_latest_cases_per_population.csv";
//type = "cases";
width_scale_factor = 0.95;
height_scale_factor = 0.35;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:80, left:30, top:20, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
plot_district_case_density_curve(idname, filename, base_width, base_height);


var district_case_density_state_color_mapping = d3.scaleOrdinal()
			.domain([0, 36])
			.range(state_colors_list);


var district_case_density_highlight_list = ["Mumbai_MH", "Bhopal_MP",
			"Indore_MP", "Delhi_DL", "Kasaragod_KL"]; //"SPS-Nellore_AP"

var default_background_color_district_case_density = "#c0c0c0";

var min_case_count_to_plot_case_density = 25;

function plot_district_case_density_curve(idname, filename, width, height) {

	var case_density_district_list = [];

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
    var district_case_density = [];
    var case_density_2 = [];
    var case_density_4 = [];
    var case_density_6 = [];

    d3.csv(filename, function(error, data_csv) {
		if (error) throw error;

		dates = d3.keys(data_csv[0]); //.slice(1, data_csv.length-1));
		idx = 0;
		for (var i=2; i<dates.length-1; i++) {
			date_data[idx] = [];
			date_data[idx].date = parseTime(dates[i]);

			case_density_2[idx] = [];
			case_density_2[idx].date = date_data[idx].date;
			case_density_2[idx].rate = 2;

			case_density_4[idx] = [];
			case_density_4[idx].date = date_data[idx].date;
			case_density_4[idx].rate = 4;

			case_density_6[idx] = [];
			case_density_6[idx].date = date_data[idx].date;
			case_density_6[idx].rate = 6;
			idx += 1
		}

		x.domain(date_data.map(function(d) {
			//console.log(d.date);
			return d.date;
		}));
	    y.domain([0, 5]);

	    var district_latest_case_density = [];
		for (var j=0; j<data_csv.length; j++) {
		//for (var j=2; j<=2; j++) {

			district_case_density = data_csv[j]; //.slice(1, data_csv.length-1));
			district_name = district_case_density[dates[0]].replace(/\./g,"").replace(", ","_").split(" ").join("-");
			state_code = district_name.split("_")[1];
			//state_color = district_case_density_color_scale(state_color_mapping(state_code_mapping[state_code]));
			state_color = district_case_density_state_color_mapping(state_code_mapping[state_code]);

			district_total_case_count = parseInt(district_case_density[dates[1]]);

			//console.log(dates[1]);
			//console.log(district_case_density[dates[1]]);			
			//console.log(district_name);
			//console.log(district_total_case_count);


			if (district_total_case_count >= min_case_count_to_plot_case_density) {
				case_density_district_list.push(district_name);

				var didx = 0;
				var first_nonzero = 0;
				var data = []
				for (var i=2; i<dates.length-1; i++) {
					
					//console.log((district_case_density[dates[i]])==="");

					if (parseFloat(district_case_density[dates[i]])>0) {
						first_nonzero = 1
					}

					//console.log(district_case_density[dates[i]]);

					if ((first_nonzero==1) && (district_case_density[dates[i]]!=="")) {
						data[didx] = [];
						data[didx].date = parseTime(dates[i]);
						data[didx].rate = parseFloat(district_case_density[dates[i]]);
						didx += 1;
					}
		    	}
		    	district_latest_case_density[district_name] = data[didx-1].rate.toFixed(2);

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
		                .attr("class", district_name+"_case_density_curve case_density_curve")
		                .attr("d", valueline)
		                .attr("fill", "none")
		                .attr("stroke-width", "1.5px")
		                .style("z-index", 0)
		                .attr("stroke", function() {
				      		if (district_case_density_highlight_list.includes(district_name)) {
				      			return state_color;
		                	} else {
		                		return default_background_color_district_case_density; 
		                	}
		                })
		                .attr("opacity", function() {
				      		if (district_case_density_highlight_list.includes(district_name)) {
				      			return 1;
				      		} else {
				      			return 0.5;
				      		}
			      		})
		                .on("mouseover", function(d,i) {
	                    	dname_with_state_code = this.getAttribute("class").split("_case_density_curve")[0];
							show_selected_district_case_density(dname_with_state_code);

	                    	return tooltip.html(`<div class='well'>`+
	                                                  `<span class="state_name text-center">`+dname_with_state_code.replace("_",", ")+`</span></br>` +
	                                                ` Currently <span class="case_count_info">`+ district_latest_case_density[dname_with_state_code] +`</span> daily cases per 100,000 people.</div>` )
	                                          .style("visibility", "visible");
		                })
		                .on("mousemove", function(){
	                        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
	                    })
		                .on("mouseout", function(d,i) {
							show_all_districts_case_density_button_click_handler();
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
		      			if (district_case_density_highlight_list.includes(district_name)) {
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
		      			return district_name+"_case_density_circles case_density_circles"
		      		})
		      		.attr("cx", function(d,i) { return x(d.date); })
		      		.attr("cy", function(d,i) { return y(d.rate); })
		      		.attr("r", "0.15rem")
		      		.style("fill", state_color)
		      		.attr("opacity", function(d) {
		      			if (district_case_density_highlight_list.includes(district_name)) {
		      				return 1;
		      			} else {
		      				return 0;
		      			}
		      		});
		    }

        }
		set_select_district_case_density(case_density_district_list);

		var xAxis = d3.axisBottom()
                    .scale(x)
                    .tickFormat(d3.timeFormat("%B %e"))
                    .tickValues(x.domain().filter(function(d,i){ return !(i%4)}));

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


		horizontal_grid_lines_data = [case_density_2, case_density_4, case_density_6];
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
		      return "Daily Cases per 100,000 people";
		  })
		  .style("fill", "black")
		  .style("font-weight", "bold")
		  .style("font-size", "1.0rem");


		svg.append("text")
			.attr("class", "label_histogram")
			.attr("x", width)
			.attr("y", height+50)
			.text("Districts with min "+min_case_count_to_plot_case_density+" cases, Case density averaged over previous week")
			.style("text-anchor", "end")
			.style("fill", "#808080")
			.style("font-size", "0.75rem");
	    	
    });

    
}


$("#select_district_case_density").change(function() {

    district_name = this.value;

	if (district_name=="") {
		show_all_districts_case_density_button_click_handler();
	} else {
		show_selected_district_case_density(district_name);
	}

});



function show_selected_district_case_density(district_name) {
	state_code = district_name.split("_")[1];
	state_color = district_case_density_state_color_mapping(state_code_mapping[state_code]);

	d3.selectAll(".case_density_curve").attr("stroke", default_background_color_district_case_density).attr("opacity", 0.25).attr("stroke-width", "2px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".case_density_circles").attr("opacity", 0);
	
	d3.select("."+district_name+"_case_density_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
	d3.select("."+district_name+"_label").attr("opacity", 1);
	d3.selectAll("."+district_name+"_case_density_circles").attr("opacity", 1);
}



$("#show_all_districts_case_density").click(function() {
    show_all_districts_case_density_button_click_handler();
    $('#select_district_case_density').val("").trigger('change');
});

function show_highlight_districts_case_density() {
	for (var h=0; h<district_case_density_highlight_list.length; h++) {
		highlight_state_name = district_case_density_highlight_list[h];
		state_code = highlight_state_name.split("_")[1];
		state_color = district_case_density_state_color_mapping(state_code_mapping[state_code]);

		d3.select("."+highlight_state_name+"_case_density_curve").attr('stroke-width', "2px").attr("stroke", state_color).attr("opacity", 1.0);
		d3.select("."+highlight_state_name+"_label").attr("opacity", 1);
		d3.selectAll("."+highlight_state_name+"_case_density_circles").attr("opacity", 1);
	}
}

function set_select_district_case_density(case_density_district_list) {
    var district_list = '';
    for (var i=0; i<case_density_district_list.length; i++) {
    	district_name = case_density_district_list[i].replace("_",", ").replace("-", " ")
        district_list += `<option value="`+case_density_district_list[i]+`">`+district_name+`</option>`;
    }
    $('#select_district_case_density').append(district_list);
}

function show_all_districts_case_density_button_click_handler() {
	d3.selectAll(".case_density_curve").attr("stroke", default_background_color_district_case_density).attr("opacity", 0.5).attr("stroke-width", "1.5px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".case_density_circles").attr("opacity", 0);

	show_highlight_districts_case_density();
}


