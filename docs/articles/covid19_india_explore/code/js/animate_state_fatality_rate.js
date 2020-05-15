idname = "#fatality_rate_animation";
d3.select(idname).select("svg").remove();
filename = "data/state_case_death_testpm_ntod.csv";
width_scale_factor = 1.0;
height_scale_factor = 0.60;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:20, left:30, top:10, bottom:60};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
animate_state_fatality_rate(idname, filename, base_width, base_height);


function animate_state_fatality_rate(idname, file, width, height) {

	var state_fatality_rate_color_scale = d3.scaleLinear()
		.domain([0, 10, 50, 100, 250, 500])
		.range([d3.interpolateYlOrRd(0), d3.interpolateYlOrRd(0.2), d3.interpolateYlOrRd(0.4),
			d3.interpolateYlOrRd(0.6), d3.interpolateYlOrRd(0.8), d3.interpolateYlOrRd(1)]);
	//var growth_rate_normalised = d3.scaleLinear().domain([0, 100]).range([0, 1]);
	//var state_fatality_rate_color_scale = d3.scaleSequential(d3.interpolateYlOrRd);

	//var state_fatality_label_list = ["DL", "MH", "GJ", "MP", "AP", "KL", "RJ", "TN", "UP"];
	var min_case_count_to_show_testing_rate = 50;

	var month_list = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	// parse the date / time
    var parseTime = d3.timeParse("%Y-%m-%d");

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_state_fatality_rate")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    var svg = d3.select(idname).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    // Get the data
    d3.csv(file, function(error, data) {
		if (error) throw error;

		var columns = d3.keys(data[0]);
		start_date_str = "2020-04-02"; //columns[2].split("_")[0];
		end_date_str = columns[columns.length-1].split("_")[0];
		//console.log(last_date_str);

		const start_date = new Date(start_date_str);
		const end_date = new Date(end_date_str);
		const diff_time = Math.abs(end_date - start_date);
		const num_days = Math.ceil(diff_time / (1000 * 60 * 60 * 24)); 


		data = data.filter(function(d,i) {
			return +d[end_date_str+"_cases"]>=min_case_count_to_show_testing_rate;
		});

		// Read last data to set domains
		data.forEach(function(d, i) {
			//console.log(d["state"]);
			//console.log(d[end_date_str+"_cases"]);
			d.cases = +d[end_date_str+"_cases"];
			d.deaths = +d[end_date_str+"_deaths"];
			d.ntod = +d[end_date_str+"_ntod"];
			d.testspm = +d[end_date_str+"_testspm"];
		});
		//console.log(data);

		//Set domains
      	x.domain([0, d3.max(data, function(d) { return +d.testspm; })+200]);
      	//y.domain([0, d3.max(data, function(d) { return d.deaths; })]);
      	//y.domain([0, d3.max(data, function(d) { return +d.ntod; })]);
      	y.domain([0, 60]);
		

      	data.forEach(function(d, i) {
      		if (1) { //(+d[end_date_str+"_cases"] >= min_case_count_to_show_testing_rate) {
	      		cdt = start_date_str;
				//console.log(d["state"]);
				//console.log(d[start_date_str+"_cases"]);
				d.cases = +d[cdt+"_cases"];
				d.deaths = +d[cdt+"_deaths"];
				d.ntod = +d[cdt+"_ntod"];
				d.testspm = +d[cdt+"_testspm"];
				d.state = d.state;
			}
		});

      	//Append type rectangles
		svg.append("rect")
			.attr("class", "state_type_rect")
	        .attr("x", function(d) { return x(10); })
	        .attr("y", function(d) { return y(25); })
	        .attr("width", function(d) { return x(1200) - x(10); })
	        .attr("height", function(d) { return y(5) - y(25); })
	        .style("fill", function(d) { return "#FADBD8"; })
	        .style("opacity", 0)
	        .style("stroke", "black");
	    svg.append("text")
			.attr("class", "state_type_rect_text")
			.attr("x", function(d) { return x(10); })
			.attr("y", function(d) { return y(25+1); })
			.text("Low testing rate, true case count could be much higher")
			.style("font-size", "0.85rem")
			.style("font-weight", "bold")
			.style("fill", "#E74C3C")
	        .style("opacity", 0);

	    svg.append("rect")
			.attr("class", "state_type_rect")
	        .attr("x", function(d) { return x(1400); })
	        .attr("y", function(d) { return y(25); })
	        .attr("width", function(d) { return x(3000) - x(1400); })
	        .attr("height", function(d) { return y(5) - y(25); })
	        .style("fill", function(d) { return "#D6EAF8"; })
	        .style("opacity", 0)
	        .style("stroke", "black");
	    svg.append("text")
			.attr("class", "state_type_rect_text")
			.attr("x", function(d) { return x(1600); })
			.attr("y", function(d) { return y(25+1); })
			.text("Reasonable testing rate but cases doubling quickly")
			.style("font-size", "0.85rem")
			.style("font-weight", "bold")
			.style("fill", "#2E86C1")
	        .style("opacity", 0);

	    svg.append("rect")
			.attr("class", "state_type_rect")
	        .attr("x", function(d) { return x(600); })
	        .attr("y", function(d) { return y(50); })
	        .attr("width", function(d) { return x(1200) - x(600); })
	        .attr("height", function(d) { return y(35) - y(50); })
	        .style("fill", function(d) { return "#ABEBC6"; })
	        .style("opacity", 0)
	        .style("stroke", "black");
	    svg.append("text")
			.attr("class", "state_type_rect_text")
			.attr("x", function(d) { return x(400); })
			.attr("y", function(d) { return y(50+1); })
			.text("Reasonable testing rate, cases doubling slowly")
			.style("font-size", "0.85rem")
			.style("font-weight", "bold")
			.attr("fill", "#1D8348")
			//.style("stroke", "#28B463")
	        .style("opacity", 0);


      	svg.selectAll(".dot")
			.data(data)
        .enter().append("circle")
			.attr("class", "state_fatality_circles circles")
			.attr("r", function(d,i) {
				//console.log(d.growth/10);
				return Math.log10(d.cases)/4+"rem";
			})
			.attr("cx", function(d,i) {
				//console.log(d.cases);
				return x(d.testspm);
			})
			.attr("cy", function(d,i) {
				//console.log(d.deaths);
				//return y(d.deaths);
				return y(d.ntod);
			})
			.style("z-index", 0)
			.attr("fill", function(d,i) {
				//console.log(state_fatality_rate_color_scale(growth_rate_normalised(d.growth)));
				//return "black";
				return state_fatality_rate_color_scale(d.deaths);
			})
			.attr("stroke", "#000")
			.attr("stroke-width", "0.25px")
			.attr("opacity", 1)
			.on("mouseover", function(d, i) {
			    d3.selectAll(".state_fatality_circles").style("opacity", 0.5);
			    d3.select(this).style('stroke-width', '2px').style("opacity", 1.0);
			    //return tooltip.html(`<div class="well">"+d.state_name+" "</span></div>" ).style("visibility", "visible");
			    return tooltip.html(`<div class='well'>`+
                                      `<span class="state_name text-center">`+d.state_name+`</span></br>` +
                                    `Confirmed Cases: <span class="case_count_info">`+ d.cases +`</span></br>`+
                                    `Deaths: <span class="case_count_info">`+ d.deaths +`</span></br>`+
                                    `Number of days to double: <span class="case_count_info">`+ Math.round(d[end_date_str+"_ntod"]) +`</span></br>`+
                                    `Tests per million: <span class="case_count_info">`+ Math.round(d.testspm)+`</span>`+
                                    `</div>` )
                              .style("visibility", "visible");
			  }
			)
			.on("mousemove", function(){
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
			.on("mouseout", function(d, i){
				//d3.select(this).style('stroke-width', "1px").style("opacity", 1.0);
			    d3.selectAll(".state_fatality_circles").style("opacity", 1.0);
			    d3.select(this).style('stroke-width', '0.25px').style("opacity", 1.0);
				return tooltip.style("visibility", "hidden");
			});

			svg.selectAll(".text")
	      		.data(data)
	      	.enter().append("text")
				.attr("class", "state_fatality_text")
	      		.attr("x", function(d,i) {
					return x(d.testspm);
				})
	      		.attr("y", function(d,i) {
					return y(d.ntod);
					//return y(d.deaths);
				})
				.text(function(d,i) {
					//if (state_fatality_label_list.includes(d.state)) {
						return d.state;
					//} else {
					//	return "";
					//}
				})
				.style("z-index", 10)
				.style("font-size", "0.75rem");

			var xAxis = d3.axisBottom(x)
						.tickFormat( (d,i) => {
				          if (d%400 === 0) return d;
				      	}).tickPadding(2);
		        //.scale(x);
		        //.tickFormat(d3.timeFormat("%B %e"))
		        //.tickValues(x.domain().filter(function(d,i){ return !(i%10)}));

		    var yAxis = d3.axisLeft(y)
				      	.tickFormat( (d,i) => {
				          if (d%10 === 0) return d;
				      	}).tickPadding(2);

			// Add the X Axis
			svg.append("g")
				.attr("transform", "translate(0," + (height+20)+ ")")
				.call(xAxis)
				.attr("class", "state_fatality_xaxis")
				.style("font-size", "0.75rem")
			.append("text")
				.attr("class", "state_fatality_label")
				.attr("x", width)
				.attr("y", -10)
				.style("text-anchor", "end")
				.text(function(){
					return "Tests per million people";
				})
				.style("fill", "black")
				.style("stroke", "none")
				.style("font-weight", "bold")
				.style("font-size", "0.75rem");

			// Add the Y Axis
			svg.append("g")
				//.attr("transform", "translate("+(width)+",0)")
				//.call(d3.axisLeft(y))
				.call(yAxis)
				.attr("class", "state_fatality_yaxis")
				.style("font-size", "0.75rem")
			.append("text")
				.attr("class", "state_fatality_label")
				.attr("transform", "rotate(-90)")
				.attr("x", 0)
				.attr("y", 15)
				.style("text-anchor", "end")
				.text(function(){
				  return "Number of days to double cases";
				})
				.style("fill", "black")
				.style("stroke", "none")
				.style("font-weight", "bold")
				.style("font-size", "0.75rem");

			/*
			svg.selectAll("text")
		        //.attr("class", "label")
		        .style("fill", "black")
		        .style("shape-rendering", "crispEdges");
			*/

		    // Date label
			current_date = new Date(start_date_str);
		    svg.append("text")
				.attr("class", "state_fatality_rate_date_label")
				.attr("x", width-120)
				.attr("y", 40)
				.text(current_date.getDate() + " " + month_list[current_date.getMonth()])
				.style("font-size", "1.5rem")
				.style("font-weight", "bold")
				.style("stroke", "none")
				.style("fill", "black");

			
			// Grid lines
			var gridline = d3.line()
				.x(function(d) {return x(d.x);})
				.y(function(d) {return y(d.y);});
			for (var gi=1; gi<6; gi++) {
				gridline1_data = [];
				gridline1_data[0] = []; gridline1_data[0].x = 0; gridline1_data[0].y=gi*10;
				gridline1_data[1] = []; gridline1_data[1].x=2800; gridline1_data[1].y=gi*10
				svg.append("path")
			            .data([gridline1_data])
			            .attr("d", gridline)
			            .attr("fill", "none")
			            .attr("stroke", "#c0c0c0")
			            .attr("stroke-width", "1.5px")
			            .attr("stroke-dasharray", 2);
			}

			


		//console.log(num_days);
		//http://bl.ocks.org/darrenjaworski/5544599
		step_duration = 150;
		step_delay = 150;
		total_sim_time = step_duration*num_days;
		//while(1) {
		//	setTimeout( state_testing_animate, total_sim_time );
		//}
		//state_testing_animate();
		var init_offset_days = 21;


		repeat_circles_transition();
		function repeat_circles_transition() {
			svg.selectAll(".state_type_rect")
				.transition()
				.duration(100)
				.style("opacity", 0);

			svg.selectAll(".state_type_rect_text")
				.transition()
				.duration(100)
				.style("opacity", 0);

			for (var c=init_offset_days; c<=num_days+init_offset_days; c++) {
				cdt = columns[c].split("_")[0];
				current_date = new Date(cdt);
				ldt = columns[num_days+1].split("_")[0];

				var anm = svg.selectAll(".state_fatality_circles")
							.transition()
							.delay(function(d,i) { return (c-1)*step_delay; })
							.duration(step_duration)
							.attr("cx", function(d,i) {
								//console.log(d[cdt+"_cases"]);
								return x(d[cdt+"_testspm"]);
							})
							.attr("cy", function(d,i) {
								//return y(d[cdt+"_deaths"]);
								return y(d[cdt+"_ntod"]);
							})
							.attr("fill", function(d,i) {
								return state_fatality_rate_color_scale(d[cdt+"_deaths"]);
							})
							.attr("r", function(d,i) {
								//console.log(d.testspm/500);
								//return Math.log10(d.cases)*3; //d.testspm/100;
								return Math.log10(d.cases)/4+"rem";
							});

				svg.selectAll(".state_fatality_text")
						.transition()
						.delay(function(d,i) { return (c-1)*step_delay; })
						.duration(step_duration)
						.attr("x", function(d,i) {
							return x(d[cdt+"_testspm"]+500);
						})
						.attr("y", function(d,i) {
							return y(d[cdt+"_ntod"]+5);
						})

				svg.selectAll(".state_fatality_rate_date_label")
						.transition()
						.delay(function(d,i) { return (c-1)*step_delay; })
						.duration(step_duration)
						.text(current_date.getDate() + " " + month_list[current_date.getMonth()]);

				if (c==num_days+init_offset_days) {
					//setTimeout(function(){}, 10*1000);
					//anm.on("end", repeat_circles_transition);
					anm.on("end", on_transition_end);
				}

				function on_transition_end() {
					
					svg.selectAll(".state_type_rect")
						.transition()
						.duration(100)
						.style("opacity", 0.5);
					svg.selectAll(".state_type_rect_text")
						.transition()
						.duration(100)
						.style("opacity", 1);
					setTimeout(repeat_circles_transition, 10*1000);
				}
				
			}
		}

	});

}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

/*Update axis
x.domain([0, d3.max(data, function(d) { return d[cdt+"_cases"]; })]);
	y.domain([0, d3.max(data, function(d) { return d[cdt+"_deaths"]; })]);


// Update X Axis
//http://bl.ocks.org/WilliamQLiu/bd12f73d0b79d70bfbae
svg.select(".state_fatality_xaxis")
    .transition()
	.delay((c-1)*200)
    .duration(200)
    .call(xAxis);

svg.select(".state_fatality_yaxis")
    .transition()
	.delay((c-1)*200)
    .duration(200)
    .call(yAxis);
*/