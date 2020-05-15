idname = "#country_case_count";
d3.select(idname).select("svg").remove();
filename = "data/country_case_count.csv";
width_scale_factor = 0.80;
height_scale_factor = 0.40;
var bb = d3.select(idname).node().offsetWidth;
var margin = {right:20, left:30, top:10, bottom:30};
base_width = bb*width_scale_factor - margin.left - margin.right;
base_height = bb*height_scale_factor - margin.top - margin.bottom;
draw_country_daily_case_count(idname, filename, base_width, base_height);

var default_background_color_country_case_count = "#808080";
//var country_case_count_highlight_list = ["Switzerland","Germany","Spain","France","United-Kingdom",
//    							"Italy", "Netherlands", "Sweden", "China", "India", "Iran", "Japan",
//    							"South-Korea", "Singapore","United-States"];

var country_case_count_highlight_list = ["Germany","Spain","France",
    							"Italy", "China", "India", "Japan",
    							"South-Korea", "Singapore","United-States", "Austria"];
var country_case_count_list = [];


function draw_country_daily_case_count(idname, filename, width, height) {

	// parse the date / time
    var country_current_case_count = [];
    

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip_country_daily_case_count")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    //var x = d3.scaleBand().rangeRound([0, width], .05).padding(0.1);
	var x = d3.scaleLinear().range([0, width]);
    //var y = d3.scaleLinear().range([height, 0]);
    var y = d3.scaleLog().range([height, 0]).base(10);

	var svg = d3.select(idname).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv(filename, function(error, data_csv) {
		if (error) throw error;

		var dates = d3.keys(data_csv[0]);
		//console.log(dates[0]);
		idx = 0;
		var date_data = [];
	    var case_count_1000 = [];
    	var case_count_10000 = [];
    	var case_count_100000 = [];
    	
		for (var i=0; i<dates.length-1; i++) {
			date_data[idx] = [];
			date_data[idx].date = dates[i];

			case_count_1000[idx] = [];
			case_count_1000[idx].date = date_data[idx].date;
			case_count_1000[idx].rate = 1000;

			case_count_10000[idx] = [];
			case_count_10000[idx].date = date_data[idx].date;
			case_count_10000[idx].rate = 10000;

			case_count_100000[idx] = [];
			case_count_100000[idx].date = date_data[idx].date;
			case_count_100000[idx].rate = 100000;

			idx += 1
		}


		var case_count_double6 = [];
		case_count_double6[0] = [];
		case_count_double6[0].date = date_data[0].date;
		case_count_double6[0].rate = 200;
		case_count_double6[1] = [];
		case_count_double6[1].date = date_data[80].date;
		case_count_double6[1].rate = 200*Math.pow(2, 80/6);

		var case_count_double3 = [];
		case_count_double3[0] = [];
		case_count_double3[0].date = date_data[0].date;
		case_count_double3[0].rate = 200;
		case_count_double3[1] = [];
		case_count_double3[1].date = date_data[40].date;
		case_count_double3[1].rate = 200*Math.pow(2, 40/3);

		console.log(case_count_double6);

		// Country loop
		for (var dt=0; dt<data_csv.length; dt++){
		//for (var dt=0; dt<1; dt++){
			var didx = 0;
			var data = [];
			country_case_count = data_csv[dt]; //.slice(1, data_csv.length-1));
			country_name = data_csv[dt].country.split(" ").join("-"); // country_case_count[dates[0]].replace(/\./g,"").replace(", ","_").split(" ").join("-");

			country_color = continent_color_mapping(country_continent_mapping[country_name.split("-").join(" ")]);
			country_case_count_list.push(country_name);

			// Dates loop
			for (var i=1; i<dates.length-1; i++) {
				case_count = parseFloat(country_case_count[dates[i]]);
				if (!isNaN(case_count)) {
					data[didx] = [];
					data[didx].date = +dates[i];
					data[didx].rate = case_count;
					didx += 1;
				}
	    	}
    		country_current_case_count[country_name] = data[didx-1].rate;

		    //x.domain(data.map(function(d) {return d.date;}));
	    	//var y = d3.scaleLog().domain([1, 1400]).range([height, 0]); //.base(10);
			//x.domain([0, dates.length]);
			x.domain([0, 80]);
		    y.domain([200, 1200000]);

		    //console.log(data);

    		// define the line
			var valueline = d3.line()
				.x(function(d) {
					return x(d.date);
				})
				.y(function(d) {
					return y(d.rate);
				});

			// Add the valueline path.
			path = svg.append("path")
	                .data([data])
	                .attr("class", country_name+"_country_case_count_curve country_case_count_curve")
	                .attr("d", valueline)
	                .attr("fill", "none")
	                .attr("stroke-width", "1.5px")
	                .style("z-index", 0)
	                .attr("stroke", function() {
				      	if (country_case_count_highlight_list.includes(country_name)) {
				      			return country_color;
		                	} else {
		                		return default_background_color_country_case_count; 
		                	}
		                })
	                .attr("opacity", function() {
			      		if (country_case_count_highlight_list.includes(country_name)) {
			      			return 1;
			      		} else {
			      			return 0.5;
			      		}
		      		})
	                .on("mouseover", function(d,i) {
                    	country_name = this.getAttribute("class").split("_country_case_count_curve")[0];
						show_selected_country_case_count(country_name);

                    	return tooltip.html(`<div class='well district_daily_state_name_tooltip'>`+
                                                  `<span class="district_daily_state_name text-center">`+country_name.split("-").join(" ")+`</span></br>` +
                                                `<span class="district_daily_case_count_info">`+ numberWithCommas(country_current_case_count[country_name]) +`</span> cases</div>` )
                                          .style("visibility", "visible");
	                })
	                .on("mousemove", function(){
                        return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                    })
	                .on("mouseout", function(d,i) {
						show_all_countries_case_count_button_click_handler();
                        return tooltip.style("visibility", "hidden");
	                });

	        svg.selectAll(".dot")
	      		.data(data)
	          .enter().append("circle")
	      		.attr("class", function(d) {
	      			return country_name+"_country_case_count_circles country_case_count_circles"
	      		})
	      		.attr("cx", function(d,i) {
	      			return x(d.date);
	      		})
	      		.attr("cy", function(d,i) {
	      			return y(d.rate);
	      		})
	      		.attr("r", "0.15rem")
	      		.style("fill", country_color)
	      		.attr("opacity", function(d) {
	      			if (country_case_count_highlight_list.includes(country_name)) {
	      				return 1;
	      			} else {
	      				return 0;
	      			}
	      		})
	      		.on("mouseover", function(d,i) {
                	country_name = this.getAttribute("class").split("_country_case_count_circles")[0];
					show_selected_country_case_count(country_name);

                	return tooltip.html(`<div class='well district_daily_state_name_tooltip'>`+
                                              `<span class="district_daily_state_name text-center">`+country_name.split("-").join(" ")+`</span></br>` +
                                            `<span class="district_daily_case_count_info">`+ numberWithCommas(country_current_case_count[country_name]) +`</span> cases</div>` )
                                      .style("visibility", "visible");
                })
                .on("mousemove", function(){
                    return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
                })
                .on("mouseout", function(d,i) {
					show_all_countries_case_count_button_click_handler();
                    return tooltip.style("visibility", "hidden");
                });

                svg.append("text")
		        	.attr("class", country_name+"_label label")
		        	.attr("x", x(data[didx-1].date+1))
		        	.attr("y", y(data[didx-1].rate))
		        	.text(country_name)
		        	.style("font-size", "0.75rem")
		        	.style("font-weight", "bold")
		        	.style("fill", country_color)
		        	.attr("opacity", function() {
		      			if (country_case_count_highlight_list.includes(country_name)) {
		      				return 1;
		      			} else {
		      				return 0;
		      			}
		      		});

	    }
		set_select_country_case_count(country_case_count_list);


	    var xAxis = d3.axisBottom()
                .scale(x)
                //.tickFormat(d3.timeFormat("%b %e"))
                //.tickValues(x.domain().filter(function(d,i){ return !(i%5)}))
	            .tickSize(0)
          		.tickPadding(5);


        var yAxis = d3.axisLeft()
	                  .scale(y)
	                  .tickFormat( (d,i) => {
	                  		if (d==1000000) {
	                  			return d/1e6+"M";
			                }  else if ((d==1000) || (d==10000) || (d==100000) ) {
		                    	return d/1000+"k";
		                    }
		                  })
	                  .tickSize(0)
          			  .tickPadding(2);

		// add the x Axis
		svg.append("g")
		  .attr("transform", "translate(0," + (height+5) + ")")
		  .attr("class", "label_histogram")
		  .call(xAxis)
		  .style("font-size", "0.75rem")
		.append("text")
		  .attr("class", "label_histogram")
		  .attr("x", width)
		  .attr("y", -10)
		  .text(function(){
              return "Days since 200th case";
          })
		  .style("text-anchor", "end")
		  .style("fill", "black")
		  .style("font-size", "0.75rem");


		// add the y Axis
		svg.append("g")
		  .attr("class", "label_histogram axis--y")
		  //.attr("transform", "translate("+(-10)+",0)")
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
          .style("font-size", "0.75rem");

		
		// Horizontal grid lines
		horizontal_grid_lines_data = [case_count_1000, case_count_10000, case_count_100000];
		for (var hg=0; hg<=horizontal_grid_lines_data.length-1; hg++) {
			svg.append("path")
	            .data([horizontal_grid_lines_data[hg]])
	            .attr("d", valueline)
	            .attr("fill", "none")
	            .attr("stroke", "#c0c0c0")
	            .attr("stroke-width", "1.5px")
	            .attr("stroke-dasharray", 2);
        }
        horizontal_grid_lines_data = [case_count_double6, case_count_double3];
		for (var hg=0; hg<=horizontal_grid_lines_data.length-1; hg++) {
			svg.append("path")
	            .data([horizontal_grid_lines_data[hg]])
	            .attr("d", valueline)
	            .attr("fill", "none")
	            .attr("stroke", "#3cb44b")
	            .attr("stroke-width", "1.5px");
	            //.attr("stroke-dasharray", 2);
        }

        svg.append("text")
        	//.attr("class", country_name+"_label label")
        	.attr("x", x(65))
        	.attr("y", y(600000))
        	.text("Doubles every 6 days")
        	.style("font-size", "0.75rem")
        	.style("font-weight", "bold")
        	.style("fill", "#3cb44b")
        	.attr("opacity", function() {
      			return 1;
      		});

      	svg.append("text")
        	//.attr("class", country_name+"_label label")
        	.attr("x", x(30))
        	.attr("y", y(600000))
        	.text("Doubles every 3 days")
        	.style("font-size", "0.75rem")
        	.style("font-weight", "bold")
        	.style("fill", "#3cb44b")
        	.attr("opacity", function() {
      			return 1;
      		});

	});
}


$("#select_country_case_count").change(function() {
    country_name = this.value;
	if (country_name=="") {
		show_all_countries_case_count_button_click_handler();
	} else {
		show_selected_country_case_count(country_name);
	}
});



function show_selected_country_case_count(country_name) {
	//country_color = country_color_mapping[country_name];
	country_color = continent_color_mapping(country_continent_mapping[country_name.split("-").join(" ")]);

	d3.selectAll(".country_case_count_curve").attr("stroke", default_background_color_country_case_count).attr("opacity", 0.25).attr("stroke-width", "2px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".country_case_count_circles").attr("opacity", 0);
	
	d3.select("."+country_name+"_country_case_count_curve").attr('stroke-width', "2px").attr("stroke", country_color).attr("opacity", 1.0);
	d3.select("."+country_name+"_label").attr("opacity", 1);
	d3.selectAll("."+country_name+"_country_case_count_circles").attr("opacity", 1);
}


$("#show_all_countries_case_count").click(function() {
    show_all_countries_case_count_button_click_handler();
    $('#select_country_case_count').val("").trigger('change');
});

function show_highlight_countries_case_count() {
	for (var h=0; h<country_case_count_highlight_list.length; h++) {
		country_name = country_case_count_highlight_list[h];
		country_color = continent_color_mapping(country_continent_mapping[country_name.split("-").join(" ")]);

		d3.select("."+country_name+"_country_case_count_curve").attr('stroke-width', "2px").attr("stroke", country_color).attr("opacity", 1.0);
		d3.select("."+country_name+"_label").attr("opacity", 1);
		d3.selectAll("."+country_name+"_country_case_count_circles").attr("opacity", 1);
	}
}

function set_select_country_case_count(country_case_count_list) {
    var country_list = '';
    for (var i=0; i<country_case_count_list.length; i++) {
    	country_name = country_case_count_list[i]; //.split("_")[0].replace("-", " ")
        country_list += `<option value="`+country_name+`">`+country_name+`</option>`;
    }
    $('#select_country_case_count').append(country_list);
}

function show_all_countries_case_count_button_click_handler() {
	d3.selectAll(".country_case_count_curve").attr("stroke", default_background_color_country_case_count).attr("opacity", 0.5).attr("stroke-width", "1.5px");
	d3.selectAll(".label").attr("opacity", 0);
	d3.selectAll(".country_case_count_circles").attr("opacity", 0);

	show_highlight_countries_case_count();
}






